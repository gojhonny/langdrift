import { execFile } from 'node:child_process'
import { resolve } from 'node:path'
import { promisify } from 'node:util'
import { expect, test } from '@playwright/test'

const execute = promisify(execFile)
const challengeFailureByLocale = {
  en: 'Please complete the security check and try again.',
  'pt-BR': 'Conclua a verificação de segurança e tente novamente.',
  'zh-Hant': '請完成安全驗證後再試一次。',
  ja: 'セキュリティ確認を完了して、もう一度お試しください。'
} as const

async function mockChallenge(page: import('@playwright/test').Page) {
  await page.route(
    'https://challenges.cloudflare.com/turnstile/v0/api.js*',
    async (route) => {
      await route.fulfill({
        contentType: 'application/javascript',
        body: `(()=>{const widgets=new Map();window.turnstile={render(el,options){const id=crypto.randomUUID();widgets.set(id,options);el.dataset.ready='true';options.callback('test-'+crypto.randomUUID());return id},reset(id){widgets.get(id)?.callback('test-'+crypto.randomUUID())}}})()`
      })
    }
  )
}

test('landing and pricing accept one registration per email', async ({
  page,
  request
}) => {
  test.setTimeout(120000)
  await mockChallenge(page)
  const email = `browser-${Date.now()}@example.com`
  await page.goto('/')
  await page
    .locator('.early-access-challenge div[data-ready=true]')
    .waitFor({ state: 'attached' })
  await page.getByLabel('Email address').fill(email)
  await page.getByLabel('Email address').press('Enter')
  await expect(page.getByText('You’re on the early-access list.')).toBeVisible()

  await page.goto('/pricing')
  await page
    .locator('.early-access-challenge div[data-ready=true]')
    .waitFor({ state: 'attached' })
  await page.getByLabel('Email address').fill(email)
  await page.getByRole('button', { name: /join early access/i }).click()
  await expect(page.getByText('You’re on the early-access list.')).toBeVisible()

  await expect
    .poll(async () => {
      const response = await request.get('http://127.0.0.1:18082/state')
      const state = (await response.json()) as {
        records: { recipient: string }[]
      }
      return state.records.filter((record) => record.recipient === email).length
    })
    .toBe(1)

  const proof = await execute(
    'docker',
    [
      'compose',
      '-f',
      resolve(__dirname, '../../containers/e2e/docker-compose.yml'),
      '--profile',
      'proof',
      'run',
      '--rm',
      '--no-deps',
      'runner',
      '--inspect',
      email
    ],
    { timeout: 90000 }
  )
  expect(proof.stdout).toContain(
    'browser storage, events and provider identity proved'
  )
  expect(page.url()).not.toContain(email)
  expect(
    await page.evaluate((value) => {
      return (
        Object.values(localStorage).some((entry) => entry.includes(value)) ||
        Object.values(sessionStorage).some((entry) => entry.includes(value))
      )
    }, email)
  ).toBe(false)
})

test('all locales show accessible challenge feedback when verification fails', async ({
  page
}) => {
  await page.route(
    'https://challenges.cloudflare.com/turnstile/v0/api.js*',
    async (route) => {
      await route.fulfill({
        contentType: 'application/javascript',
        body: `window.turnstile={render:function(el){el.dataset.ready='true';return 'widget'},reset:function(){}}`
      })
    }
  )
  for (const [locale, path] of [
    ['en', '/'],
    ['pt-BR', '/pt-br'],
    ['zh-Hant', '/zh-hant'],
    ['ja', '/ja']
  ] as const) {
    await page.goto(path)
    await page
      .locator('.early-access-challenge div[data-ready=true]')
      .waitFor({ state: 'attached' })
    await page.locator('input[type=email]').fill(`test-${locale}@example.com`)
    await page.locator('button[type=submit]').click()
    await expect(page.locator('.early-access-feedback')).toContainText(
      challengeFailureByLocale[locale]
    )
    await expect(page.locator('.early-access-feedback')).toHaveAttribute(
      'aria-live',
      'polite'
    )
    await expect(page.locator('.early-access-challenge legend')).toBeVisible()
  }
})

test('submission stays disabled before hydration without exposing email in a URL', async ({
  browser
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  try {
    await page.goto('http://127.0.0.1:13000/')
    await expect(page.locator('button[type=submit]')).toBeDisabled()
    await expect(page.locator('input[type=email]')).not.toHaveAttribute('name')
  } finally {
    await context.close()
  }
})
