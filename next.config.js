/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  turbopack: {},
  output: 'standalone',
}

module.exports = nextConfig;
