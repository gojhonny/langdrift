export const LANGDRIFT_LOCALES = ['en', 'pt-BR', 'zh-Hant', 'ja'] as const

export type LangdriftLocale = (typeof LANGDRIFT_LOCALES)[number]

export const LANGDRIFT_LOCALE_LABELS: Record<LangdriftLocale, string> = {
  en: 'EN',
  'pt-BR': 'PT-BR',
  'zh-Hant': '中文',
  ja: 'あ'
}

/** Public Website path for each canonical locale. English stays unprefixed. */
export const WEBSITE_LOCALE_PATHS: Record<LangdriftLocale, string> = {
  en: '/',
  'pt-BR': '/pt-br',
  'zh-Hant': '/zh-hant',
  ja: '/ja'
}

/**
 * Docs route slug for each canonical locale. English docs are prefixed,
 * unlike the Website.
 */
export const DOCS_ROUTE_SLUGS = {
  en: 'en',
  'pt-BR': 'pt-br',
  'zh-Hant': 'zh-hant',
  ja: 'ja'
} as const satisfies Record<LangdriftLocale, string>

export type DocsRouteSlug = (typeof DOCS_ROUTE_SLUGS)[LangdriftLocale]

export const DOCS_DEFAULT_ROUTE_SLUG: DocsRouteSlug = DOCS_ROUTE_SLUGS.en

export const DOCS_ROUTE_SLUG_LIST: readonly DocsRouteSlug[] =
  LANGDRIFT_LOCALES.map((locale) => DOCS_ROUTE_SLUGS[locale])

const localeByDocsSlug = Object.fromEntries(
  LANGDRIFT_LOCALES.map((locale) => [DOCS_ROUTE_SLUGS[locale], locale])
) as Record<DocsRouteSlug, LangdriftLocale>

export function docsRouteSlug(locale: LangdriftLocale): DocsRouteSlug {
  return DOCS_ROUTE_SLUGS[locale]
}

export function localeFromDocsSlug(slug: string): LangdriftLocale | undefined {
  if (Object.hasOwn(localeByDocsSlug, slug)) {
    return localeByDocsSlug[slug as DocsRouteSlug]
  }
  return undefined
}
