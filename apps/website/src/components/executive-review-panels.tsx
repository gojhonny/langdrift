import type { ReactNode } from 'react'
import {
  evidenceKinds,
  getEventSources,
  type ExecutiveReviewMessages,
  type ReviewEvent,
  type ReviewItem
} from '../lib/executive-review-data'

type SourceRenderer = (id: string) => ReactNode
type PanelTranslate = (
  key: 'labels.week' | 'matrix.linkedCellLabel',
  values: Record<string, string | number>
) => string

export function EvidenceMatrix({
  events,
  copy,
  prefix,
  selectedSourceId,
  inspectorId,
  onOpen,
  t
}: {
  events: readonly ReviewEvent[]
  copy: ExecutiveReviewMessages
  prefix: string
  selectedSourceId: string | null
  inspectorId: string
  onOpen: (sourceId: string, trigger: HTMLButtonElement) => void
  t: PanelTranslate
}) {
  return (
    <section
      className="review-matrix"
      aria-labelledby={`${prefix}-matrix-title`}
    >
      <div className="review-panel-heading">
        <h3 id={`${prefix}-matrix-title`}>{copy.matrix.title}</h3>
        <p>{copy.matrix.description}</p>
      </div>
      <table>
        <caption className="website-sr-only">{copy.matrix.title}</caption>
        <thead>
          <tr>
            <th scope="col" id={`${prefix}-event-column`}>
              {copy.matrix.eventHeading}
            </th>
            {evidenceKinds.map((kind) => (
              <th key={kind} scope="col" id={`${prefix}-column-${kind}`}>
                {copy.kinds[kind]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr
              key={event.id}
              data-review-event={event.id}
              data-inspected={
                event.sourceIds.includes(selectedSourceId ?? '') || undefined
              }
            >
              <th scope="row" id={`${prefix}-event-${event.id}`} tabIndex={-1}>
                <span className="review-event-id">
                  {event.id} · {t('labels.week', { week: event.week })}
                </span>
                <strong>{copy.events[event.id].title}</strong>
                <span className="review-event-meta">
                  {copy.targets[event.targetId].label} ·{' '}
                  {copy.classifications[event.classification ?? 'unclassified']}
                </span>
              </th>
              {evidenceKinds.map((kind) => {
                const sources = getEventSources(event, kind)
                const source = sources[0]
                return (
                  <td
                    key={kind}
                    headers={`${prefix}-event-${event.id} ${prefix}-column-${kind}`}
                  >
                    <span className="review-mobile-kind" aria-hidden="true">
                      {copy.kinds[kind]}
                    </span>
                    {source ? (
                      <button
                        type="button"
                        className="review-linked-cell"
                        data-review-source={source.id}
                        aria-label={t('matrix.linkedCellLabel', {
                          eventTitle: copy.events[event.id].title,
                          sourceKind: copy.kinds[kind],
                          count: sources.length
                        })}
                        aria-controls={inspectorId}
                        aria-expanded={selectedSourceId === source.id}
                        onClick={(e) => onOpen(source.id, e.currentTarget)}
                      >
                        <span aria-hidden="true">{sources.length} ↗</span>
                      </button>
                    ) : (
                      <span className="review-not-linked">
                        {copy.matrix.notLinked}
                      </span>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export function ReviewTimeline({
  reviews,
  copy,
  prefix,
  renderSource,
  t
}: {
  reviews: readonly ReviewItem[]
  copy: ExecutiveReviewMessages
  prefix: string
  renderSource: SourceRenderer
  t: PanelTranslate
}) {
  return (
    <section
      className="review-timeline"
      aria-labelledby={`${prefix}-timeline-title`}
    >
      <div className="review-panel-heading">
        <h3 id={`${prefix}-timeline-title`}>{copy.timeline.title}</h3>
      </div>
      {reviews.length === 0 ? (
        <div className="review-no-reviews">
          <p>{copy.timeline.noReviews}</p>
          <p>{copy.timeline.noReviewsLimit}</p>
        </div>
      ) : (
        <ol className="review-items">
          {reviews.map((review) => {
            const text = copy.reviews[review.id]
            return (
              <li key={review.id}>
                <article
                  id={`${prefix}-review-${review.id}`}
                  tabIndex={-1}
                  data-review-item={review.id}
                >
                  <div className="review-item-intro">
                    <span className="review-event-id">{review.id}</span>
                    <h4>{text.title}</h4>
                    <p className="review-related-event">
                      {copy.labels.relatedEvent}:{' '}
                      {copy.events[review.eventId].title}
                    </p>
                    <p>{text.summary}</p>
                  </div>
                  <ol className="review-checkpoints">
                    {review.checkpoints.map((checkpoint) => (
                      <li
                        key={checkpoint.id}
                        data-pending={checkpoint.week === null || undefined}
                      >
                        <span className="review-checkpoint-time">
                          {checkpoint.week === null
                            ? copy.labels.pendingCondition
                            : t('labels.week', { week: checkpoint.week })}
                        </span>
                        <h5>{text.checkpoints[checkpoint.id].label}</h5>
                        <p>{text.checkpoints[checkpoint.id].description}</p>
                        {checkpoint.sourceIds.length ? (
                          <div className="review-references">
                            {checkpoint.sourceIds.map(renderSource)}
                          </div>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                  <div className="review-next-decision">
                    <span>{copy.labels.nextDecision}</span>
                    <p>{text.nextDecision}</p>
                  </div>
                  <p className="review-limit">{text.limit}</p>
                </article>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
