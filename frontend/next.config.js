/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    apiBase: "http://localhost:1337/api",
  },
  images: {
    domains: ["localhost"],
  },
};

module.exports = nextConfig;
