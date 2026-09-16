'use client'

import { useReducedMotion } from 'motion/react'
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
  src?: string
  team?: string
}

export interface VisionDriftEvent {
  actionHref?: string
  actionLabel?: string
  actors: VisionActor[]
  classification: DriftClassification
  date: string
  decision?: string
  delta: number
  id: string
  productArea?: string
  reason?: string
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

function fallbackReason(classification: DriftClassification) {
  if (classification === 'intentional') return 'A recorded product decision explains this movement.'
  if (classification === 'unexplained') return 'No matching product decision was found.'
  if (classification === 'review') return 'The product rationale is still under review.'
  return 'This point establishes the recorded Vision reference.'
}

function fallbackDecision(classification: DriftClassification) {
  if (classification === 'intentional') return 'Decision recorded'
  if (classification === 'unexplained') return 'Decision not found'
  if (classification === 'review') return 'Review pending'
  return 'Baseline recorded'
}

export function ProductVisionCurve({
  compact = false,
  data,
  onSelectEvent,
  selectedEventId
}: ProductVisionCurveProps) {
  const reduceMotion = useReducedMotion()
  const selectedEvent =
    data.find((point) => point.event?.id === selectedEventId)?.event ??
    [...data].reverse().find((point) => point.event)?.event
  const lastPoint = data[data.length - 1]

  return (
    <section className={`product-vision-curve ${compact ? 'product-vision-curve-compact' : ''}`}>
      <p className="ld-visually-hidden">
        Product Vision moves from {data[0]?.value ?? 0}% to {lastPoint?.value ?? 0}%.
        Important events are available as keyboard-focusable points on the curve.
      </p>
      <div className="product-vision-chart" style={{ height: compact ? 128 : 230 }}>
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={data} margin={{ bottom: 4, left: -20, right: 24, top: 34 }}>
            <CartesianGrid stroke="var(--ld-chart-grid, #e8e8e8)" vertical={false} />
            <XAxis axisLine={false} dataKey="label" fontSize={10} tickLine={false} />
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
                const avatarClipId = `vision-avatar-${event.id}`

                return (
                  // biome-ignore lint/a11y/useSemanticElements: Recharts dot markers render inside SVG and cannot contain an HTML button.
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
                        {actor?.src ? (
                          <>
                            <defs>
                              <clipPath id={avatarClipId} clipPathUnits="userSpaceOnUse">
                                <circle cx={cx} cy={cy - 24} r={10} />
                              </clipPath>
                            </defs>
                            <image
                              clipPath={`url(#${avatarClipId})`}
                              height="20"
                              href={actor.src}
                              preserveAspectRatio="xMidYMid slice"
                              width="20"
                              x={cx - 10}
                              y={cy - 34}
                            />
                          </>
                        ) : (
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
                        )}
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
              isAnimationActive={!compact && !reduceMotion}
              stroke="var(--ld-chart-line, #111)"
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {selectedEvent && !compact ? (
        <div aria-live="polite" className="product-vision-event-detail">
          <div className="product-vision-event-copy">
            <span>{selectedEvent.date} · {selectedEvent.productArea ?? 'Product'}</span>
            <strong>{selectedEvent.title}</strong>
            <small>
              {selectedEvent.actors.map((actor) => actor.name).join(' + ')}
              {selectedEvent.actors[0]?.team ? ` · ${selectedEvent.actors[0].team}` : ''}
            </small>
            <p>
              <b>Why?</b>{' '}
              {selectedEvent.reason ?? fallbackReason(selectedEvent.classification)}
            </p>
            <small className="product-vision-decision">
              {selectedEvent.decision ?? fallbackDecision(selectedEvent.classification)}
              {selectedEvent.actionHref && selectedEvent.actionLabel ? (
                <> · <a href={selectedEvent.actionHref}>{selectedEvent.actionLabel} →</a></>
              ) : null}
            </small>
          </div>
          <div className="product-vision-event-status">
            <b>{selectedEvent.delta > 0 ? '+' : ''}{selectedEvent.delta}</b>
            <span data-classification={selectedEvent.classification}>
              {classificationLabels[selectedEvent.classification]}
            </span>
          </div>
        </div>
      ) : null}
    </section>
  )
}
