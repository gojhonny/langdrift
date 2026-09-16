'use client'

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts'

export type DriftClassification =
  | 'baseline'
  | 'intentional'
  | 'review'
  | 'unexplained'

export interface VisionActor {
  initials: string
  name: string
  team?: string
}

export interface VisionDriftEvent {
  actors: VisionActor[]
  classification: DriftClassification
  date: string
  delta: number
  id: string
  productArea?: string
  title: string
}

export interface VisionPoint {
  event?: VisionDriftEvent
  label: string
  value: number
}

export interface ProductVisionCurveProps {
  compact?: boolean
  data: VisionPoint[]
  onSelectEvent?: (event: VisionDriftEvent) => void
  selectedEventId?: string
}

const classificationLabels: Record<DriftClassification, string> = {
  baseline: 'Baseline',
  intentional: 'Intentional Evolution',
  review: 'Under Review',
  unexplained: 'Unexplained Drift'
}

const classificationColors: Record<DriftClassification, string> = {
  baseline: 'var(--ld-muted, #71717a)',
  intentional: '#3b82f6',
  review: '#a855f7',
  unexplained: '#dc2626'
}

export function ProductVisionCurve({
  compact = false,
  data,
  onSelectEvent,
  selectedEventId
}: ProductVisionCurveProps) {
  const selectedEvent =
    data.find((point) => point.event?.id === selectedEventId)?.event ??
    [...data].reverse().find((point) => point.event)?.event

  return (
    <section className={`product-vision-curve ${compact ? 'product-vision-curve-compact' : ''}`}>
      <p className="ld-visually-hidden">
        Product Vision moves from {data[0]?.value ?? 0}% to {data.at(-1)?.value ?? 0}%.
        Important events are available as keyboard-focusable points on the curve.
      </p>
      <div className="product-vision-chart" style={{ height: compact ? 128 : 230 }}>
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={data} margin={{ bottom: 4, left: -20, right: 24, top: 34 }}>
            <CartesianGrid
              stroke="var(--ld-chart-grid, #e8e8e8)"
              vertical={false}
            />
            <XAxis
              axisLine={false}
              dataKey="label"
              fontSize={10}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              domain={['dataMin - 4', 'dataMax + 4']}
              fontSize={10}
              tickCount={4}
              tickLine={false}
              width={34}
            />
            <Line
              dataKey="value"
              dot={(props) => {
                const index = props.index ?? 0
                const point = data[index]
                const event = point?.event
                const selected = event?.id === selectedEventId
                const cx = Number(props.cx ?? 0)
                const cy = Number(props.cy ?? 0)
                const color = event
                  ? classificationColors[event.classification]
                  : 'var(--ld-chart-point, #111)'

                if (!event) {
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      fill="var(--ld-chart-point, #111)"
                      key={`vision-dot-${String(index)}`}
                      r={3}
                      stroke="var(--ld-chart-surface, #fff)"
                      strokeWidth={2}
                    />
                  )
                }

                const actor = event.actors[0]
                const activate = () => onSelectEvent?.(event)

                return (
                  <g
                    aria-label={`${event.title}, ${event.delta} Product Vision, ${classificationLabels[event.classification]}, ${event.date}`}
                    className="product-vision-event-dot"
                    key={event.id}
                    onClick={activate}
                    onFocus={activate}
                    onKeyDown={(keyboardEvent) => {
                      if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
                        keyboardEvent.preventDefault()
                        activate()
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <circle
                      cx={cx}
                      cy={cy}
                      fill={selected ? '#f97316' : color}
                      r={selected ? 7 : 5}
                      stroke="var(--ld-chart-surface, #fff)"
                      strokeWidth={3}
                    />
                    {!compact ? (
                      <>
                        <circle
                          cx={cx}
                          cy={cy - 24}
                          fill="var(--ld-ink, #111)"
                          r={12}
                          stroke="var(--ld-chart-surface, #fff)"
                          strokeWidth={2}
                        />
                        <text
                          fill="var(--ld-surface, #fff)"
                          fontSize="7"
                          fontWeight="700"
                          textAnchor="middle"
                          x={cx}
                          y={cy - 21.5}
                        >
                          {actor?.initials ?? 'LD'}
                        </text>
                        <text
                          fill="var(--ld-muted, #71717a)"
                          fontSize="8"
                          textAnchor="middle"
                          x={cx}
                          y={cy - 41}
                        >
                          {event.delta > 0 ? '+' : ''}{event.delta}
                        </text>
                      </>
                    ) : null}
                  </g>
                )
              }}
              isAnimationActive={!compact}
              stroke="var(--ld-chart-line, #111)"
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {selectedEvent && !compact ? (
        <div aria-live="polite" className="product-vision-event-detail">
          <div>
            <span>{selectedEvent.date} · {selectedEvent.productArea ?? 'Product'}</span>
            <strong>{selectedEvent.title}</strong>
            <small>
              {selectedEvent.actors.map((actor) => actor.name).join(' + ')}
              {selectedEvent.actors[0]?.team ? ` · ${selectedEvent.actors[0].team}` : ''}
            </small>
          </div>
          <b>{selectedEvent.delta > 0 ? '+' : ''}{selectedEvent.delta}</b>
          <span data-classification={selectedEvent.classification}>
            {classificationLabels[selectedEvent.classification]}
          </span>
        </div>
      ) : null}
    </section>
  )
}
