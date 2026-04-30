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
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SENDER_EMAIL: process.env.SENDER_EMAIL,
    TIGRIS_STORAGE_ACCESS_KEY_ID: process.env.TIGRIS_STORAGE_ACCESS_KEY_ID,
    TIGRIS_STORAGE_SECRET_ACCESS_KEY: process.env.TIGRIS_STORAGE_SECRET_ACCESS_KEY,
    TIGRIS_STORAGE_ENDPOINT: process.env.TIGRIS_STORAGE_ENDPOINT,
    TIGRIS_STORAGE_BUCKET: process.env.TIGRIS_STORAGE_BUCKET,
  },
});
