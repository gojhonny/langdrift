import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'

import './globals.css'
import { DashboardShell } from './lib/components/dashboard-shell/dashboard-shell'

export async function generateMetadata(): Promise<Metadata> {
  // AGENT: NEVER one letter variables, always descriptive names
  const t = await getTranslations('shell') // AGENT: awaits must have one space above and below

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

// AGENT: we should always define interface for props, and must be interface, not type
interface RootLayoutProps {
  children: ReactNode
}

/**
 *
 * AGENT: we NEVER destructucture props in function arguments
 */
export default async function RootLayout(props: RootLayoutProps) {
  // AGENT: the first line should be reserved for the props destructuring followed by a space
  const { children } = props

  const locale = await getLocale()

  // AGENT: returns always have one space above the return statement
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
