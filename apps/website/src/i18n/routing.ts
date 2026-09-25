import { WEBSITE_LOCALE_PATHS } from '@repo/react/ui/language-switcher'
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'pt-BR', 'zh-Hant', 'ja'],
  defaultLocale: 'en',
  localePrefix: {
    mode: 'as-needed',
    prefixes: {
      'pt-BR': WEBSITE_LOCALE_PATHS['pt-BR'],
      'zh-Hant': WEBSITE_LOCALE_PATHS['zh-Hant']
    }
  },
  localeDetection: false,
  localeCookie: false
})

export type WebsiteLocale = (typeof routing.locales)[number]

export const localePath: Record<WebsiteLocale, string> = WEBSITE_LOCALE_PATHS
