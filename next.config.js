// next.config.js - Opción B (con trailing slash)
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/i_administrativo',
  assetPrefix: '/i_administrativo',
  trailingSlash: false, // ← Si la Opción A falla, prueba con true
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    path: '/i_administrativo/_next/image',
  },
};

module.exports = nextConfig;