/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [process.env.AWS_BUCKET],
  },
};

module.exports = nextConfig;
