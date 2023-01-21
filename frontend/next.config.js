/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    apiBase: "http://localhost:1337/api",
  },
  images: {
    domains: ["utah-soccer-blog.s3.us-west-1.amazonaws.com"],
  },
};

module.exports = nextConfig;
