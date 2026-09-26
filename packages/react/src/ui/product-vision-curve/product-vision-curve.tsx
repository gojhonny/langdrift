'use client'

import { classificationText } from '@repo/react/ui/classification-text'
import { afterPaint } from '@repo/react/utilities'
import { lazy, Suspense, useEffect, useState } from 'react'

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
  formatNumber?: (value: number) => string
  labels?: {
    loading?: string
    classifications?: Partial<Record<DriftClassification, string>>
    describeEvent?: (event: VisionDriftEvent) => string
    product?: string
    summary?: string
    why?: string
  }
  onSelectEvent?: (event: VisionDriftEvent) => void
  pointPadding?: number
  selectedEventId?: string
}

const classificationLabels: Record<DriftClassification, string> = {
  baseline: 'Baseline',
  intentional: 'Intentional Evolution',
  review: 'Under Review',
  unexplained: 'Unexplained Drift'
}

const DeferredChart = lazy(() =>
  import('./product-vision-chart').then((module) => ({
    default: module.ProductVisionChart
  }))
)

function fallbackReason(classification: DriftClassification) {
  if (classification === 'intentional')
    return 'A recorded product decision explains this movement.'
  if (classification === 'unexplained')
    return 'No matching product decision was found.'
  if (classification === 'review')
    return 'The product rationale is still under review.'
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
  formatNumber = String,
  labels,
  onSelectEvent,
  pointPadding = 0,
  selectedEventId
}: ProductVisionCurveProps) {
  const [ready, setReady] = useState(false)
  useEffect(() => afterPaint(() => setReady(true)), [])
  const selectedEvent =
    data.find((point) => point.event?.id === selectedEventId)?.event ??
    [...data].reverse().find((point) => point.event)?.event
  const lastPoint = data[data.length - 1]
  const eventClassifications = {
    ...classificationLabels,
    ...labels?.classifications
  }
  const formatDelta = (value: number) =>
    `${value > 0 ? '+' : ''}${formatNumber(value)}`

  return (
    <section
      className={`product-vision-curve ${compact ? 'product-vision-curve-compact' : ''}`}
    >
      <p className="ld-visually-hidden">
        {labels?.summary ??
          `Product Vision moves from ${data[0]?.value ?? 0}% to ${lastPoint?.value ?? 0}%. Important events are available as keyboard-focusable points on the curve.`}
      </p>
      <div
        className="product-vision-chart"
        style={{ height: compact ? 128 : 250 }}
      >
        {ready ? (
          <Suspense
            fallback={
              <span className="sr-only">
                {labels?.loading ?? 'Loading Product Vision curve'}
              </span>
            }
          >
            <DeferredChart
              compact={compact}
              data={data}
              eventClassifications={eventClassifications}
              formatNumber={formatNumber}
              labels={labels}
              onSelectEvent={onSelectEvent}
              pointPadding={pointPadding}
              selectedEventId={selectedEventId}
            />
          </Suspense>
        ) : (
          <span className="sr-only">
            {labels?.loading ?? 'Loading Product Vision curve'}
          </span>
        )}
      </div>

      {selectedEvent && !compact ? (
        <div aria-live="polite" className="product-vision-event-detail">
          <div className="product-vision-event-copy">
            <span>
              {selectedEvent.date} ·{' '}
              {selectedEvent.productArea ?? labels?.product ?? 'Product'}
            </span>
            <strong>{selectedEvent.title}</strong>
            <small>
              {selectedEvent.actors.map((actor) => actor.name).join(' + ')}
              {selectedEvent.actors[0]?.team
                ? ` · ${selectedEvent.actors[0].team}`
                : ''}
            </small>
            <p>
              <b>{labels?.why ?? 'Why?'}</b>{' '}
              {selectedEvent.reason ??
                fallbackReason(selectedEvent.classification)}
            </p>
            <small className="product-vision-decision">
              {selectedEvent.decision ??
                fallbackDecision(selectedEvent.classification)}
              {selectedEvent.actionHref && selectedEvent.actionLabel ? (
                <>
                  {' '}
                  ·{' '}
                  <a href={selectedEvent.actionHref}>
                    {selectedEvent.actionLabel} →
                  </a>
                </>
              ) : null}
            </small>
          </div>
          <div className="product-vision-event-status">
            <b>{formatDelta(selectedEvent.delta)}</b>
            <span
              className={classificationText[selectedEvent.classification]}
              data-classification={selectedEvent.classification}
            >
              {eventClassifications[selectedEvent.classification]}
            </span>
          </div>
        </div>
      ) : null}
    </section>
  )
}
