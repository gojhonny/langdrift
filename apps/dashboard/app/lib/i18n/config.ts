import type { DashboardLocale } from '@domain'

export const dashboardLocales = ['en', 'pt-BR', 'zh-Hant', 'ja'] as const
export const dashboardLocaleCookie = 'langdrift-dashboard-locale'

export function isDashboardLocale(value: unknown): value is DashboardLocale {
  return (
    typeof value === 'string' &&
    dashboardLocales.some((locale) => locale === value)
  )
}
