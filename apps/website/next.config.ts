import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@repo/design-system', '@repo/react']
}

export default nextConfig
