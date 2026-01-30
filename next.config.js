// next.config.js - Opción B (con trailing slash)
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/i_admininstrativo',
  assetPrefix: '/i_admininstrativo',
  trailingSlash: false, // ← Si la Opción A falla, prueba con true
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    path: '/i_admininstrativo/_next/image',
  },
};

module.exports = nextConfig;