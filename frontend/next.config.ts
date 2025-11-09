import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // Resolve @vietmap/vietmap-gl-js
    config.resolve.alias = {
      ...config.resolve.alias,
      '@vietmap/vietmap-gl-js': path.resolve(__dirname, 'node_modules/@vietmap/vietmap-gl-js/dist/vietmap-gl.js'),
      '@vietmap/vietmap-gl-js/dist/vietmap-gl.css': path.resolve(__dirname, 'node_modules/@vietmap/vietmap-gl-js/dist/vietmap-gl.css'),
    };
    
    return config;
  },
};

export default nextConfig;
