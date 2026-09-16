import type { ReactNode } from 'react'

export type StatusTone = 'aligned' | 'intentional' | 'review' | 'unexplained'

export interface StatusPillProps {
  children: ReactNode
  className?: string
  tone: StatusTone
}

const toneMap: Record<StatusTone, { color: string; background: string }> = {
  aligned: {
    color: 'var(--ld-aligned)',
    background: 'color-mix(in oklab, var(--ld-aligned) 10%, transparent)'
  },
  intentional: {
    color: 'var(--ld-intentional)',
    background: 'color-mix(in oklab, var(--ld-intentional) 10%, transparent)'
  },
  review: {
    color: 'var(--ld-review)',
    background: 'color-mix(in oklab, var(--ld-review) 10%, transparent)'
  },
  unexplained: {
    color: 'var(--ld-unexplained)',
    background: 'color-mix(in oklab, var(--ld-unexplained) 10%, transparent)'
  }
}

export function StatusPill({ children, className, tone }: StatusPillProps) {
  const colors = toneMap[tone]

  return (
    <span
      className={className}
      style={{
        alignItems: 'center',
        background: colors.background,
        border: `1px solid color-mix(in oklab, ${colors.color} 26%, transparent)`,
        borderRadius: 'var(--ld-pill-radius)',
        color: colors.color,
        display: 'inline-flex',
        fontSize: '11px',
        fontWeight: 650,
        gap: '6px',
        lineHeight: 1,
        padding: '6px 9px',
        whiteSpace: 'nowrap'
      }}
    >
      <span
        aria-hidden="true"
        style={{
          background: colors.color,
          borderRadius: '50%',
          display: 'block',
          height: '6px',
          width: '6px'
        }}
      />
      {children}
    </span>
  )
}
