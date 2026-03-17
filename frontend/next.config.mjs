/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'portfolioAdmin.makulsaini.online',
          },
        ],
        destination: '/admin',
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/admin/:path*',
        has: [
          {
            type: 'host',
            value: 'portfolioweb.makulsaini.online',
          },
        ],
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
