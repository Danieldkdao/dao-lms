import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/dashboard/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { auth } from "@/lib/auth/auth";
import {
  BookOpenCheckIcon,
  BarChart3Icon,
  RefreshCwIcon,
  UsersRoundIcon,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import { HomeUserProfile } from "@/components/home-user-profile";

const features = [
  {
    title: "Comprehensive Courses",
    description:
      "Access a wide range of carefully curated courses designed by industry experts.",
    icon: BookOpenCheckIcon,
  },
  {
    title: "Interactive Learning",
    description:
      "Engage with interactive content, quizzes, and assignments to enhance your learning experience.",
    icon: RefreshCwIcon,
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your progress and achievements with detailed analytics and personalized dashboards.",
    icon: BarChart3Icon,
  },
  {
    title: "Community Support",
    description:
      "Join a vibrant community of learners and instructors to collaborate and share knowledge.",
    icon: UsersRoundIcon,
  },
];

const getDashboardHref = (role?: string | null) => {
  if (!role) return "/sign-in";

  return role === "admin" ? "/admin" : "/dashboard";
};

const DashboardNavLink = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <Link
      href={getDashboardHref(session?.user.role)}
      className="transition-colors hover:text-foreground"
    >
      Dashboard
    </Link>
  );
};

const HomeUserProfileSuspense = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return (
      <Button asChild variant="outline">
        <Link href="/sign-in">Sign In</Link>
      </Button>
    );
  }

  return (
    <HomeUserProfile
      dashboardHref={getDashboardHref(session.user.role)}
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }}
    />
  );
};

const HeroSecondaryAction = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const isSignedIn = !!session;

  return (
    <Button
      asChild
      size="lg"
      variant="outline"
      className="h-14 min-w-36 text-base"
    >
      <Link href={getDashboardHref(session?.user.role)}>
        {isSignedIn ? "Dashboard" : "Sign In"}
      </Link>
    </Button>
  );
};

const HomePage = () => {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <header className="border-b bg-background/95">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
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

      <section className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 pt-28 text-center md:pt-36">
        <div className="border bg-card px-3 py-1 text-sm font-semibold text-muted-foreground shadow-xs">
          The Future of Online Learning
        </div>
        <h1 className="mt-8 max-w-5xl text-5xl font-bold leading-none text-foreground md:text-7xl">
          Elevate Your Learning Experience
        </h1>
        <p className="mt-10 max-w-3xl text-xl leading-8 text-muted-foreground md:text-2xl md:leading-9">
          Discover a new way to learn with our modern, interactive learning
          management system. Access high-quality courses anytime, anywhere.
        </p>

        <div className="mt-24 flex flex-col items-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="h-14 min-w-56 text-base">
            <Link href="/courses">Explore Courses</Link>
          </Button>
          <Suspense
            fallback={
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 min-w-36 text-base"
              >
                <Link href="/sign-in">Sign In</Link>
              </Button>
            }
          >
            <HeroSecondaryAction />
          </Suspense>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-6 pb-14 pt-28 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="min-h-72 rounded-lg border bg-card shadow-none"
          >
            <CardContent className="flex h-full flex-col justify-center gap-8 p-8">
              <feature.icon className="size-12 text-primary" />
              <div className="space-y-7 text-left">
                <h2 className="text-xl font-semibold text-card-foreground">
                  {feature.title}
                </h2>
                <p className="text-lg leading-8 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
};

export default HomePage;
