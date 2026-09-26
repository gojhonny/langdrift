import { expect, test } from '@playwright/test'

async function readyFonts(page) {
  await page.evaluate(async () => {
    const faces = await Promise.all([
      ...[400, 500, 600, 650].map((weight) =>
        document.fonts.load(`${weight} 16px "Space Grotesk"`)
      ),
      ...[400, 700].map((weight) =>
        document.fonts.load(`${weight} 16px "Space Mono"`)
      )
    ])

    if (faces.some((loaded) => loaded.length === 0))
      throw new Error('Required Website fonts were not available')

    await document.fonts.ready
  })
}

async function visit(page, route = '/en') {
  await page.goto(route)

  await expect(page.locator('.website-theme-toggle')).toBeEnabled()

  await readyFonts(page)

  await expect(page.locator('.hero-chart-card .recharts-surface')).toBeVisible()

  await expect(page.locator('.hero-graph-stage')).toHaveAttribute(
    'data-status',
    'ready'
  )
}

test('mobile navigation preserves locale URL, focus and scroll ownership', async ({
  page
}) => {
  await page.setViewportSize({ width: 390, height: 844 })

  await visit(page, '/en?source=structure#why')

  const trigger = page.locator('.website-navigation-trigger')
  const drawer = page.locator('#website-navigation-drawer')

  await trigger.click()

  await expect(drawer).toBeVisible()

  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')

  await page.keyboard.press('Escape')

  await expect(drawer).not.toBeVisible()

  await expect(trigger).toBeFocused()

  await trigger.click()

  await drawer.getByRole('link', { name: /日本|Japanese/i }).click()

  await expect(page).toHaveURL(/\/ja\?source=structure#why$/)

  await expect(drawer).not.toBeVisible()

  await expect(trigger).toBeFocused()

  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')

  await trigger.click()

  await page.setViewportSize({ width: 1440, height: 900 })

  await expect(drawer).not.toBeVisible()
})

test('scenario and evidence inspection retain selection and return focus', async ({
  page
}) => {
  await visit(page)

  const scenarios = page.locator('.vle-scenario-tabs').getByRole('tab')

  await scenarios.nth(1).click()

  await expect(scenarios.nth(1)).toHaveAttribute('aria-selected', 'true')

  await expect(page.locator('.vle-panel:not([hidden])')).toBeVisible()

  const source = page.locator('[data-review-source]').first()

  const sourceId = await source.getAttribute('data-review-source')

  if (!sourceId)
    throw new Error('Source link must identify its evidence record')

  await source.click()

  const inspector = page.locator('.review-source-context')

  await expect(inspector).toBeVisible()

  await expect(inspector).toContainText(sourceId)

  await expect(inspector.getByRole('heading')).toBeFocused()

  await inspector.getByRole('button').click()

  await expect(inspector).not.toBeVisible()

  await expect(source).toBeFocused()

  await page.locator('[data-review-question="open-review"]').click()

  await expect(page.locator('[data-review-answer="open-review"]')).toBeVisible()

  await page.locator('.review-reset').click()

  await expect(page.locator('[data-review-answer="overview"]')).toBeVisible()
})

test('chart selection updates movement details without a navigation', async ({
  page
}) => {
  await visit(page)

  const initialUrl = page.url()
  const events = page
    .locator('.hero-chart-card .product-vision-chart')
    .getByRole('button')

  await expect(events.first()).toBeVisible()

  const initial = await page.locator('.reason-card').textContent()

  if (!initial) throw new Error('Selected movement must contain its details')

  await events.first().click()

  await expect(page.locator('.reason-card')).not.toHaveText(initial)

  await expect(page).toHaveURL(initialUrl)
})

async function captureRegion(page, selector, name) {
  const region = page.locator(selector)

  await region.scrollIntoViewIfNeeded()

  await readyFonts(page)

  const geometry = await region.evaluate((element) => {
    const bounds = element.getBoundingClientRect()
    const text = element.querySelector('p, strong, span') || element
    const style = getComputedStyle(text)

    return {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      scrollY,
      font: style.font,
      color: style.color,
      transform: style.transform
    }
  })

  await test.info().attach(`${name}-geometry`, {
    body: JSON.stringify(geometry),
    contentType: 'application/json'
  })

  // The fixed header fits the viewport; avoid Chromium's beyond-viewport path
  // for this small region. Tall regions retain their full document dimensions.
  const fullPage = selector !== '.website-header'
  const clip = {
    x: Math.floor(geometry.x),
    y: Math.floor(geometry.y + (fullPage ? geometry.scrollY : 0)),
    width: Math.ceil(geometry.width),
    height: Math.ceil(geometry.height)
  }

  if (fullPage) {
    // Full-page preparation can trigger a font repaint. Settle that preparation
    // before comparison, without changing fonts, dimensions or expected pixels.
    await page.screenshot({
      fullPage,
      clip,
      animations: 'disabled',
      caret: 'hide'
    })

    await readyFonts(page)

    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve))
        )
    )
  }

  await expect(page).toHaveScreenshot(`${name}.png`, { fullPage, clip })

  const candidate = test.info().outputPath(`${name}.png`)

  await page.screenshot({
    path: candidate,
    fullPage,
    clip,
    animations: 'disabled',
    caret: 'hide'
  })

  await test.info().attach(name, { path: candidate, contentType: 'image/png' })
}

