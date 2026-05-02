import { PublicNavbar } from "@/components/public/public-navbar";
import { ReactNode } from "react";

const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <PublicNavbar />
      <div className="mx-auto max-w-[1500px] px-6 py-10">{children}</div>
    </main>
  );
};

export default PublicLayout;
