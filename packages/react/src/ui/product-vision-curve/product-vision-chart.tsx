'use client'

import { useReducedMotion } from 'motion/react'
import { useId } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts'
import type {
  DriftClassification,
  ProductVisionCurveProps
} from './product-vision-curve'

interface VisionChartProps
  extends Pick<
    ProductVisionCurveProps,
    'data' | 'labels' | 'onSelectEvent' | 'selectedEventId'
  > {
  compact: boolean
  formatNumber: NonNullable<ProductVisionCurveProps['formatNumber']>
  pointPadding: number
  eventClassifications: Record<DriftClassification, string>
}

const classificationColors: Record<DriftClassification, string> = {
  baseline: 'var(--ld-muted, #71717a)',
  intentional: '#3b82f6',
  review: '#a855f7',
  unexplained: '#dc2626'
}

export function ProductVisionChart({
  compact,
  data,
  formatNumber,
  labels,
  onSelectEvent,
  pointPadding,
  selectedEventId,
  eventClassifications
}: VisionChartProps) {
  const reduceMotion = useReducedMotion()
  const instanceId = useId()
  const formatDelta = (value: number) =>
    `${value > 0 ? '+' : ''}${formatNumber(value)}`
  return (
    <ResponsiveContainer height="100%" width="100%">
      <LineChart
        data={data}
        margin={{ bottom: 4, left: 0, right: 24, top: compact ? 16 : 54 }}
      >
        <CartesianGrid
          stroke="var(--ld-chart-grid, #e8e8e8)"
          vertical={false}
        />
        <XAxis
          axisLine={false}
          dataKey="label"
          fontSize={compact ? 10 : 12}
          padding={{ left: pointPadding }}
          tickLine={false}
          tick={{ fill: 'var(--ld-muted, #71717a)' }}
        />
        <YAxis
          axisLine={false}
          domain={['dataMin - 4', 'dataMax + 4']}
          fontSize={compact ? 10 : 12}
          tickCount={4}
          tick={{ fill: 'var(--ld-muted, #71717a)' }}
          tickFormatter={formatNumber}
          tickLine={false}
          width={40}
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
            const avatarClipId = `vision-avatar-${instanceId}-${event.id}`

            return (
              // biome-ignore lint/a11y/useSemanticElements: Recharts dot markers render inside SVG and cannot contain an HTML button.
              <g
                aria-label={
                  labels?.describeEvent?.(event) ??
                  `${event.title}, ${event.delta} Product Vision, ${eventClassifications[event.classification]}, ${event.date}`
                }
                className="product-vision-event-dot focus-visible:[&>circle:first-of-type]:stroke-[var(--ld-ink,#171717)] focus-visible:[&>circle:first-of-type]:stroke-4"
                aria-pressed={selected}
                key={event.id}
                onClick={activate}
                onFocus={activate}
                onKeyDown={(keyboardEvent) => {
                  if (
                    keyboardEvent.key === 'Enter' ||
                    keyboardEvent.key === ' '
                  ) {
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
                          <clipPath
                            id={avatarClipId}
                            clipPathUnits="userSpaceOnUse"
                          >
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
                      fontSize="11"
                      textAnchor="middle"
                      x={cx}
                      y={cy - 41}
                    >
                      {formatDelta(event.delta)}
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
  )
}
