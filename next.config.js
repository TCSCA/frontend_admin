/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  basePath: `/${process.env.NEXT_PUBLIC_API_BASE_URL_ASSETS}`,
  trailingSlash: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;