/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use basePath in production for Azure App Service deployment
  ...(process.env.NODE_ENV === 'production' && {
    basePath: '/app/mindmeet/portal',
    assetPrefix: '/app/mindmeet/portal',
  }),
  
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
