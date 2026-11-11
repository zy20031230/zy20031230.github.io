import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/autoresearch-demo",
  assetPrefix: "/autoresearch-demo",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
