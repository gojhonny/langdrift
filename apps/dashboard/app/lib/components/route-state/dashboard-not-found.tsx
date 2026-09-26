'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

export function DashboardNotFound() {
  const t = useTranslations('routeState')

  return (
    <section className="mx-auto grid w-full max-w-xl justify-items-start gap-4 rounded-xl border border-hairline bg-surface p-6 text-ink sm:p-8">
      <p className="m-0 font-mono text-sm text-muted">404</p>
      <h1 className="m-0 text-2xl font-semibold tracking-tight">
        {t('notFoundTitle')}
      </h1>
      <p className="m-0 text-sm leading-relaxed text-muted">
        {t('notFoundDescription')}
      </p>
      <Link
        className="inline-flex min-h-11 items-center rounded-md border border-ink bg-ink px-4 py-2 text-sm font-medium text-surface no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        href="/overview"
      >
        {t('overview')}
      </Link>
    </section>
  )
}
