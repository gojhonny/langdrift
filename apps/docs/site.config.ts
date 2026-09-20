function normalizeSiteUrl(value: string) {
  const url = new URL(value)

  if (url.protocol !== 'https:' && url.hostname !== 'localhost') {
    throw new Error('NEXT_PUBLIC_SITE_URL must use HTTPS outside localhost')
  }

  if (url.pathname !== '/' || url.search || url.hash) {
    throw new Error(
      'NEXT_PUBLIC_SITE_URL must be an origin without path, query, or fragment'
    )
  }

  return url.origin
}

const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3004'
)
const isHttps = siteUrl.startsWith('https://')
const searchIndexable =
  process.env.NODE_ENV === 'production' &&
  process.env.VERCEL_ENV !== 'preview' &&
  isHttps

export const siteConfig = Object.freeze({
  contentBranch: 'staging',
  description:
    'Technical documentation for the LangDrift product-context protocol, SDK, and setup package.',
  github: 'https://github.com/gojhonny/langdrift',
  homeTitle: 'LangDrift documentation',
  name: 'LangDrift Docs',
  productUrl: 'https://langdrift.md/',
  publisher: 'LangDrift / Neongate AI',
  searchIndexable,
  url: siteUrl
})
