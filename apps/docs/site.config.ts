function requireOrigin(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  const url = new URL(value)

  if (url.protocol !== 'https:' && url.hostname !== 'localhost') {
    throw new Error(`${name} must use HTTPS outside localhost`)
  }

  if (url.pathname !== '/' || url.search || url.hash) {
    throw new Error(
      `${name} must be an origin without path, query, or fragment`
    )
  }

  return url.origin
}

const siteUrl = requireOrigin(
  'NEXT_PUBLIC_SITE_URL',
  process.env.NEXT_PUBLIC_SITE_URL
)
const websiteUrl = requireOrigin(
  'NEXT_PUBLIC_WEBSITE_URL',
  process.env.NEXT_PUBLIC_WEBSITE_URL
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
  productUrl: websiteUrl,
  publisher: 'LangDrift / Neongate AI',
  searchIndexable,
  url: siteUrl
})
