import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Consume workspace packages as source (no separate build step).
  transpilePackages: ["@whiskymart/types"],
  // Lint is run as a dedicated CI step (`pnpm lint`); don't couple it to builds.
  eslint: { ignoreDuringBuilds: true },
  // Type errors SHOULD fail the build, keep this false.
  typescript: { ignoreBuildErrors: false },
  // Atmosphere photography (public/photo) is served as AVIF/WebP.
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
