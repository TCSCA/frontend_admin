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