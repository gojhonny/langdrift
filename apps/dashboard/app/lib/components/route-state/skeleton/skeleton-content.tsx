'use client'

import { ChartCard } from '@components/route-state/skeleton/chart-card'
import { DetailCards } from '@components/route-state/skeleton/detail-cards'
import { ListCard } from '@components/route-state/skeleton/list-card'
import { SkeletonCard } from '@components/route-state/skeleton/skeleton-card'
import { SummaryCards } from '@components/route-state/skeleton/summary-cards'
import type { DashboardSection } from '@domain'
import { SkeletonLoader } from '@repo/react/vendors/smoothui/skeleton-loader'

interface SkeletonContentProps {
  section: DashboardSection
}

export function SkeletonContent(props: SkeletonContentProps) {
  const { section } = props

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
