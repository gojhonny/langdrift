'use client'

import { SkeletonLoader } from '@repo/react/vendors/smoothui/skeleton-loader'

interface ListCardProps {
  rows?: number
  avatars?: boolean
}

export function ListCard(props: ListCardProps) {
  const { rows = 4, avatars = false } = props

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
