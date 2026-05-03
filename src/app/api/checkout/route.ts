import { envClient } from "@/data/env/client";
import { db } from "@/db/db";
import { CourseTable, UserRole } from "@/db/schema";
import { userHasCourse } from "@/features/enrollments/lib/helpers";
import { auth } from "@/lib/auth/auth";
import { UNAUTHED_MESSAGE } from "@/lib/auth/constants";
import { isAdminRole } from "@/lib/auth/helpers";
import { stripe } from "@/services/stripe/stripe";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json(
      { error: true, message: UNAUTHED_MESSAGE },
      { status: 401 },
    );
  }

  const { courseId }: { courseId: string } = await req.json();
  if (!courseId) {
    return NextResponse.json(
      { error: true, message: "No course id provided." },
      { status: 400 },
    );
  }

  const [existingCourse] = await db
    .select()
    .from(CourseTable)
    .where(eq(CourseTable.id, courseId))
    .limit(1);

  if (!existingCourse || existingCourse.status !== "published") {
    return NextResponse.json(
      { error: true, message: "Course not found." },
      { status: 404 },
    );
  }

  if (isAdminRole(session.user.role as UserRole)) {
    return NextResponse.json(
      { error: true, message: "You are not allowed to enroll in this course." },
      { status: 403 },
    );
  }

  const alreadyOwned = await userHasCourse(session.user.id, existingCourse.id);
  if (alreadyOwned) {
    return NextResponse.json(
      { error: true, message: "You are already enrolled in this course." },
      { status: 409 },
    );
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price: existingCourse.stripePriceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId: session.user.id,
      courseId: existingCourse.id,
    },
    customer_email: session.user.email,
    success_url: `${envClient.NEXT_PUBLIC_APP_URL}/payment/success`,
    cancel_url: `${envClient.NEXT_PUBLIC_APP_URL}/payment/cancel`,
  });

  return NextResponse.json({
    error: false,
    message: "Checkout session created successfully!",
    url: checkoutSession.url,
  });
};
