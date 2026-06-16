import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Point tracing root to the monorepo root so docs/ is reachable
  outputFileTracingRoot: path.join(__dirname, '../'),
  // Bundle the strategy skill into the API route function
  outputFileTracingIncludes: {
    '/api/[transport]': ['docs/ora-et-labora-strategy-SKILL.md'],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: process.env.LINT_ON_BUILD === 'true',
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
