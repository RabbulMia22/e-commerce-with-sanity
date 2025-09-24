import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
   remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cdn.sanity.io',
      port: '',
      pathname: '/images/**',
    }
   ]
  },
  // Optimize for Vercel deployment
  experimental: {
    // Enable static optimization
    optimizePackageImports: ['lucide-react', '@sanity/image-url']
  },
  // Ensure proper TypeScript handling
  typescript: {
    ignoreBuildErrors: false,
  },
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  }
};

export default nextConfig;
