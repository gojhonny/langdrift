'use client'

import { SkeletonCard } from '@components/route-state/skeleton/skeleton-card'
import { SkeletonLoader } from '@repo/react/vendors/smoothui/skeleton-loader'
import { cn } from '@template/formatters/cn.fmt'

export function SummaryCards() {
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
