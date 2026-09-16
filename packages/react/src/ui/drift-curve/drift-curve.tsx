import type { CSSProperties } from 'react'

export interface DriftEvent {
  label: string
  tone: 'intentional' | 'review' | 'unexplained'
  x: number
  y: number
}

export interface DriftCurveProps {
  className?: string
  events?: DriftEvent[]
  height?: number
  style?: CSSProperties
}

const toneColor = {
  intentional: 'var(--ld-intentional)',
  review: 'var(--ld-review)',
  unexplained: 'var(--ld-unexplained)'
} as const

const defaultEvents: DriftEvent[] = [
  { label: 'Pricing direction', tone: 'intentional', x: 31, y: 37 },
  { label: 'Auth behavior', tone: 'unexplained', x: 60, y: 55 },
  { label: 'Export scope', tone: 'review', x: 79, y: 67 }
]

export function DriftCurve({
  className,
  events = defaultEvents,
  height = 250,
  style
}: DriftCurveProps) {
  return (
    <div className={className} style={{ minHeight: height, ...style }}>
      <svg
        aria-label="Product Vision trend showing three annotated product change events"
        preserveAspectRatio="none"
        role="img"
        viewBox="0 0 100 100"
        width="100%"
        height={height}
      >
        <defs>
          <linearGradient id="ld-drift-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--ld-brand)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--ld-brand)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[20, 40, 60, 80].map((y) => (
          <line
            key={y}
            x1="0"
            x2="100"
            y1={y}
            y2={y}
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeWidth="0.35"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <path
          d="M 0 22 C 14 20, 20 25, 31 37 S 48 47, 60 55 S 72 61, 79 67 S 90 69, 100 76 L 100 100 L 0 100 Z"
          fill="url(#ld-drift-fill)"
        />
        <path
          d="M 0 22 C 14 20, 20 25, 31 37 S 48 47, 60 55 S 72 61, 79 67 S 90 69, 100 76"
          fill="none"
          stroke="var(--ld-brand)"
          strokeLinecap="round"
          strokeWidth="2.2"
          vectorEffect="non-scaling-stroke"
        />
        {events.map((event) => (
          <g key={event.label}>
            <line
              x1={event.x}
              x2={event.x}
              y1={event.y}
              y2="92"
              stroke={toneColor[event.tone]}
              strokeDasharray="2 3"
              strokeOpacity="0.42"
              strokeWidth="0.45"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx={event.x}
              cy={event.y}
              fill="var(--ld-surface, #fff)"
              r="2.1"
              stroke={toneColor[event.tone]}
              strokeWidth="1.1"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        ))}
      </svg>
    </div>
  )
}
