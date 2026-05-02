import { auth } from "@/lib/auth/auth";
import { getDashboardHref } from "@/lib/auth/helpers";
import { headers } from "next/headers";
import Link from "next/link";

export const DashboardNavLink = async () => {
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
