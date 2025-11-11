import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack5: true,

  webpack(config) {
    config.resolve.fallback = {
      // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped.
      ...config.resolve.fallback,

      fs: false, // the solution
    };

    return config;
  },

  serverExternalPackages: ["pdf-parse"],
  
  images: {
    domains: ["yxvffiodqfhbepaiqgjo.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
