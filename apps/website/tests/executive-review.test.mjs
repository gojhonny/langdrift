import assert from 'node:assert/strict'
import test from 'node:test'
import { createTranslator } from 'next-intl'
import {
  aggregateReviewEvents,
  evidenceKinds,
  getEventSources,
  getReviewsForEvents,
  initialReviewFilters,
  questionPresets,
  reviewDistribution,
  reviewEvents,
  reviewItems,
  reviewSources,
  selectReviewEvents
} from '../src/lib/executive-review-data.ts'
import { enExecutiveReviewMessages } from '../src/messages/executive-review/en.ts'
import { jaExecutiveReviewMessages } from '../src/messages/executive-review/ja.ts'
import { ptBrExecutiveReviewMessages } from '../src/messages/executive-review/pt-br.ts'
import { zhHantExecutiveReviewMessages } from '../src/messages/executive-review/zh-hant.ts'

test('one fixture supplies unique events, sources and explicit reviews with valid ownership', () => {
  assert.equal(reviewEvents.length, 12)
  assert.equal(new Set(reviewEvents.map((event) => event.id)).size, 12)
  assert.equal(reviewSources.length, 32)
  assert.equal(new Set(reviewSources.map((source) => source.id)).size, 32)
  assert.equal(reviewItems.length, 4)
  assert.equal(new Set(reviewItems.map((review) => review.id)).size, 4)
  assert.deepEqual(
    reviewItems.map((review) => review.eventId),
    ['E02', 'E04', 'E06', 'E12']
  )
  for (const event of reviewEvents) {
    for (const id of event.sourceIds) {
      const source = reviewSources.find((source) => source.id === id)
      assert.ok(source, `${event.id} references missing ${id}`)
      assert.equal(source.eventId, event.id)
    }
  }
  for (const source of reviewSources) {
    assert.ok(
      reviewEvents
        .find((event) => event.id === source.eventId)
        ?.sourceIds.includes(source.id)
    )
    assert.ok(evidenceKinds.includes(source.kind))
  }
  for (const review of reviewItems) {
    assert.equal(
      new Set(review.checkpoints.map((checkpoint) => checkpoint.id)).size,
      review.checkpoints.length
    )
    assert.equal(review.checkpoints.at(-1).week, null)
    for (const checkpoint of review.checkpoints) {
      for (const id of checkpoint.sourceIds) {
        assert.equal(
          reviewSources.find((source) => source.id === id)?.eventId,
          review.eventId
        )
      }
    }
  }
  assert.deepEqual(
    Object.fromEntries(
      evidenceKinds.map((kind) => [
        kind,
        reviewSources.filter((source) => source.kind === kind).length
      ])
    ),
    {
      spec: 10,
      decision: 7,
      verification: 9,
      feedback: 6
    }
  )
})

test('initial aggregation and stable overview distribution match the release', () => {
  assert.deepEqual(
    aggregateReviewEvents(selectReviewEvents(initialReviewFilters)),
    {
      events: 12,
      targets: 3,
      expected: 7,
      unexpected: 3,
      unclassified: 2,
      eventsWithEvidence: 10,
      sources: 32,
      openReviews: 4
    }
  )
  assert.deepEqual(reviewDistribution, [
    {
      targetId: 'onboarding',
      total: 6,
      Expected: 3,
      Unexpected: 2,
      unclassified: 1
    },
    {
      targetId: 'integrations',
      total: 4,
      Expected: 3,
      Unexpected: 1,
      unclassified: 0
    },
    {
      targetId: 'permissions',
      total: 2,
      Expected: 1,
      Unexpected: 0,
      unclassified: 1
    }
  ])
})

const cases = [
  {
    name: 'onboarding',
    filters: { targetId: 'onboarding' },
    ids: ['E01', 'E02', 'E03', 'E04', 'E05', 'E06'],
    linked: 5,
    sources: 15,
    reviews: ['R01', 'R02', 'R03']
  },
  {
    name: 'onboarding Expected',
    filters: { targetId: 'onboarding', classification: 'Expected' },
    ids: ['E01', 'E02', 'E03'],
    linked: 3,
    sources: 10,
    reviews: ['R01']
  },
  {
    name: 'integrations',
    filters: { targetId: 'integrations' },
    ids: ['E07', 'E08', 'E09', 'E10'],
    linked: 4,
    sources: 13,
    reviews: []
  },
  {
    name: 'permissions',
    filters: { targetId: 'permissions' },
    ids: ['E11', 'E12'],
    linked: 1,
    sources: 4,
    reviews: ['R04']
  },
  {
    name: 'unclassified',
    filters: { classification: 'unclassified' },
    ids: ['E06', 'E12'],
    linked: 0,
    sources: 0,
    reviews: ['R03', 'R04']
  },
  {
    name: 'open review',
    filters: questionPresets['open-review'],
    ids: ['E02', 'E04', 'E06', 'E12'],
    linked: 2,
    sources: 6,
    reviews: ['R01', 'R02', 'R03', 'R04']
  },
  {
    name: 'open review Expected',
    filters: { ...questionPresets['open-review'], classification: 'Expected' },
    ids: ['E02'],
    linked: 1,
    sources: 3,
    reviews: ['R01']
  },
  {
    name: 'no linked evidence',
    filters: questionPresets['no-linked-evidence'],
    ids: ['E06', 'E12'],
    linked: 0,
    sources: 0,
    reviews: ['R03', 'R04']
  },
  {
    name: 'no linked evidence in integrations',
    filters: {
      ...questionPresets['no-linked-evidence'],
      targetId: 'integrations'
    },
    ids: [],
    linked: 0,
    sources: 0,
    reviews: []
  }
]

