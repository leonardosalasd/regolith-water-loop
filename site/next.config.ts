import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Lint runs in CI (pnpm lint), not in the deploy build: a style warning
  // should never block a deployment.
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
