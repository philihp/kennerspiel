/** @type {import('next').NextConfig} */
const nextConfig = {
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
