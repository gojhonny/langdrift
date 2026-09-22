import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('../../env.server', () => ({ earlyAccessServerEnv: {
  turnstileSecret: '1x0000000000000000000000000000000AA',
  turnstileHostname: 'localhost'
} }))

import { verifyEarlyAccessChallenge } from './turnstile.validation'

afterEach(() => vi.unstubAllGlobals())

describe('Turnstile verification', () => {
  it('requires matching success, hostname and action', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, hostname: 'localhost', action: 'test' }) })
    vi.stubGlobal('fetch', fetch)
    expect(await verifyEarlyAccessChallenge('token')).toBe(true)
    const request = fetch.mock.calls[0][1]
    expect(request.body).toContain('token')
    expect(request.body).toContain('1x0000000000000000000000000000000AA')
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, hostname: 'evil.example', action: 'test' }) })
    expect(await verifyEarlyAccessChallenge('token')).toBe(false)
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, hostname: 'localhost', action: 'other' }) })
    expect(await verifyEarlyAccessChallenge('token')).toBe(false)
  })

  it('rejects replay, oversized tokens and verification outages', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: false, 'error-codes': ['timeout-or-duplicate'] }) })
    vi.stubGlobal('fetch', fetch)
    expect(await verifyEarlyAccessChallenge('token')).toBe(false)
    expect(await verifyEarlyAccessChallenge('x'.repeat(2049))).toBe(false)
    expect(fetch).toHaveBeenCalledTimes(1)
    fetch.mockRejectedValueOnce(new Error('offline'))
    expect(await verifyEarlyAccessChallenge('token')).toBe(false)
    fetch.mockResolvedValueOnce({ ok: false })
    expect(await verifyEarlyAccessChallenge('token')).toBe(false)
    expect(await verifyEarlyAccessChallenge('')).toBe(false)
  })

  it('does not send a challenge to an untrusted verifier endpoint', async () => {
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    vi.stubEnv('TURNSTILE_VERIFY_URL', 'http://evil.example/siteverify')
    vi.stubEnv('EARLY_ACCESS_MODE', 'test')
    expect(await verifyEarlyAccessChallenge('token')).toBe(false)
    expect(fetch).not.toHaveBeenCalled()
    vi.unstubAllEnvs()
  })
})
