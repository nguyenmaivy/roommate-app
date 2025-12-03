import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      '@vietmap/vietmap-gl-js': path.resolve(__dirname, 'node_modules/@vietmap/vietmap-gl-js/dist/vietmap-gl.js'),
      '@vietmap/vietmap-gl-js/dist/vietmap-gl.css': path.resolve(__dirname, 'node_modules/@vietmap/vietmap-gl-js/dist/vietmap-gl.css'),
    };

    return config;
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
