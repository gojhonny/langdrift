import { readFileSync } from 'node:fs'
import { parseEnv } from 'node:util'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

beforeEach(() => {
  vi.resetModules()
  const development = parseEnv(
    readFileSync('apps/website/.env.development', 'utf8')
  )
  for (const [key, value] of Object.entries(development)) vi.stubEnv(key, value)
  vi.stubEnv('EMAIL_SERVICE_API_KEY', 'test-service-key')
  vi.stubEnv('TURNSTILE_SECRET_KEY', '1x0000000000000000000000000000000AA')
})

afterEach(() => vi.unstubAllEnvs())

describe('Website environment contract', () => {
  it('uses the tracked development verifier unchanged', async () => {
    const { earlyAccessServerEnv } = await import('@environment/server')
    expect(earlyAccessServerEnv.turnstileVerifyUrl).toBe(
      process.env.TURNSTILE_VERIFY_URL
    )
  })

  it('requires an explicit verifier URL', async () => {
    vi.stubEnv('TURNSTILE_VERIFY_URL', undefined)
    await expect(import('@environment/server')).rejects.toThrow(
      'Missing required environment variable: TURNSTILE_VERIFY_URL'
    )
  })

  it('allows the browser proof override in test mode', async () => {
    const overrides = parseEnv(
      readFileSync(
        'messaging/runtime/early-access/e2e/.env.development',
        'utf8'
      )
    )
    for (const [key, value] of Object.entries(overrides)) vi.stubEnv(key, value)
    vi.stubEnv('EARLY_ACCESS_MODE', 'test')
    const { earlyAccessServerEnv } = await import('@environment/server')
    expect(earlyAccessServerEnv.turnstileVerifyUrl).toBe(
      overrides.TURNSTILE_VERIFY_URL
    )
    expect(earlyAccessServerEnv.serviceUrl).toBe(overrides.EMAIL_SERVICE_URL)
  })

  it('accepts the explicit Cloudflare verifier with production credentials', async () => {
    vi.stubEnv('EARLY_ACCESS_MODE', 'production')
    vi.stubEnv('EMAIL_SERVICE_URL', 'https://service.example.com')
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'production-secret-fixture')
    vi.stubEnv('NEXT_PUBLIC_TURNSTILE_SITE_KEY', 'production-site-fixture')
    const { earlyAccessServerEnv } = await import('@environment/server')
    expect(earlyAccessServerEnv.mode).toBe('production')
  })
})
