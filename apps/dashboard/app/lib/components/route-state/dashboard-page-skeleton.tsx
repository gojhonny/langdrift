'use client'

import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'

import type { DashboardSection } from '@domain'
import { SkeletonLoader } from '@repo/react/vendors/smoothui/skeleton-loader'
import { cn } from '@template/formatters/cn.fmt'

function SkeletonCard({
  children,
  className = ''
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid min-w-0 gap-3 rounded-xl border border-hairline bg-surface p-4',
        className
      )}
    >
      {children}
    </div>
  )
}

function SummaryCards() {
  return (
    <div className="mb-2.5 grid grid-cols-1 gap-2.5 min-[621px]:grid-cols-2 min-[881px]:grid-cols-[minmax(0,2fr)_minmax(170px,1fr)_minmax(170px,1fr)]">
      {['vision', 'intentional', 'unexplained'].map((card, index) => (
        <SkeletonCard
          className={cn(
            'min-h-[132px]',
            index === 0 && 'min-[621px]:col-span-2 min-[881px]:col-span-1'
          )}
          key={card}
        >
          <SkeletonLoader className="h-2 w-28 max-w-full" />
          <SkeletonLoader className={index === 0 ? 'h-12 w-24' : 'h-9 w-14'} />
          <SkeletonLoader className="h-2 w-40 max-w-full" />
        </SkeletonCard>
      ))}
    </div>
  )
}

function ChartCard() {
  return (
    <SkeletonCard className="mb-2.5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-2">
          <SkeletonLoader className="h-2 w-24" />
          <SkeletonLoader className="h-8 w-20" />
          <SkeletonLoader className="h-2 w-36" />
        </div>
        <SkeletonLoader className="h-7 w-32" />
      </div>
      <SkeletonLoader className="h-[250px] w-full" />
      <div className="grid min-h-28 gap-3 border-t border-hairline pt-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="grid content-start gap-3">
          <SkeletonLoader className="h-3 w-36 max-w-full" />
          <SkeletonLoader className="h-2 w-24" />
          <SkeletonLoader className="h-5 w-28" />
        </div>
        <div className="grid content-start gap-3">
          <SkeletonLoader className="h-3 w-3/4" />
          <SkeletonLoader className="h-2 w-full" />
          <SkeletonLoader className="h-2 w-5/6" />
        </div>
      </div>
    </SkeletonCard>
  )
}

function ListCard({
  rows = 4,
  avatars = false
}: {
  rows?: number
  avatars?: boolean
}) {
  return (
    <div className="mb-2.5 rounded-xl border border-hairline bg-surface px-3.5">
      {Array.from({ length: rows }, (_, index) => (
        <div
          className="flex min-h-[62px] items-center gap-3 border-b border-hairline py-3 last:border-0"
          key={`row-${index + 1}`}
        >
          {avatars ? (
            <SkeletonLoader className="size-7 shrink-0 rounded-full" />
          ) : null}
          <div className="grid min-w-0 flex-1 gap-2">
            <SkeletonLoader className="h-3 w-48 max-w-full" />
            <SkeletonLoader className="h-2 w-64 max-w-full" />
          </div>
          <SkeletonLoader className="h-5 w-14 shrink-0" />
        </div>
      ))}
    </div>
  )
}

function DetailCards({ reports = false }: { reports?: boolean }) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-2.5',
        reports
          ? 'min-[901px]:grid-cols-[2fr_1fr_1fr]'
          : 'min-[901px]:grid-cols-3'
      )}
    >
      {['first', 'second', 'third'].map((card) => (
        <SkeletonCard
          className={reports ? 'min-h-60' : 'min-h-[200px]'}
          key={card}
        >
          <SkeletonLoader className="h-2 w-16" />
          <SkeletonLoader className="h-8 w-3/4" />
          <SkeletonLoader className="h-3 w-full" />
          <SkeletonLoader className="h-3 w-4/5" />
          <SkeletonLoader className="mt-auto h-3 w-1/2" />
        </SkeletonCard>
      ))}
    </div>
  )
}

function SkeletonContent({ section }: { section: DashboardSection }) {
  switch (section) {
    case 'overview':
      return (
        <>
          <SummaryCards />
          <ChartCard />
          <ListCard rows={3} />
          <div className="grid gap-2.5 min-[881px]:grid-cols-2">
            {['attention', 'review'].map((card) => (
              <SkeletonCard className="min-h-[170px]" key={card}>
                <SkeletonLoader className="size-5" />
                <SkeletonLoader className="h-3 w-4/5" />
                <SkeletonLoader className="h-2 w-full" />
                <SkeletonLoader className="h-2 w-32" />
              </SkeletonCard>
            ))}
          </div>
        </>
      )
    case 'decisions':
      return <DetailCards />
    case 'people':
      return <ListCard rows={4} avatars />
    case 'reports':
    case 'drift-report':
      return <DetailCards reports />
    case 'settings':
      return (
        <div className="rounded-xl border border-hairline bg-surface px-3.5">
          {['appearance', 'language', 'voice'].map((row) => (
            <div
              className="flex min-h-[68px] items-center justify-between gap-3 border-b border-hairline py-3 last:border-0 max-sm:flex-col max-sm:items-start"
              key={row}
            >
              <div className="grid w-full max-w-64 gap-2">
                <SkeletonLoader className="h-3 w-24" />
                <SkeletonLoader className="h-2 w-full" />
              </div>
              <SkeletonLoader className="h-9 w-36 shrink-0" />
            </div>
          ))}
        </div>
      )
    case 'evidence':
      return <ListCard rows={5} />
    case 'vision-baseline':
      return <ListCard rows={4} />
    default:
      return (
        <>
          <div className="mb-3 flex flex-wrap gap-2">
            <SkeletonLoader className="h-7 w-56 max-w-full" />
            <SkeletonLoader className="h-7 w-36" />
          </div>
          <ChartCard />
          <ListCard />
        </>
      )
  }
}

export function DashboardPageSkeleton({
  section
}: {
  section: DashboardSection
}) {
  const t = useTranslations('routeState')
  const label = t('loading', { section: t(`sections.${section}`) })

  return (
    // biome-ignore lint/a11y/useSemanticElements: This loading status contains page-level blocks, not a calculated form output.
    <div aria-label={label} role="status">
      <h1 className="sr-only">{label}</h1>
      <div aria-hidden="true">
        <div className="mb-[22px] grid gap-[3px]">
          <SkeletonLoader className="h-2 w-16" />
          <SkeletonLoader className="h-8 w-40" />
          <SkeletonLoader className="mt-0.5 h-3 w-80 max-w-full" />
        </div>
        <SkeletonContent section={section} />
      </div>
    </div>
  )
}
