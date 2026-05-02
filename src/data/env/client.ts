import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const envClient = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    NEXT_PUBLIC_TIGRIS_STORAGE_BUCKET: z.string().min(1),
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_TIGRIS_STORAGE_BUCKET:
      process.env.NEXT_PUBLIC_TIGRIS_STORAGE_BUCKET,
  },
});
