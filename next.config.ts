import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Default is 1 MB; admin uploads allow up to 8 MB per image and several per request.
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
