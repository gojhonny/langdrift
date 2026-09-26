import type { ReactNode } from 'react'

import { cn } from './formatters/cn.fmt'

// AGENT: These custom components should be in a separate file, and placed under app/lib/components folder
// AGENT: Also, we should avoid create base components like Card, Kicker, Muted, etc. We should use smoothui or shadcn/ui. And since they are generic, should come from packages/react
export function Card({
  as: Tag = 'section',
  className,
  children
}: {
  as?: 'section' | 'article' | 'div'
  className?: string
  children: ReactNode
}) {
  return (
    <Tag
      className={cn(
        'rounded-[10px] border border-hairline bg-surface',
        className
      )}
    >
      {children}
    </Tag>
  )
}

export function Kicker({
  className,
  children
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'font-mono text-[8px] tracking-[0.08em] text-muted uppercase',
        className
      )}
    >
      {children}
    </span>
  )
}

export function Muted({
  as: Tag = 'span',
  className,
  children
}: {
  as?: 'span' | 'p' | 'small' | 'time'
  className?: string
  children: ReactNode
}) {
  return <Tag className={cn('text-muted', className)}>{children}</Tag>
}
