/** @type {import('next').NextConfig} */
const nextConfig = {
  // Stable config for Next.js 15
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
