import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'pt-BR', 'zh-Hant', 'ja'],
  defaultLocale: 'en',
  localePrefix: {
    mode: 'as-needed',
    prefixes: { 'pt-BR': '/pt-br', 'zh-Hant': '/zh-hant' }
  },
  localeDetection: false,
  localeCookie: false
})

export type WebsiteLocale = (typeof routing.locales)[number]

export const localePath: Record<WebsiteLocale, string> = {
  en: '/',
  'pt-BR': '/pt-br',
  'zh-Hant': '/zh-hant',
  ja: '/ja'
}
