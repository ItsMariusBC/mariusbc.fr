/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  webpack: (config) => {
    config.externals.push('@prisma/client');
    return config;
  },
  output: 'standalone',
}

module.exports = nextConfig;