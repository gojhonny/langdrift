'use server'

import { cookies } from 'next/headers'

import { dashboardLocaleCookie, isDashboardLocale } from './config'

export async function setDashboardLocale(locale: string) {
  if (!isDashboardLocale(locale)) return { ok: false }

  const store = await cookies()
  store.set(dashboardLocaleCookie, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  })
  return { ok: true }
}
