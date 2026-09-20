import assert from 'node:assert/strict'
import { test } from 'node:test'

const base = process.env.WEBSITE_TEST_URL ?? 'http://localhost:3000'
const paths = ['/pricing', '/pt-br/pricing', '/zh-hant/pricing', '/ja/pricing']
const locales = ['en', 'pt-BR', 'zh-Hant', 'ja']

for (const [index, path] of paths.entries()) {
  test(`${path} serves localized plans with its own metadata and form`, async () => {
    const response = await fetch(new URL(path, base), { redirect: 'manual' })
    assert.equal(response.status, 200)
    const html = (await response.text()).replace(
      /<script\b[^>]*>[\s\S]*?<\/script>/gi,
      ''
    )
    assert.match(html, new RegExp(`<html[^>]*lang="${locales[index]}"`))
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1)
    assert.equal([...html.matchAll(/<form\b/g)].length, 1)
    assert.equal([...html.matchAll(/id="early-access"/g)].length, 1)
    assert.match(html, /<input\b[^>]*type="email"/)
    assert.match(html, /Plus/)
    assert.match(html, /Pro/)
    assert.match(html, /15/)
    assert.ok(
      html
        .match(/<link\b[^>]*rel="canonical"[^>]*>/)?.[0]
        .includes(`https://langdrift.md${path}`)
    )
    const alternates = [
      ...html.matchAll(/<link\b[^>]*rel="alternate"[^>]*>/g)
    ].map(([link]) => link)
    for (const [otherIndex, otherPath] of paths.entries()) {
      assert.ok(
        alternates.some(
          (link) =>
            link.includes(`https://langdrift.md${otherPath}`) &&
            link
              .toLowerCase()
              .includes(`hreflang="${locales[otherIndex].toLowerCase()}"`)
        )
      )
    }
    assert.ok([...html.matchAll(/href="#early-access"/g)].length >= 3)
    assert.match(html, /href="[^"]*#faq"/)
    assert.doesNotMatch(html, /id="hero-heading"|\$0|\/month|#pricing"/)
    assert.match(html, /preset="neongate"/)
  })
}
