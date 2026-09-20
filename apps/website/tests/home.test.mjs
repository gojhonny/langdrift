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
      assert.equal([...html.matchAll(/<h1\b/g)].length, 1)
      assert.match(html, /rel="canonical"/)
      for (const [, language] of routes) {
        assert.match(html, new RegExp(`hrefLang="${language}"`, 'i'))
      }
      for (const id of [
        'why',
        'attribution',
        'voice',
        'pricing',
        'early-access'
      ]) {
        assert.match(html, new RegExp(`id="${id}"`))
      }
      const header = html.match(/<header\b[^>]*>[\s\S]*?<\/header>/)?.[0]
      assert.ok(header, 'Header is present in the server response')
      assert.ok([...header.matchAll(/href="[^"]*#early-access"/g)].length >= 2)
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
  for (const id of ['why', 'attribution', 'voice', 'pricing']) {
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