for (const [size, viewport] of [
  ['desktop', { width: 1440, height: 900 }],
  ['mobile', { width: 390, height: 844 }]
]) {
  for (const theme of ['light', 'dark']) {
    test(`${size} ${theme} component appearance`, async ({ page }) => {
      await page.setViewportSize(viewport)

      await page.emulateMedia({ reducedMotion: 'reduce' })

      await visit(page)

      const currentTheme = await page.locator('html').getAttribute('data-theme')

      if (!currentTheme) throw new Error('Website theme must be initialized')
      if (currentTheme !== theme) {
        await page.locator('.website-theme-toggle').click()
      }

      await expect(page.locator('html')).toHaveAttribute('data-theme', theme)

      await page.mouse.move(0, 0)

      for (const [selector, label] of [
        ['.website-header', 'header'],
        ['.hero-chart-card', 'chart'],
        ['.vision-loop-demo', 'scenario'],
        ['.integrations-section', 'integrations'],
        ['.executive-review-demo', 'review']
      ]) {
        await captureRegion(page, selector, `${size}-${theme}-${label}`)
      }
    })
  }
}

test('all localized routes remain renderable', async ({ page }) => {
  for (const locale of ['en', 'pt-BR', 'zh-Hant', 'ja']) {
    for (const route of ['', '/pricing']) {
      const response = await page.goto(`/${locale}${route}`)

      if (!response) throw new Error('Localized route must return a response')

      expect(response.status()).toBe(200)

      await expect(page.locator('html')).toHaveAttribute('lang', locale)

      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

      await expect(page.locator('input[type="email"]')).toHaveCount(1)

      await expect(page.locator('input[type="email"]')).not.toHaveAttribute(
        'name'
      )
    }
  }
})

test('modified locale link opens its destination without replacing the current page', async ({
  page,
  context
}) => {
  await visit(page, '/en?source=structure#why')

  const initialUrl = page.url()
  const language = page
    .locator('.website-header-access')
    .getByRole('link', { name: 'Japanese' })

  await expect(language).toHaveAttribute('href', /\/ja\?source=structure#why$/)

  const opened = context.waitForEvent('page')

  await language.click({ modifiers: ['ControlOrMeta'] })

  const destination = await opened

  await destination.bringToFront()

  // Observe the navigation outcome directly; locator assertions wait for a
  // pending background document load even after the target URL has committed.
  // The separate locale matrix verifies the destination document's rendering.
  await expect
    .poll(() => destination.url())
    .toMatch(/\/ja\?source=structure#why$/)

  await expect(page).toHaveURL(initialUrl)

  await destination.close()
})

for (const [size, viewport] of [
  ['desktop', { width: 1440, height: 900 }],
  ['mobile', { width: 390, height: 844 }]
]) {
  test(`${size} pricing and Japanese composition appearance`, async ({
    page
  }) => {
    await page.setViewportSize(viewport)

    await page.emulateMedia({ reducedMotion: 'reduce' })

    await page.goto('/en/pricing')

    await page.locator('.website-theme-toggle').click()

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

    await page.locator('.website-theme-toggle').click()

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    await page.evaluate(() => document.fonts.ready)

    await captureRegion(page, '.plans-page', `${size}-pricing`)

    await visit(page, '/ja')

    await captureRegion(page, '.website-header', `${size}-japanese-header`)

    await captureRegion(page, '.vision-loop-demo', `${size}-japanese-scenario`)
  })
}
