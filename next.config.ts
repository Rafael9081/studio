import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      }
    ],
  },
  experimental: {
    // This is required to allow requests from the development environment.
    allowedDevOrigins: ["*.cloudworkstations.dev"],
    serverComponentsExternalPackages: ['firebase-admin'],
  },
};

// Resetting cache
export default nextConfig;
