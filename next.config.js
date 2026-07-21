const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Ruta al .env externo en producción (en el servidor)
const prodEnvPath = '/var/www/proyecto/InterfazAdministrativa/archivos/.env';

if (fs.existsSync(prodEnvPath)) {
  console.log(`Cargando variables de entorno desde: ${prodEnvPath}`);
  const envConfig = dotenv.parse(fs.readFileSync(prodEnvPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

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
