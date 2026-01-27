// next.config.js - Opción B (con trailing slash)
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/desa_medicamentos',
  assetPrefix: '/desa_medicamentos',
  trailingSlash: false, // ← Si la Opción A falla, prueba con true
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    path: '/desa_medicamentos/_next/image',
  },
};

module.exports = nextConfig;