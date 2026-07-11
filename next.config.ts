import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Firebase Storage download URLs
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        // Google Cloud Storage public object URLs
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
