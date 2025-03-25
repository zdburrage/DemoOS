// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    
    webpack: (config, { isServer }) => {
      if (!isServer) {
        // Next.js 15 way of providing Node.js polyfills
        config.resolve.fallback = {
          ...config.resolve.fallback,
          crypto: false,
          stream: false,
          buffer: false,
          util: false,
          // Add any other Node.js built-ins that are causing issues
        };
      }
      
      return config;
    },
  }
  
  module.exports = nextConfig;