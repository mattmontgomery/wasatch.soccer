/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [process.env.AWS_BUCKET ?? ""],
  },
};

module.exports = nextConfig;
