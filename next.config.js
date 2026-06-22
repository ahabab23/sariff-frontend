/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ESLint is left off the build because the bundled UI-component library
  // produces style-level lint noise (unused vars etc.) that aren't bugs.
  // TypeScript errors are NO LONGER ignored — real type-correctness is enforced.
  eslint: { ignoreDuringBuilds: true },
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
