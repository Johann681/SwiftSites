import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000", // if backend serves images from here
      },
      {
        protocol: "https",
        hostname: "**", // allow all https domains (for demos or deployed assets)
      },
    ],
  },
};

export default nextConfig;
