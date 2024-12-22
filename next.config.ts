import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["res.cloudinary.com"]
  },
  output: "standalone",
  distDir: "out"
};

export default nextConfig;
