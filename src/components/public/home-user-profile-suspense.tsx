import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Button } from "../ui/button";
import Link from "next/link";
import { HomeUserProfile } from "../home-user-profile";
import { getDashboardHref } from "@/lib/auth/helpers";

export const HomeUserProfileSuspense = async () => {
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
