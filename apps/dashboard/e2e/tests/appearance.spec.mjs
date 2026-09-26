import { expect, test } from '@playwright/test'

import { capture, failThemeWrite, setTheme, visit } from './browser-support.mjs'

const viewports = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 }
}

for (const [size, viewport] of Object.entries(viewports)) {
  for (const theme of ['light', 'dark']) {
    for (const route of ['overview', 'evolution', 'settings', 'reports']) {
      test(`${size} ${theme} ${route} appearance`, async ({ page }) => {
        await page.setViewportSize(viewport)

        await page.emulateMedia({ reducedMotion: 'reduce' })

        await visit(page, `/${route}`)

        await setTheme(page, theme)

        await capture(page, `${size}-${theme}-${route}`)
      })
    }

    test(`${size} ${theme} voice and keyboard feedback appearance`, async ({
      page
    }) => {
      await page.setViewportSize(viewport)

      await page.emulateMedia({ reducedMotion: 'reduce' })

      await visit(page, '/overview')

      await setTheme(page, theme)

      await page
        .getByRole('button', { name: 'Ask LangDrift', exact: true })
        .click()

      await page.keyboard.press('Tab')

      await capture(page, `${size}-${theme}-voice-focus`)
    })

    test(`${size} ${theme} tooltip stays within the viewport`, async ({
      page
    }) => {
      await page.setViewportSize(viewport)

      await page.emulateMedia({ reducedMotion: 'reduce' })

      await visit(page, '/overview')

      await setTheme(page, theme)

      await page
        .getByRole('button', { name: 'Open account menu', exact: true })
        .hover()

      const tooltip = page.getByRole('tooltip', {
        name: 'Account',
        exact: true
      })

      await expect(tooltip).toBeVisible()

      const bounds = await tooltip.boundingBox()

      if (!bounds)
        throw new Error('Visible tooltip must have measurable bounds')
      expect(bounds.x).toBeGreaterThanOrEqual(0)
      expect(bounds.y).toBeGreaterThanOrEqual(0)
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width)
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(viewport.height)

      await capture(page, `${size}-${theme}-tooltip`)
    })
  }

  test(`${size} independent global fallback appearance`, async ({ page }) => {
    await page.setViewportSize(viewport)

    await visit(page, '/overview')

    await failThemeWrite(page)

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

    await capture(page, `${size}-global-error`)

    await page.getByRole('link', { name: 'Go to overview' }).click()

    await expect(
      page.getByRole('heading', { name: 'Overview', exact: true })
    ).toBeVisible()
  })
}

test('Japanese Settings preserves its localized layout', async ({ page }) => {
  await page.setViewportSize(viewports.mobile)

  await page.emulateMedia({ reducedMotion: 'reduce' })

  await visit(page, '/settings')

  await page.getByRole('button', { name: '日本語', exact: true }).click()

  await expect(page.locator('html')).toHaveAttribute('lang', 'ja')

  await capture(page, 'mobile-japanese-settings')
})

test('mobile navigation preserves layout and focused control appearance', async ({
  page
}) => {
  await page.setViewportSize({ width: 320, height: 780 })

  await page.emulateMedia({ reducedMotion: 'reduce' })

  await visit(page, '/overview')

  await page.getByRole('button', { name: 'Open navigation' }).click()

  await page.keyboard.press('Tab')

  await capture(page, 'narrow-navigation-focus')
})
