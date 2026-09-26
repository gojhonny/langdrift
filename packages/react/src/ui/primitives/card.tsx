import type { ReactNode } from 'react'

import { cn } from './cn'

interface CardProps {
  as?: 'section' | 'article' | 'div'
  className?: string
  children: ReactNode
}

export function Card(props: CardProps) {
  const { as: Tag = 'section', className, children } = props

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
