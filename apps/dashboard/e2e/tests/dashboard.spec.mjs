import { expect, test } from '@playwright/test'

import { failThemeWrite, visit } from './browser-support.mjs'

const routes = [
  'overview',
  'evolution',
  'decisions',
  'people',
  'reports',
  'settings',
  'evidence',
  'vision-baseline',
  'drift-graph',
  'drift-timeline',
  'drift-events',
  'drift-by-team',
  'drift-by-product-area',
  'intentional-drift',
  'unexplained-drift',
  'drift-report'
]

test('all public Dashboard routes render without browser errors', async ({
  page
}) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))

  await page.goto('/')

  await expect(page).toHaveURL(/\/overview$/)

  for (const route of routes) {
    const response = await page.goto(`/${route}`)

    if (!response) throw new Error(`No navigation response for ${route}`)
    expect(response.status(), route).toBe(200)

    await expect(page.getByRole('main')).toBeVisible()

    await expect(page.getByRole('status', { name: /^Loading / })).toHaveCount(0)

    await expect(
      page.getByRole('main').getByRole('heading').first()
    ).toBeVisible()
  }

  expect(errors).toEqual([])
})

test('global fallback recovers after a one-shot browser theme-write failure', async ({
  page
}) => {
  await visit(page, '/overview')

  await failThemeWrite(page)

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

  await page.getByRole('button', { name: 'Try again' }).click()

  await expect(
    page.getByRole('heading', { name: 'Overview', exact: true })
  ).toBeVisible()
})

test('mobile navigation and voice preserve modality, focus, and scroll', async ({
  page
}) => {
  await page.setViewportSize({ width: 320, height: 780 })

  await visit(page, '/overview')

  for (const [triggerName, dialogName] of [
    ['Open navigation', 'Mobile navigation'],
    ['Ask LangDrift', 'Ask LangDrift']
  ]) {
    const trigger = page.getByRole('button', { name: triggerName, exact: true })

    await trigger.click()

    const dialog = page.getByRole('dialog', { name: dialogName, exact: true })

    await expect(dialog).toBeVisible()

    const modal = await dialog.evaluate((element) => element.matches(':modal'))

    expect(modal).toBe(true)

    const overflow = await page.evaluate(() => document.body.style.overflow)

    expect(overflow).toBe('hidden')

    for (const key of ['Shift+Tab', 'Tab', 'Tab', 'Shift+Tab']) {
      await page.keyboard.press(key)

      const containsFocus = await dialog.evaluate((element) =>
        element.contains(document.activeElement)
      )

      expect(containsFocus).toBe(true)
    }

    await page.keyboard.press('Escape')

    await expect(dialog).toHaveCount(0)

    await expect(trigger).toBeFocused()

    const restoredOverflow = await page.evaluate(
      () => document.body.style.overflow
    )

    expect(restoredOverflow).toBe('')
  }
})

test('desktop voice remains nonmodal and filters survive user interaction', async ({
  page
}) => {
  await visit(page, '/evolution')

  await page.getByRole('button', { name: 'Ask LangDrift', exact: true }).click()

  const voice = page.getByRole('dialog', { name: 'Ask LangDrift', exact: true })

  const modal = await voice.evaluate((element) => element.matches(':modal'))

  expect(modal).toBe(false)

  await page
    .getByRole('button', { name: 'What changed this week?', exact: true })
    .click()

  await expect(
    page.getByText(/Authentication was the largest contributor/)
  ).toBeVisible()

  await page.keyboard.press('Escape')

  await expect(voice).toHaveCount(0)

  for (const label of ['Unexplained', 'Team', '30d']) {
    const control = page.getByRole('button', { name: label, exact: true })

    await control.click()

    await expect(control).toHaveAttribute('aria-pressed', 'true')
  }
})

test('theme transitions, reduced motion, and keyboard focus remain observable', async ({
  page
}) => {
  await visit(page, '/overview')

  const transitionDuration = await page
    .locator('body')
    .evaluate((element) => getComputedStyle(element).transitionDuration)

  expect(transitionDuration).toBe('0.18s, 0.18s')

  await page.keyboard.press('Tab')

  const skip = page.getByRole('link', { name: 'Skip to main content' })

  await expect(skip).toBeFocused()

  await page.keyboard.press('Enter')

  await expect(page.getByRole('main')).toBeFocused()

  const themeControl = page
    .getByRole('button', { name: 'Switch to dark mode' })
    .first()

  await themeControl.focus()

  await page.keyboard.press('Enter')

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

  await page.emulateMedia({ reducedMotion: 'reduce' })

  const transitionProperty = await page
    .locator('body')
    .evaluate((element) => getComputedStyle(element).transitionProperty)

  expect(transitionProperty).toBe('none')
})

test('language switching persists a non-Latin locale across navigation', async ({
  page,
  context
}) => {
  await visit(page, '/settings')

  await page.getByRole('button', { name: '日本語', exact: true }).click()

  await expect(page.locator('html')).toHaveAttribute('lang', 'ja')

  await expect(
    page.getByRole('button', { name: '日本語', exact: true })
  ).toHaveAttribute('aria-pressed', 'true')

  const cookies = await context.cookies()

  const localeCookie = cookies.find(
    (cookie) => cookie.name === 'langdrift-dashboard-locale'
  )
  expect(localeCookie?.value).toBe('ja')

  await page.goto('/overview')

  await expect(page.locator('html')).toHaveAttribute('lang', 'ja')
})

test('narrow layouts keep the route matrix within the viewport', async ({
  page
}) => {
  await page.setViewportSize({ width: 320, height: 780 })

  for (const route of routes) {
    await visit(page, `/${route}`)

    const documentWidth = await page.evaluate(
      () => document.documentElement.scrollWidth
    )

    expect(documentWidth, route).toBeLessThanOrEqual(320)
  }
})
