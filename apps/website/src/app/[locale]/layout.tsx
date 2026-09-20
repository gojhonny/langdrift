import type { Metadata, Viewport } from 'next'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { localePath, routing } from '../../i18n/routing'
import { getWebsiteMessages } from '../../messages'

import '@repo/react/styles.css'
import '../globals.css'
import '../followup.css'
import '../responsive.css'
import '../hero.css'
import '../../components/hero-demo.css'

interface LayoutProps {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params
}: Omit<LayoutProps, 'children'>): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  const t = await getTranslations({ locale, namespace: 'home.metadata' })

  return {
    metadataBase: new URL('https://langdrift.md'),
    title: t('title'),
    description: t('description'),
    applicationName: 'LangDrift',
    icons: { icon: '/favicon.ico' },
    alternates: {
      canonical: localePath[locale],
      languages: { ...localePath, 'x-default': '/' }
    }
  }
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: '#f7f6f2'
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider
          locale={locale}
          messages={getWebsiteMessages(locale)}
          timeZone="UTC"
        >
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
