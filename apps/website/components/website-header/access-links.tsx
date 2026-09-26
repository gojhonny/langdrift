'use client'

import { useTranslations } from 'next-intl'

import { websiteLinks } from '@app/app-links'
import { Link } from '@i18n/navigation'

interface AccessLinksProps {
  onNavigate?: () => void
}

export function AccessLinks(props: AccessLinksProps) {
  const { onNavigate } = props

  const t = useTranslations('header')

  return (
    <>
      {/* Docs is an external, environment-configured origin: a plain anchor
          keeps the i18n router from prefixing or rewriting it. */}
      <a className="website-docs-link" href={websiteLinks.docs}>
        {t('docs')}
      </a>
      <Link
        className="website-get-started"
        href="/#early-access"
        onClick={onNavigate}
      >
        {t('getStarted')}
      </Link>
    </>
  )
}
