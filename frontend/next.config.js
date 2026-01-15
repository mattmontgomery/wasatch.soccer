/** @type {import('next').NextConfig} */
console.log(process.env.AWS_BUCKET)
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.AWS_BUCKET,
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/mmontgomery/image/**",
      },
    ]
  },
};

module.exports = nextConfig;
