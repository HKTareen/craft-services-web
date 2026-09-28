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
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value:
              "craft-services-web--artisan-craft-services.us-central1.hosted.app",
          },
        ],
        destination: "https://finitionpeinture.com/:path*",
        permanent: true,
      },
      {
        source: "/",
        has: [
          {
            type: "host",
            value:
              "craft-services-web--artisan-craft-services.us-central1.hosted.app",
          },
        ],
        destination: "https://finitionpeinture.com/fr",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
