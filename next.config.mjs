/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '')],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
}

export default nextConfig
