import {
  DOCS_DEFAULT_ROUTE_SLUG,
  DOCS_ROUTE_SLUGS,
  DOCS_ROUTE_SLUG_LIST,
  docsRouteSlug,
  LANGDRIFT_LOCALES,
  localeFromDocsSlug,
  WEBSITE_LOCALE_PATHS,
  type DocsRouteSlug,
  type LangdriftLocale
} from '@repo/react/locales'

export {
  DOCS_DEFAULT_ROUTE_SLUG,
  DOCS_ROUTE_SLUGS,
  DOCS_ROUTE_SLUG_LIST,
  docsRouteSlug,
  LANGDRIFT_LOCALES,
  localeFromDocsSlug,
  WEBSITE_LOCALE_PATHS,
  type DocsRouteSlug,
  type LangdriftLocale
}

export const DOCS_OPEN_GRAPH_LOCALES = {
  en: 'en_US',
  'pt-BR': 'pt_BR',
  'zh-Hant': 'zh_TW',
  ja: 'ja_JP'
} as const satisfies Record<LangdriftLocale, string>

export function isDocsDecisionPath(mdxPath?: string[]) {
  return mdxPath?.[0] === 'decisions'
}

export function docsPublicPath(slug: DocsRouteSlug, mdxPath?: string[]) {
  const suffix = mdxPath?.length ? `/${mdxPath.join('/')}` : ''
  return `/${slug}${suffix}`
}

export function docsLanguageAlternates(mdxPath?: string[]) {
  if (isDocsDecisionPath(mdxPath)) return undefined
  return Object.fromEntries(
    LANGDRIFT_LOCALES.map((locale) => [
      locale,
      docsPublicPath(DOCS_ROUTE_SLUGS[locale], mdxPath)
    ])
  )
}
