/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [process.env.AWS_BUCKET].filter(Boolean),
  },
};

module.exports = nextConfig;
