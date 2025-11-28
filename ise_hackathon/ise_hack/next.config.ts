/** @type {import('next').NextConfig} */

const nextConfig = {
  // Enable Turbopack (default in Next.js 16)
  turbopack: {},
  
  // Optional: Page data threshold
  experimental: {
    largePageDataBytes: 150 * 1024
  }
};

module.exports = nextConfig;

