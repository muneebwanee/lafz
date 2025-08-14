import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Export static HTML for GitHub Pages
  output: 'export',
  basePath: '/lafz',          // repo name
  assetPrefix: '/lafz/',      // ensures assets load correctly
  trailingSlash: true,        // /about -> /about/index.html

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    unoptimized: true, // required for GitHub Pages (no image optimizer)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
