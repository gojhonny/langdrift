'use client'

import type { ReactNode } from 'react'

import { cn } from '@template/formatters/cn.fmt'

interface SkeletonCardProps {
  children: ReactNode
  className?: string
}

export function SkeletonCard(props: SkeletonCardProps) {
  const { children, className = '' } = props

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
