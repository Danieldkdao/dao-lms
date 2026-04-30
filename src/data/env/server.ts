import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const envServer = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    SMTP_USER: z.string().min(1),
    SMTP_PASS: z.string().min(1),
    SENDER_EMAIL: z.string().min(1),
    TIGRIS_STORAGE_ACCESS_KEY_ID: z.string().min(1),
    TIGRIS_STORAGE_SECRET_ACCESS_KEY: z.string().min(1),
    TIGRIS_STORAGE_ENDPOINT: z.string().min(1),
    TIGRIS_STORAGE_BUCKET: z.string().min(1),
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: process.env,
});
