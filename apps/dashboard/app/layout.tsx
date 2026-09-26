import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'

import './globals.css'
import { DashboardShell } from './lib/components/dashboard-shell/dashboard-shell'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('shell')
  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    applicationName: 'LangDrift',
    icons: {
      icon: [{ url: '/favicon.ico', sizes: 'any' }]
    }
  }
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: '#fafafa'
}

export default async function RootLayout({
  children
}: {
  children: ReactNode
}) {
  const locale = await getLocale()
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="motion-reduce:transition-none">
        <NextIntlClientProvider>
          <DashboardShell>{children}</DashboardShell>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
