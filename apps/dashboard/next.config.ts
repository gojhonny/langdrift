import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./app/lib/i18n/request.ts')

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
        ]
      }
    ]
  },
  // AGENT: output: 'standalone' is not needed for dashboard since it's not a standalone app
  // output: 'standalone',
  transpilePackages: ['@repo/design-tokens', '@repo/react']
}

export default withNextIntl(nextConfig)
