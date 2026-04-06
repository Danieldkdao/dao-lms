import { Logo } from "@/components/logo";
import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full h-svh py-10 px-6 overflow-auto flex items-center justify-center">
      <div className="w-full max-w-105 flex flex-col items-center gap-4">
        <Logo />
        {children}
        <span className="text-muted-foreground text-center max-w-70">
          By clicking continue, you agree to our{" "}
          <span className="font-medium underline">Terms of Service</span> and{" "}
          <span className="font-medium underline">Privacy Policy</span>
        </span>
      </div>
    </div>
  );
};

export default AuthLayout;
