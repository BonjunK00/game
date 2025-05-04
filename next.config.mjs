/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  compiler: { removeConsole: false },
  images: { remotePatterns: [{ hostname: '*' }], path: '/_next/image' },
  productionBrowserSourceMaps: true,
  basePath: '/game',
  assetPrefix: '/game',
};

export default nextConfig;