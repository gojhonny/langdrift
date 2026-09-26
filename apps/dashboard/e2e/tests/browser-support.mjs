import { expect, test } from '@playwright/test'

export async function visit(page, route) {
  await page.goto(route)

  await expect(page.getByRole('status', { name: /^Loading / })).toHaveCount(0)

  await expect(page.getByRole('main')).toBeVisible()

  await page.evaluate(() => document.fonts.ready)
}

export async function setTheme(page, theme) {
  const currentTheme = await page.locator('html').getAttribute('data-theme')

  if (currentTheme !== theme) {
    await page
      .getByRole('button', { name: `Switch to ${theme} mode` })
      .first()
      .click()
  }

  await expect(page.locator('html')).toHaveAttribute('data-theme', theme)

  await page.mouse.move(0, 0)

  await page.getByRole('heading').first().click()
}

export async function capture(page, name) {
  const charts = page.locator('.product-vision-chart')

  const chartCount = await charts.count()

  for (let index = 0; index < chartCount; index += 1) {
    await expect(charts.nth(index).locator('.recharts-surface')).toBeVisible()

    await expect(charts.nth(index).getByRole('button').first()).toBeVisible()
  }

  // Freeze the decorative runtime; retain its rendered surface and dimensions.

  await page.evaluate(() => {
    for (const orb of document.querySelectorAll('orb-z')) {
      orb.setAttribute('paused', 'true')
    }
  })

  await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true })

  const candidatePath = test.info().outputPath(`${name}.png`)

  await page.screenshot({
    path: candidatePath,
    fullPage: true,
    animations: 'disabled',
    caret: 'hide'
  })

  await test
    .info()
    .attach(name, { path: candidatePath, contentType: 'image/png' })
}

export async function failThemeWrite(page) {
  await page.evaluate(() => {
    Object.defineProperty(document.documentElement.style, 'colorScheme', {
      configurable: true,
      set(value) {
        delete this.colorScheme
        this.setProperty('color-scheme', value)
        throw new Error('Dashboard browser test: one-shot theme write failure')
      }
    })
  })

  await page.getByRole('button', { name: 'Switch to dark mode' }).click()

  await expect(
    page.getByRole('heading', { name: 'The dashboard could not load' })
  ).toBeVisible()
}
