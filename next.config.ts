import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Disable ESLint checks on Vercel builds
  },
};

export default nextConfig;
