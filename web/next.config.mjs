/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: process.env.LINT_ON_BUILD,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hathora-et-labora.s3-us-west-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
