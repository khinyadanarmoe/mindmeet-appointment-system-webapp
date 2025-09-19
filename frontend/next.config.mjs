/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NODE_ENV === 'production' ? '/mindmeet' : '',
  images: {
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;
