'use client'

import { SkeletonCard } from '@components/route-state/skeleton/skeleton-card'
import { SkeletonLoader } from '@repo/react/vendors/smoothui/skeleton-loader'
import { cn } from '@template/formatters/cn.fmt'

interface DetailCardsProps {
  reports?: boolean
}

export function DetailCards(props: DetailCardsProps) {
  const { reports = false } = props

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
