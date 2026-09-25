import type { LangdriftLocale } from '@repo/react/locales'

import { WEBSITE_LOCALE_PATHS } from './docs-locales'
import { siteConfig } from './site.config'

export function websiteUrlForLocale(locale: LangdriftLocale) {
  const path = WEBSITE_LOCALE_PATHS[locale]
  if (path === '/') return `${siteConfig.productUrl}/`
  return `${siteConfig.productUrl}${path}`
}
