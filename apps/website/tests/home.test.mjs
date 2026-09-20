import assert from 'node:assert/strict'
import { test } from 'node:test'

// Run against a real Next.js server: WEBSITE_TEST_URL=http://localhost:3000.
const base = process.env.WEBSITE_TEST_URL ?? 'http://localhost:3000'
const routes = [
  ['/', 'en'],
  ['/pt-br', 'pt-BR'],
  ['/zh-hant', 'zh-Hant'],
  ['/ja', 'ja']
]

async function readPage(path, headers) {
  const response = await fetch(new URL(path, base), {
    headers,
    redirect: 'manual'
  })
  const html = (await response.text()).replace(
    /<script\b[^>]*>[\s\S]*?<\/script>/gi,
    ''
  )
  return { response, html }
}

for (const [path, locale] of routes) {
  test(`${path} serves a complete localized home directly and repeatedly`, async () => {
    for (let request = 0; request < 2; request++) {
      const { response, html } = await readPage(path)
      assert.equal(response.status, 200)
      assert.match(html, new RegExp(`<html[^>]*lang="${locale}"`))
      assert.match(html, /<html[^>]*data-theme="dark"/)
      assert.equal([...html.matchAll(/<h1\b/g)].length, 1)
      assert.match(html, /rel="canonical"/)
      for (const [, language] of routes) {
        assert.match(html, new RegExp(`hrefLang="${language}"`, 'i'))
      }
      for (const id of [
        'why',
        'movement-details',
        'attribution',
        'integrations',
        'executive-review',
        'voice',
        'pricing',
        'early-access'
      ]) {
        assert.equal(
          [...html.matchAll(new RegExp(`id="${id}"`, 'g'))].length,
          1
        )
      }
      assert.ok(
        html.indexOf('id="why"') < html.indexOf('id="movement-details"')
      )
      assert.ok(
        html.indexOf('id="movement-details"') < html.indexOf('id="attribution"')
      )
      assert.ok(html.indexOf('id="intent"') < html.indexOf('id="integrations"'))
      assert.ok(
        html.indexOf('id="integrations"') <
          html.indexOf('id="executive-review"')
      )
      assert.ok(
        html.indexOf('id="executive-review"') < html.indexOf('id="voice"')
      )
      const review = html
        .split('id="executive-review"')[1]
        ?.split('id="voice"')[0]
      assert.ok(review, 'Executive review is available before hydration')
      assert.equal([...review.matchAll(/data-review-question=/g)].length, 3)
      assert.equal([...review.matchAll(/data-review-event=/g)].length, 12)
      assert.equal([...review.matchAll(/data-review-item=/g)].length, 4)
      for (const [metric, value] of [
        ['events', '12'],
        ['targets', '3'],
        ['reviews', '4']
      ]) {
        assert.match(
          review,
          new RegExp(
            `data-review-metric="${metric}"><span[^>]*>${value}</span>`
          )
        )
      }
      const scenarioSection = html.split('id="why"')[1]?.split('</section>')[0]
      assert.ok(
        scenarioSection,
        'The explanation follows the hero in server HTML'
      )
      assert.equal([...scenarioSection.matchAll(/role="tab"/g)].length, 3)
      assert.equal(
        [...scenarioSection.matchAll(/aria-selected="true"/g)].length,
        1
      )
      assert.match(scenarioSection, /data-scenario="priority-shift"/)
      assert.doesNotMatch(
        scenarioSection,
        /data-scenario="(?:product-trade-off|new-opportunity)"/
      )
      assert.equal(
        [...scenarioSection.matchAll(/class="vle-evidence-record"/g)].length,
        3
      )
      assert.equal(
        [...scenarioSection.matchAll(/aria-expanded="false"/g)].length,
        3
      )
      const header = html.match(/<header\b[^>]*>[\s\S]*?<\/header>/)?.[0]
      assert.ok(header, 'Header is present in the server response')
      assert.ok([...header.matchAll(/href="[^"]*#early-access"/g)].length >= 2)
      assert.match(header, /href="[^"]*#integrations"/)
      assert.doesNotMatch(header, /href="[^"]*\/(?:sign-in|sign-up)"/)
      assert.doesNotMatch(
        html,
        /Visual-first for truth · Voice-first for inquiry/
      )
      assert.doesNotMatch(
        html,
        /<form\b/,
        'Informational early access does not simulate capture'
      )
    }
  })
}

test('English root ignores browser language and a stale locale cookie', async () => {
  const { response, html } = await readPage('/', {
    'Accept-Language': 'ja,pt-BR;q=0.9',
    Cookie: 'NEXT_LOCALE=pt-BR'
  })
  assert.equal(response.status, 200)
  assert.match(html, /<html[^>]*lang="en"/)
  assert.match(html, /Why did your Product Vision fall from/)
})

test('Localization reaches the existing sections below the hero', async () => {
  const pages = await Promise.all(
    routes.map(async ([path]) => (await readPage(path)).html)
  )
  // The new #why heading intentionally preserves the three canonical pillar names.
  const introductions = pages.map(
    (html) => html.split('id="why"')[1]?.match(/<p>([\s\S]*?)<\/p>/)?.[1]
  )
  assert.ok(introductions.every(Boolean))
  assert.equal(new Set(introductions).size, routes.length)
  for (const id of [
    'movement-details',
    'attribution',
    'integrations',
    'executive-review',
    'voice',
    'pricing'
  ]) {
    const headings = pages.map((html) => {
      const section = html.split(`id="${id}"`)[1]?.split('</section>')[0]
      const heading = section?.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/)?.[1]
      assert.ok(heading, `${id} has a server-rendered heading`)
      return heading
    })
    assert.equal(
      new Set(headings).size,
      routes.length,
      `${id} is translated in all locales`
    )
  }
})

test('Unknown locales are invalid and assets bypass locale routing', async () => {
  assert.equal((await readPage('/fr')).response.status, 404)
  assert.equal((await readPage('/pt-br/missing-page')).response.status, 404)
  const asset = await fetch(new URL('/favicon.ico', base), {
    redirect: 'manual'
  })
  assert.equal(asset.status, 200)
  assert.match(asset.headers.get('content-type'), /image\//)
})
