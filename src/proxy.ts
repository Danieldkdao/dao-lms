import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth/auth";
import { db } from "./db/db";
import { eq } from "drizzle-orm";
import { user } from "./db/schema";
import { getDashboardHref, isAdminRole } from "./lib/auth/helpers";

const authRoutes = new Set(["/sign-in", "/sign-up"]);
const protectedRoutePrefixes = ["/admin", "/dashboard"];

const matchesRoutePrefix = (pathname: string, route: string) => {
  return pathname === route || pathname.startsWith(`${route}/`);
};

const redirectTo = (request: NextRequest, pathname: string) => {
  return NextResponse.redirect(new URL(pathname, request.url));
};

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const isAuthRoute = authRoutes.has(pathname);
  const isProtectedRoute = protectedRoutePrefixes.some((route) =>
    matchesRoutePrefix(pathname, route),
  );

  if (!isAuthRoute && !isProtectedRoute) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    if (!isProtectedRoute) {
      return NextResponse.next();
    }

    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  const [existingUser] = await db
    .select({
      id: user.id,
      role: user.role,
    })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (!existingUser) {
    return isProtectedRoute
      ? redirectTo(request, "/sign-in")
      : NextResponse.next();
  }

  if (isAuthRoute) {
    return redirectTo(request, getDashboardHref(existingUser.role));
  }

  if (
    matchesRoutePrefix(pathname, "/admin") &&
    !isAdminRole(existingUser.role)
  ) {
    return redirectTo(request, "/dashboard");
  }

  if (
    matchesRoutePrefix(pathname, "/dashboard") &&
    isAdminRole(existingUser.role)
  ) {
    return redirectTo(request, "/admin");
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/sign-in", "/sign-up", "/admin/:path*", "/dashboard/:path*"],
};
