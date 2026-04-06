"use client";

import { authClient } from "@/lib/auth/auth-client";
import { Setter } from "@/lib/types";
import { borderRedError } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Field, FieldDescription, FieldError } from "../ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import { LoadingSwap } from "../ui/loading-swap";

const formSchema = z.object({
  otp: z.string().length(6, { error: "OTP must be 6 characters long." }),
});

type FormType = z.infer<typeof formSchema>;

type VerifyOtpProps = {
  verifyEmail: string;
  setVerifyEmail: Setter<string | null>;
};

export const VerifyOtp = ({ verifyEmail, setVerifyEmail }: VerifyOtpProps) => {
  const router = useRouter();
  const [timeToResend, setTimeToResend] = useState(30);
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (timeToResend <= 0) return;
    const interval = setInterval(() => {
      if (timeToResend <= 0) return;
      setTimeToResend((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeToResend]);

  const handleVerification = async ({ otp }: FormType) => {
    await authClient.emailOtp.verifyEmail({
      email: verifyEmail,
      otp,
      fetchOptions: {
        onSuccess: () => {
          router.push("/dashboard");
          setVerifyEmail(null);
        },
        onError: (error) => {
          toast.error(
            error.error.message || "Failed to verify email. Please try again.",
          );
        },
      },
    });
  };

  const handleResend = async () => {
    await authClient.emailOtp.sendVerificationOtp(
      {
        email: verifyEmail,
        type: "email-verification",
      },
      {
        onSuccess: () => {
          setTimeToResend(30);
          toast.success("Verification OTP sent successfully!");
        },
        onError: (error) => {
          toast.error(
            error.error.message ||
              "Failed to send verification email. Please try again.",
          );
        },
      },
    );
  };

  const handleGoBack = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setVerifyEmail(null);
        },
        onError: (error) => {
          toast.error(
            error.error.message || "Something went wrong. Please try again.",
          );
        },
      },
    });
  };

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-4 items-center">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-2xl font-semibold text-center">
              Please check your email
            </h1>
            <p className="text-muted-foreground text-base text-center">
              We have sent a verification code to your email. Enter the code
              below to continue.
            </p>
          </div>
          <form
            onSubmit={form.handleSubmit(handleVerification)}
            className="w-full flex flex-col items-center gap-4"
          >
            <Controller
              name="otp"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="items-center">
                  <InputOTP
                    maxLength={6}
                    {...field}
                    containerClassName="w-full justify-center"
                    className={borderRedError(fieldState.error)}
                  >
                    <InputOTPGroup>
                      {Array.from({ length: 3 }).map((_, i) => (
                        <InputOTPSlot key={i} index={i} />
                      ))}
                    </InputOTPGroup>
                    <InputOTPSeparator className="invisible" />
                    <InputOTPGroup>
                      {Array.from({ length: 3 }).map((_, i) => (
                        <InputOTPSlot key={i + 3} index={i + 3} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                  <FieldDescription className="text-center">
                    Enter the 6-digit code sent to your email
                  </FieldDescription>
                  {fieldState.error && (
                    <FieldError
                      className="text-center"
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              )}
            />
            <Button className="w-full" disabled={form.formState.isSubmitting}>
              <LoadingSwap isLoading={form.formState.isSubmitting}>
                Verify Account
              </LoadingSwap>
            </Button>
          </form>
          <div className="flex items-center gap-2">
            <span className="text-base text-muted-foreground font-medium">
              Didn't receive the email?
            </span>
            <Button
              variant="ghost"
              className="text-primary font-medium tabular-nums"
              disabled={form.formState.isSubmitting || timeToResend > 0}
              onClick={handleResend}
            >
              {timeToResend <= 0
                ? "Resend email"
                : `Resend email (${timeToResend})`}
            </Button>
          </div>
          <Button
            variant="ghost"
            className="text-primary font-medium"
            onClick={handleGoBack}
          >
            Back to login
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
