import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/growth/copilot",
  images: { unoptimized: true },
};

export default nextConfig;
