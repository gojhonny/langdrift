import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'

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

interface RootLayoutProps {
  children: ReactNode
}

export default async function RootLayout(props: RootLayoutProps) {
  const { children } = props

  const locale = await getLocale()

  // AGENT: returns always have one space above the return statement
  return (
    <html className="min-h-full" lang={locale} suppressHydrationWarning>
      <body className="min-h-full bg-background font-editorial text-ink [transition:background_180ms_ease,color_180ms_ease] motion-reduce:transition-none [&_:where(button:focus-visible,a:focus-visible,input:focus-visible)]:outline-2 [&_:where(button:focus-visible,a:focus-visible,input:focus-visible)]:outline-solid [&_:where(button:focus-visible,a:focus-visible,input:focus-visible)]:outline-brand [&_:where(button:focus-visible,a:focus-visible,input:focus-visible)]:outline-offset-2">
        <NextIntlClientProvider>
          <DashboardShell>{children}</DashboardShell>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
