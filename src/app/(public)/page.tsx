import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import { getDashboardHref } from "@/lib/auth/helpers";
import {
  BarChart3Icon,
  BookOpenCheckIcon,
  RefreshCwIcon,
  UsersRoundIcon,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

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
    <div>
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
    </div>
  );
};

export default HomePage;
