import { Logo } from "@/components/dashboard/logo";
import { DashboardNavLink } from "@/components/public/dashboard-nav-link";
import { HomeUserProfileSuspense } from "@/components/public/home-user-profile-suspense";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

export const PublicNavbar = () => {
  return (
    <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-100">
      <div className="mx-auto flex h-20 w-full max-w-[1500px] items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="DaoLMS home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-5 text-base font-medium text-muted-foreground md:flex">
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <Link
              href="/courses"
              className="transition-colors hover:text-foreground"
            >
              Courses
            </Link>
            <Suspense
              fallback={
                <Link
                  href="/sign-in"
                  className="transition-colors hover:text-foreground"
                >
                  Dashboard
                </Link>
              }
            >
              <DashboardNavLink />
            </Suspense>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Suspense
            fallback={
              <Button asChild variant="outline">
                <Link href="/sign-in">Sign In</Link>
              </Button>
            }
          >
            <HomeUserProfileSuspense />
          </Suspense>
        </div>
      </div>
    </header>
  );
};
