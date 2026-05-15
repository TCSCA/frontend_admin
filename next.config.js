// next.config.js - Opción B (con trailing slash)
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/ordenesmedicas',
  assetPrefix: '/ordenesmedicas',
  trailingSlash: false, // ← Si la Opción A falla, prueba con true
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    deviceSizes: [],
    imageSizes: [],
    unoptimized: true,
    path: '/ordenesmedicas/_next/image',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'front.tcs.com.ve',
        port: '',
        // ⚠️ IMPORTANTE: Incluye la doble barra '//' como está en tu URL
        pathname: '/desa_apiMedicamentos/storage/deliveryNotes/**',
      },
    ],
  },
};

module.exports = nextConfig;