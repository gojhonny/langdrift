import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // AGENT: output: 'standalone' is not needed for dashboard since it's not a standalone app
  // output: 'standalone',
  transpilePackages: ['@repo/design-tokens', '@repo/react']
}

export default nextConfig
