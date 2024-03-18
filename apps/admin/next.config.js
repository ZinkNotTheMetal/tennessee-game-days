/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  compiler: {
    removeConsole: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https', // Specify the protocol (http or https)
        hostname: 'cf.geekdo-images.com', // The remote domain you want to allow
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'wowjohn.com',
        pathname: '**',
      },
    ],
  },
  swcMinify: true,
};

module.exports = nextConfig;
