import { envServer } from "@/data/env/server";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  allowedDevOrigins: ["chiffonade-nonadministrable-alyse.ngrok-free.dev"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${envServer.TIGRIS_STORAGE_BUCKET}.t3.tigrisfiles.io`,
      },
    ],
  },
};

export default nextConfig;
