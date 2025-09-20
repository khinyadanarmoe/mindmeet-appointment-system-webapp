/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NODE_ENV === 'production' ? '/mindmeet/admin' : '',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
    ],
    unoptimized: true,
  },
  // Ensure static assets are properly accessible from the base path
  assetPrefix: process.env.NODE_ENV === 'production' ? '/mindmeet/admin' : '',
};

export default nextConfig;
