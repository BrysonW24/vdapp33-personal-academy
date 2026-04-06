const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  outputFileTracingRoot: path.join(__dirname),
  images: {
    unoptimized: true,
  },
  redirects: async () => [
    {
      source: '/quantum',
      destination: '/quantum-science',
      permanent: true,
    },
    {
      source: '/quantum/:path*',
      destination: '/quantum-science/:path*',
      permanent: true,
    },
    {
      source: '/topics/energy',
      destination: '/energy-systems',
      permanent: true,
    },
    {
      source: '/topics/energy/:path*',
      destination: '/energy-systems/:path*',
      permanent: true,
    },
  ],
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ],
};

module.exports = nextConfig;
