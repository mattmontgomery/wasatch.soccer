/** @type {import('next').NextConfig} */
console.log(process.env.AWS_BUCKET)
const nextConfig = {
  images: {
    domains: [process.env.AWS_BUCKET].filter(Boolean),
  },
};

module.exports = nextConfig;
