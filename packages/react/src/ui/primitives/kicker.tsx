import type { ReactNode } from 'react'

import { cn } from './cn'

interface KickerProps {
  className?: string
  children: ReactNode
}

export function Kicker(props: KickerProps) {
  const { className, children } = props

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
