import type { ReactNode } from 'react'

export interface MetricProps {
  detail?: ReactNode
  label: string
  value: ReactNode
}

export function Metric({ detail, label, value }: MetricProps) {
  return (
    <div>
      <div
        style={{
          color: 'var(--ld-muted, #6b6b6b)',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase'
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--ld-font-product)',
          fontSize: '30px',
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 600,
          letterSpacing: '-0.04em',
          marginTop: '10px'
        }}
      >
        {value}
      </div>
      {detail ? (
        <div style={{ fontSize: '12px', marginTop: '7px', opacity: 0.65 }}>
          {detail}
        </div>
      ) : null}
    </div>
  )
}
