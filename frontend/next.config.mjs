/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NODE_ENV === 'production' ? '/mindmeet' : '',
  images: {
    domains: ['res.cloudinary.com'],
    unoptimized: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
