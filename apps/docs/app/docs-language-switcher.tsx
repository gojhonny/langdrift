'use client'

import {
  LANGDRIFT_LOCALE_LABELS,
  LANGDRIFT_LOCALES,
  LanguageSwitcher
} from '@repo/react/ui/language-switcher'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { docsChrome } from '../chrome'
import {
  DOCS_ROUTE_SLUGS,
  docsPublicPath,
  localeFromDocsSlug,
  type DocsRouteSlug
} from '../docs-locales'

export function DocsLanguageSwitcher({ lang }: { lang: DocsRouteSlug }) {
  const pathname = usePathname()
  const locale = localeFromDocsSlug(lang)
  const [suffix, setSuffix] = useState('')

  useEffect(() => {
    const syncSuffix = () => {
      setSuffix(`${window.location.search}${window.location.hash}`)
    }
    syncSuffix()
    window.addEventListener('hashchange', syncSuffix)
    window.addEventListener('popstate', syncSuffix)
    return () => {
      window.removeEventListener('hashchange', syncSuffix)
      window.removeEventListener('popstate', syncSuffix)
    }
  }, [])

  if (!locale) return null

  const copy = docsChrome[locale]
  const rest = pathname.split('/').filter(Boolean).slice(1)
  // Decision records exist only under English. Keep every option on that URL
  // so the switcher never points at a missing translation.
  const decisionRecord = rest[0] === 'decisions'

  return (
    <LanguageSwitcher
      activeLocale={locale}
      label={copy.language}
      options={LANGDRIFT_LOCALES.map((item) => ({
        ariaLabel: copy.languages[item],
        href: decisionRecord
          ? `${docsPublicPath(lang, rest)}${suffix}`
          : `${docsPublicPath(DOCS_ROUTE_SLUGS[item], rest)}${suffix}`,
        hrefLang: item,
        label: LANGDRIFT_LOCALE_LABELS[item],
        locale: item
      }))}
    />
  )
}
