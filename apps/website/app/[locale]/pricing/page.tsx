import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

import { StateLogger } from '@app/state-logger'
import { EarlyAccessSection } from '@components/early-access/section'
import { PlansSection } from '@components/plans-section'
import { WebsiteFooter } from '@components/website-footer'
import { WebsiteHeader } from '@components/website-header'
import { getPathname } from '@i18n/navigation'
import { routing } from '@i18n/routing'
import { conversionMessages } from '@messages/conversion'

interface PricingPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params
}: PricingPageProps): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  const copy = conversionMessages[locale].plans
  return {
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    alternates: {
      canonical: getPathname({ href: '/pricing', locale }),
      languages: {
        ...Object.fromEntries(
          routing.locales.map((language) => [
            language,
            getPathname({ href: '/pricing', locale: language })
          ])
        ),
        'x-default': getPathname({ href: '/pricing', locale: 'en' })
      }
    }
  }
}

export default async function PricingPage({ params }: PricingPageProps) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  return (
    <>
      <StateLogger />
      <a className="skip-link" href="#plans-main">
        {conversionMessages[locale].plans.skip}
      </a>
      <WebsiteHeader />
      <main className="plans-page" id="plans-main">
        <PlansSection locale={locale} />
        <EarlyAccessSection locale={locale} source="pricing" compact />
      </main>
      <WebsiteFooter locale={locale} compact />
    </>
  )
}
