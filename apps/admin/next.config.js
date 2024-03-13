/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  compiler: {
    removeConsole: false,
  },
  transpilePackages: ["ui"],
  images: {
    domains: ["cf.geekdo-images.com", "wowjohn.com"],
  },
  swcMinify: true,
};

module.exports = nextConfig
