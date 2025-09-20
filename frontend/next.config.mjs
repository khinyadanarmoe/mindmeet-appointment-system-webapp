/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use basePath in production for Azure App Service deployment
  ...(process.env.NODE_ENV === 'production' && {
    basePath: '/app/mindmeet',
    assetPrefix: '/app/mindmeet',
  }),
  
  // Use standalone for server deployment
  output: 'standalone',
  trailingSlash: true,
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
};

export default nextConfig;
