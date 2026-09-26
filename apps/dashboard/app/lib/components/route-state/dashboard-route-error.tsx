'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface DashboardRouteErrorProps {
  retry: () => void
}

export function DashboardRouteError(props: DashboardRouteErrorProps) {
  const { retry } = props

  const t = useTranslations('routeState')

  return (
    <section className="mx-auto grid w-full max-w-xl gap-4 rounded-xl border border-hairline bg-surface p-6 text-ink sm:p-8">
      <div role="alert">
        <h1 className="m-0 text-2xl font-semibold tracking-tight">
          {t('errorTitle')}
        </h1>
        <p className="mb-0 text-sm leading-relaxed text-muted">
          {t('errorDescription')}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          className="min-h-11 cursor-pointer rounded-md border border-ink bg-ink px-4 py-2 text-sm font-medium text-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          onClick={retry}
          type="button"
        >
          {t('retry')}
        </button>
        <Link
          className="inline-flex min-h-11 items-center rounded-md px-2 text-sm text-ink underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          href="/overview"
        >
          {t('overview')}
        </Link>
      </div>
    </section>
  )
}