for (const scenario of cases) {
  test(`intersected selection: ${scenario.name}`, () => {
    const visible = selectReviewEvents({
      ...initialReviewFilters,
      ...scenario.filters
    })
    const totals = aggregateReviewEvents(visible)
    assert.deepEqual(
      visible.map((event) => event.id),
      scenario.ids
    )
    assert.equal(totals.events, scenario.ids.length)
    assert.equal(
      totals.targets,
      new Set(visible.map((event) => event.targetId)).size
    )
    assert.equal(totals.eventsWithEvidence, scenario.linked)
    assert.equal(totals.sources, scenario.sources)
    assert.equal(totals.openReviews, scenario.reviews.length)
    assert.deepEqual(
      getReviewsForEvents(visible).map((review) => review.id),
      scenario.reviews
    )
  })
}

test('classification, linked evidence and review status remain independent fields', () => {
  const expectedWithoutSources = { ...reviewEvents[0], sourceIds: [] }
  const unclassifiedWithSources = { ...reviewEvents[6], classification: null }
  const records = [expectedWithoutSources, unclassifiedWithSources]
  assert.deepEqual(
    selectReviewEvents(
      { ...initialReviewFilters, focus: 'no-linked-evidence' },
      records
    ),
    [expectedWithoutSources]
  )
  assert.deepEqual(
    selectReviewEvents(
      { ...initialReviewFilters, classification: 'unclassified' },
      records
    ),
    [unclassifiedWithSources]
  )
  assert.deepEqual(
    selectReviewEvents(
      { ...initialReviewFilters, focus: 'open-review' },
      records
    ),
    []
  )
  assert.equal(aggregateReviewEvents(records).expected, 1)
  assert.equal(aggregateReviewEvents(records).unclassified, 1)
})

test('aggregation deduplicates events and filters never change the fixture or overview', () => {
  const before = JSON.stringify({
    reviewEvents,
    reviewSources,
    reviewItems,
    reviewDistribution
  })
  const event = reviewEvents[1]
  assert.deepEqual(
    aggregateReviewEvents([event, event]),
    aggregateReviewEvents([event])
  )
  for (const filters of Object.values(questionPresets)) {
    getReviewsForEvents(selectReviewEvents(filters))
  }
  assert.equal(
    JSON.stringify({
      reviewEvents,
      reviewSources,
      reviewItems,
      reviewDistribution
    }),
    before
  )
  assert.deepEqual(
    getEventSources(event, 'decision').map((source) => source.id),
    ['E02-D']
  )
  assert.deepEqual(getEventSources(reviewEvents[5]), [])
})

const catalogs = {
  en: enExecutiveReviewMessages,
  'pt-BR': ptBrExecutiveReviewMessages,
  'zh-Hant': zhHantExecutiveReviewMessages,
  ja: jaExecutiveReviewMessages
}
const leafEntries = (object, prefix = '') =>
  Object.entries(object).flatMap(([key, value]) =>
    typeof value === 'string'
      ? [[`${prefix}${key}`, value]]
      : leafEntries(value, `${prefix}${key}.`)
  )

test('all four catalogs contain every source, event and checkpoint with matching ICU contracts', () => {
  const expectedKeys = leafEntries(enExecutiveReviewMessages)
    .map(([key]) => key)
    .sort()
  for (const [locale, messages] of Object.entries(catalogs)) {
    assert.deepEqual(
      leafEntries(messages)
        .map(([key]) => key)
        .sort(),
      expectedKeys,
      locale
    )
    assert.ok(
      leafEntries(messages).every(([, value]) => value.trim().length > 0)
    )
    for (const event of reviewEvents)
      assert.ok(
        messages.events[event.id]?.title && messages.events[event.id]?.summary
      )
    for (const source of reviewSources) assert.ok(messages.sources[source.id])
    for (const review of reviewItems) {
      assert.ok(
        messages.reviews[review.id]?.limit &&
          messages.reviews[review.id]?.nextDecision
      )
      for (const checkpoint of review.checkpoints)
        assert.ok(
          messages.reviews[review.id].checkpoints[checkpoint.id]?.description
        )
    }
    const t = createTranslator({
      locale,
      messages,
      onError(error) {
        throw error
      }
    })
    for (const count of [0, 1, 12]) {
      const numbers = {
        events: count,
        targets: count,
        expected: count,
        unexpected: count,
        unclassified: count,
        eventsWithEvidence: count,
        openReviews: count
      }
      for (const key of [
        'answers.overview',
        'answers.noEvidence',
        'answers.openReview'
      ])
        assert.ok(t(key, numbers))
      assert.ok(t('labels.resultStatus', { count }))
      assert.ok(
        t('matrix.linkedCellLabel', {
          eventTitle: messages.events.E02.title,
          sourceKind: messages.kinds.decision,
          count
        })
      )
    }
    assert.ok(t('metrics.evidenceRatio', { linked: 10, total: 12 }))
    assert.ok(
      t('labels.selectionSummary', {
        focus: messages.questions.overview,
        target: messages.labels.allTargets,
        classification: messages.labels.allClassifications
      })
    )
    assert.ok(
      t('source.referenceLabel', {
        id: 'E02-D',
        eventTitle: messages.events.E02.title,
        sourceKind: messages.kinds.decision
      })
    )
  }
})
