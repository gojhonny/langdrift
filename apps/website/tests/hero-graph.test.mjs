import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { test } from 'node:test'
import { createTranslator } from 'next-intl'
import { createStore } from 'jotai/vanilla'

// Node's TypeScript runner does not resolve extensionless workspace barrels.
// Resolve this one asset-only export to its source; no browser/React mock is needed.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === '@repo/react/ui/ai-avatars') {
      return {
        shortCircuit: true,
        url: new URL(
          '../../../packages/react/src/ui/ai-avatars/ai-avatars.ts',
          import.meta.url
        ).href
      }
    }
    return nextResolve(specifier, context)
  }
})

const { getHeroGraph, getHeroPoints, getHeroPointFromNodeClick } = await import(
  '../src/lib/hero-demo-data.ts'
)
const { demoMessages } = await import('../src/messages/demo.ts')
const {
  heroSelectionAtom,
  selectedPointAtom,
  selectHeroGraphPointAtom,
  themeAtom
} = await import('../src/state.ts')

function scenario(locale = 'en') {
  const t = createTranslator({ locale, messages: demoMessages[locale] })
  return { graph: getHeroGraph(t, locale), points: getHeroPoints(t, locale) }
}

test('Every localized context node has valid links, a card and a related existing curve event', () => {
  for (const locale of Object.keys(demoMessages)) {
    const { graph, points } = scenario(locale)
    const ids = new Set(graph.graph.map((node) => node.id))
    assert.ok(ids.size >= 48)
    assert.equal(ids.size, graph.graph.length, 'Node IDs are unique')

    const eventIds = new Set()
    for (const node of graph.graph) {
      assert.equal(node.presentation.type, 'card')
      assert.ok(node.presentation.title.length > 0)
      assert.ok(node.presentation.description.length > 0)
      assert.ok(node.presentation.reference.length > 0)
      assert.ok(node.presentation.badge.length > 0)
      assert.match(
        node.presentation.avatarUrl,
        /^\/demo\/avatars\/[a-z]+\.jpg$/
      )
      for (const link of node.links) assert.ok(ids.has(link.id))

      const index = getHeroPointFromNodeClick(
        { id: node.id, event: 'click', payload: node.payload },
        graph,
        points
      )
      assert.notEqual(index, undefined)
      assert.equal(points[index].event.id, node.payload.eventId)
      eventIds.add(node.payload.eventId)
    }
    assert.deepEqual([...eventIds].sort(), [
      'authentication',
      'baseline',
      'exports',
      'pricing'
    ])
    assert.deepEqual(
      points.map((point) => point.value),
      [91, 88, 84, 79, 73]
    )
  }
})

test('Only valid graph clicks select a point; hover, unknown nodes and mismatched payloads are ignored', () => {
  const { graph, points } = scenario()
  const click = {
    id: 'authentication',
    event: 'click',
    payload: { eventId: 'authentication' }
  }
  assert.equal(getHeroPointFromNodeClick(click, graph, points), 3)

  const rejected = [
    undefined,
    null,
    'authentication',
    {},
    { ...click, event: 'hover' },
    { ...click, id: 'unknown-node' },
    { ...click, payload: null },
    { ...click, payload: {} },
    { ...click, payload: { eventId: 'exports' } },
    { ...click, payload: { eventId: 3 } }
  ]
  for (const detail of rejected) {
    assert.equal(getHeroPointFromNodeClick(detail, graph, points), undefined)
  }

  assert.equal(
    getHeroPointFromNodeClick(click, graph, points.slice(0, 3)),
    undefined
  )
})

test('Locale changes translate presentation while preserving topology and event associations', () => {
  const english = scenario('en').graph.graph
  const portuguese = scenario('pt-BR').graph.graph
  for (const [index, node] of english.entries()) {
    const translated = portuguese[index]
    assert.equal(translated.id, node.id)
    assert.deepEqual(translated.payload, node.payload)
    assert.deepEqual(
      translated.links.map((link) => link.id),
      node.links.map((link) => link.id)
    )
    assert.notEqual(
      translated.presentation.description,
      node.presentation.description
    )
  }
})

test('Graph selection commits only a changed mapped event, with its origin and immediate data', () => {
  const store = createStore()
  const { graph, points } = scenario()
  const commits = []
  const stop = store.sub(heroSelectionAtom, () => {
    commits.push(store.get(heroSelectionAtom))
  })
  function click(id) {
    const node = graph.graph.find((entry) => entry.id === id)
    const index = getHeroPointFromNodeClick(
      { id, event: 'click', payload: node.payload },
      graph,
      points
    )
    if (index !== undefined) store.set(selectHeroGraphPointAtom, index)
  }

  assert.deepEqual(store.get(heroSelectionAtom), {
    pointIndex: 2,
    source: 'initial'
  })
  click('pricing')
  click('decision')
  assert.equal(commits.length, 0, 'Different nodes for current data are no-ops')

  click('authentication')
  assert.equal(store.get(selectedPointAtom), 3, 'Data commits immediately')
  assert.deepEqual(commits, [{ pointIndex: 3, source: 'graph' }])
  click('authentication')
  click('onboarding')
  assert.equal(commits.length, 1, 'Repeated event does not retrigger feedback')

  store.set(selectedPointAtom, 4)
  assert.deepEqual(store.get(heroSelectionAtom), {
    pointIndex: 4,
    source: 'chart'
  })
  click('exports')
  assert.equal(commits.length, 2, 'Graph cannot confirm unchanged chart data')

  click('vision')
  click('pricing')
  click('authentication')
  assert.deepEqual(store.get(heroSelectionAtom), {
    pointIndex: 3,
    source: 'graph'
  })
  const finalCommit = store.get(heroSelectionAtom)
  store.set(themeAtom, 'dark')
  scenario('pt-BR')
  assert.equal(store.get(heroSelectionAtom), finalCommit)
  assert.equal(commits.length, 5, 'Theme and translated data do not commit')
  stop()
})
