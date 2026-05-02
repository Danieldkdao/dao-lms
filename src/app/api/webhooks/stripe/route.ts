import { envServer } from "@/data/env/server";
import { db } from "@/db/db";
import { EnrollmentTable } from "@/db/schema";
import { stripe } from "@/services/stripe/stripe";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (req: NextRequest) => {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      envServer.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: true, message: "Invalid signature" },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = (await event.data.object) as Stripe.Checkout.Session;

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    const { userId, courseId } = session.metadata ?? {};

    if (!userId || !courseId) {
      console.error("Missing metadata in Stripe session:", session.id);
      return NextResponse.json(
        { error: true, message: "Missing metadata" },
        { status: 400 },
      );
    }

    const existing = await db
      .select()
      .from(EnrollmentTable)
      .where(eq(EnrollmentTable.stripeSessionId, session.id))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ received: true });
    }

    await db.insert(EnrollmentTable).values({
      userId,
      courseId,
      stripeSessionId: session.id,
      stripePaymentIntentId: (session.payment_intent as string) ?? null,
    });

    console.log(`Enrollment recorded: user=${userId} course=${courseId}`);
  }

  return NextResponse.json({ received: true });
};

export const config = {
  api: { bodyParser: false },
};
