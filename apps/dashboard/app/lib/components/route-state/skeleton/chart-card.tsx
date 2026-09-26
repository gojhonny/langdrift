'use client'

import { SkeletonCard } from '@components/route-state/skeleton/skeleton-card'
import { SkeletonLoader } from '@repo/react/vendors/smoothui/skeleton-loader'

export function ChartCard() {
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
