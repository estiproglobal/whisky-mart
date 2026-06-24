import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Consume workspace packages as source (no separate build step).
  transpilePackages: ["@whiskymart/types"],
  // Lint is run as a dedicated CI step (`pnpm lint`); don't couple it to builds.
  eslint: { ignoreDuringBuilds: true },
  // Type errors SHOULD fail the build — keep this false.
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
