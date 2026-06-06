/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Don't fail the production build on lint/type errors (unblocks Vercel deploy).
  // NOTE: this ships even if type errors exist — fix them properly (see type-check) and
  // consider removing these once the codebase is clean.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    domains: ["images.unsplash.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Enable SWC minification for better performance
  swcMinify: true,
  // Optimize fonts
  optimizeFonts: true,
  // Experimental features
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "framer-motion"],
  },
  // Webpack configuration for custom imports
  webpack: (config, { isServer }) => {
    // Handle figma:asset imports
    config.resolve.alias["figma:asset"] = false;
    return config;
  },
};

module.exports = nextConfig;
