import { envServer } from "@/data/env/server";
import { transporter } from "./transporter";

type SendVerificationOtpProps = {
  email: string;
  type: "sign-in" | "change-email" | "email-verification" | "forget-password";
  otp: string;
};

const EMAIL_THEME = {
  background: "#FAF9F5",
  surface: "#F5F4EF",
  text: "#141413",
  mutedText: "#6E6D68",
  border: "#DAD9D4",
  primary: "#C96442",
  primaryForeground: "#FFFFFF",
  accent: "#535146",
  codeBackground: "#EDE9DE",
  highlightBackground: "#EFE7DB",
  radius: "6px",
};

const emailContentByType: Record<
  SendVerificationOtpProps["type"],
  {
    subject: string;
    eyebrow: string;
    heading: string;
    description: string;
    instruction: string;
  }
> = {
  "sign-in": {
    subject: "Your DaoLMS sign-in code",
    eyebrow: "Secure sign-in",
    heading: "Use this code to sign in",
    description:
      "Enter the verification code below to finish signing in to your DaoLMS account.",
    instruction: "Paste this code into the sign-in screen to continue.",
  },
  "change-email": {
    subject: "Confirm your new email for DaoLMS",
    eyebrow: "Email change",
    heading: "Confirm your new email address",
    description:
      "Use the verification code below to confirm this email address for your DaoLMS account.",
    instruction: "Enter this code to complete your email change.",
  },
  "email-verification": {
    subject: "Verify your email for DaoLMS",
    eyebrow: "Email verification",
    heading: "Verify your email address",
    description:
      "Welcome to DaoLMS. Enter the verification code below to activate your account.",
    instruction: "Type this code into the verification form to finish setup.",
  },
  "forget-password": {
    subject: "Your DaoLMS password reset code",
    eyebrow: "Password reset",
    heading: "Reset your password",
    description:
      "Use the verification code below to continue resetting your DaoLMS password.",
    instruction: "Enter this code on the password reset screen to proceed.",
  },
};

export const sendVerificationOtp = async ({
  email,
  type,
  otp,
}: SendVerificationOtpProps) => {
  const content = emailContentByType[type];
  const otpDisplay = otp.split("").join(" ");
  const text = [
    `${content.heading} - DaoLMS`,
    "",
    content.description,
    "",
    `Verification code: ${otp}`,
    content.instruction,
    "",
    "If you did not request this email, you can safely ignore it.",
  ].join("\n");

  const html = `
    <div style="margin:0;padding:32px 16px;background:${EMAIL_THEME.background};font-family:Arial,Helvetica,sans-serif;color:${EMAIL_THEME.text};">
      <div style="max-width:560px;margin:0 auto;background:${EMAIL_THEME.surface};border:1px solid ${EMAIL_THEME.border};border-radius:${EMAIL_THEME.radius};overflow:hidden;box-shadow:0 12px 30px rgba(20,20,19,0.08);">
        <div style="padding:32px;background:linear-gradient(135deg, ${EMAIL_THEME.surface} 0%, ${EMAIL_THEME.highlightBackground} 100%);border-bottom:1px solid ${EMAIL_THEME.border};color:${EMAIL_THEME.text};">
          <div style="display:inline-block;padding:6px 12px;border-radius:${EMAIL_THEME.radius};background:${EMAIL_THEME.primary};font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${EMAIL_THEME.primaryForeground};">
            ${content.eyebrow}
          </div>
          <h1 style="margin:18px 0 10px;font-size:30px;line-height:1.15;font-weight:800;">
            ${content.heading}
          </h1>
          <p style="margin:0;font-size:15px;line-height:1.7;color:${EMAIL_THEME.mutedText};">
            ${content.description}
          </p>
        </div>

        <div style="padding:32px;">
          <p style="margin:0 0 14px;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${EMAIL_THEME.accent};">
            Verification code
          </p>
          <div style="margin:0 0 20px;padding:20px 24px;border:1px solid ${EMAIL_THEME.border};border-radius:${EMAIL_THEME.radius};background:${EMAIL_THEME.codeBackground};text-align:center;">
            <div style="font-size:34px;line-height:1.1;font-weight:800;letter-spacing:0.28em;color:${EMAIL_THEME.primary};text-transform:uppercase;">
              ${otpDisplay}
            </div>
          </div>

          <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:${EMAIL_THEME.text};">
            ${content.instruction}
          </p>

          <div style="padding:16px 18px;border-radius:${EMAIL_THEME.radius};background:${EMAIL_THEME.background};border:1px solid ${EMAIL_THEME.border};">
            <p style="margin:0;font-size:14px;line-height:1.7;color:${EMAIL_THEME.mutedText};">
              This code was sent to <span style="font-weight:700;color:${EMAIL_THEME.text};">${email}</span>. If you did not request this email, you can safely ignore it.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;

  const mailOptions = {
    from: envServer.SENDER_EMAIL,
    to: email,
    subject: content.subject,
    html,
    text,
  };
  await transporter.sendMail(mailOptions);
};
