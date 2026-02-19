import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/fi-simulator",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
