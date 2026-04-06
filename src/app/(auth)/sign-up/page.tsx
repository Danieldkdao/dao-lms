"use client";

import { VerifyOtp } from "@/components/auth/verify-otp";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth/auth-client";
import { borderRedError } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa6";
import { toast } from "sonner";
import z from "zod";

const formSchema = z
  .object({
    name: z.string().trim().min(1, { error: "Please enter your name" }),
    email: z.email({ error: "Please enter a valid email." }),
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters in length." }),
    confirmPassword: z.string(),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    error: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormType = z.infer<typeof formSchema>;

const SignUpPage = () => {
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null);
  const [socialSignInLoading, setSocialSignInLoading] = useState(false);
  const { data: session } = authClient.useSession.get();
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (session && !session.user.emailVerified) {
      authClient.emailOtp
        .sendVerificationOtp({
          email: session.user.email,
          type: "email-verification",
        })
        .then(() => {
          setVerifyEmail(session.user.email);
        });
    }
  }, []);

  const handleSignUp = async (data: FormType) => {
    await authClient.signUp.email({
      ...data,
      callbackURL: "/dashboard",
      fetchOptions: {
        onSuccess: async () => {
          toast.success("Account created successfully!");
          await authClient.emailOtp.sendVerificationOtp({
            email: data.email,
            type: "email-verification",
          });
          setVerifyEmail(data.email);
        },
        onError: (error) => {
          toast.error(error.error.message || "Failed to create account");
        },
      },
    });
  };

  const handleSocialSignIn = async (provider: "github") => {
    setSocialSignInLoading(true);
    await authClient.signIn.social({
      provider,
      callbackURL: "/dashboard",
      fetchOptions: {
        onError: (error) => {
          toast.error(error.error.message || "Failed to create your account");
        },
      },
    });
    setSocialSignInLoading(false);
  };

  const signUpPending = form.formState.isSubmitting || socialSignInLoading;

  if (verifyEmail) {
    return (
      <VerifyOtp verifyEmail={verifyEmail} setVerifyEmail={setVerifyEmail} />
    );
  }

  return (
    <Card className="w-full">
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-2xl font-semibold text-center">
              Begin your Journey
            </h1>
            <p className="text-muted-foreground text-base text-center">
              Create your first account to explore our courses
            </p>
          </div>
          <div className="mt-2">
            <Button
              variant="outline"
              className="w-full"
              disabled={signUpPending}
              onClick={() => handleSocialSignIn("github")}
            >
              <LoadingSwap isLoading={signUpPending}>
                <div className="flex items-center gap-2">
                  <FaGithub />
                  Sign in with GitHub
                </div>
              </LoadingSwap>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-base text-muted-foreground">
              Or continue with
            </span>
            <Separator className="flex-1" />
          </div>
          <form
            onSubmit={form.handleSubmit(handleSignUp)}
            className="flex flex-col items-center gap-4"
          >
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Name</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Jane Doe"
                    className={borderRedError(fieldState.error)}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    {...field}
                    placeholder="janedoe@example.com"
                    className={borderRedError(fieldState.error)}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    {...field}
                    placeholder="••••••••"
                    className={borderRedError(fieldState.error)}
                    type="password"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Confirm Password</FieldLabel>
                  <Input
                    {...field}
                    placeholder="••••••••"
                    className={borderRedError(fieldState.error)}
                    type="password"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Button className="w-full" disabled={signUpPending}>
              <LoadingSwap isLoading={signUpPending}>
                <div className="flex items-center gap-2">
                  <SendIcon />
                  Continue
                </div>
              </LoadingSwap>
            </Button>
            <Link href="/sign-in" className="text-muted-foreground text-center">
              Already have an account? Sign in here
            </Link>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignUpPage;
