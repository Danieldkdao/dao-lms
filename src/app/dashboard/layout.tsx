import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense>
      <DashboardLayoutSuspense>{children}</DashboardLayoutSuspense>
    </Suspense>
  );
};

const DashboardLayoutSuspense = async ({
  children,
}: {
  children: ReactNode;
}) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user.role === "admin") return redirect("/admin");

  return children;
};

export default DashboardLayout;
