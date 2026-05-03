import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth/auth";
import { db } from "./db/db";
import { eq } from "drizzle-orm";
import { user } from "./db/schema";

const authedRoutes = ["/sign-in", "/sign-up"];
const protectedRoutes = ["/admin", "/dashboard"];

export const proxy = async (request: NextRequest) => {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const session = await auth.api.getSession({ headers: request.headers });
  const existingUser = await db.query.user.findFirst({
    where: eq(user.id, session?.user.id ?? ""),
  });
  const role = existingUser?.role;

  if (protectedRoutes.find((r) => pathname.includes(r)) && !existingUser) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (authedRoutes.includes(pathname) && existingUser) {
    return NextResponse.redirect(
      new URL(
        existingUser.role === "admin" ? "/admin" : "/dashboard",
        request.url,
      ),
    );
  }

  if (pathname.includes("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml|manifest.json|manifest.webmanifest|apple-icon.png|.*\\.[^/]+$).*)",
  ],
};
