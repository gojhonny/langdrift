import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../env.server', () => ({ earlyAccessServerEnv: { serviceUrl: 'https://example.invalid', apiKey: 'test-key' } }))
vi.mock('./turnstile.validation', () => ({ verifyEarlyAccessChallenge: vi.fn() }))
vi.mock('axios', () => ({ default: { post: vi.fn() } }))

import axios from 'axios'
import { submitEarlyAccess } from './form.action'
import { verifyEarlyAccessChallenge } from './turnstile.validation'

const input = { email: 'a@example.com', locale: 'en', source: 'landing', turnstileToken: 'token' }
beforeEach(() => vi.clearAllMocks())

describe('server submission', () => {
  it('blocks invalid challenges before Go and strips the token from the payload', async () => {
    vi.mocked(verifyEarlyAccessChallenge).mockResolvedValueOnce(false).mockResolvedValueOnce(true)
    expect(await submitEarlyAccess(input)).toEqual({ ok: false, code: 'CHALLENGE_FAILED' })
    expect(axios.post).not.toHaveBeenCalled()
    vi.mocked(axios.post).mockResolvedValueOnce({ status: 202 })
    expect(await submitEarlyAccess(input)).toEqual({ ok: true })
    expect(axios.post).toHaveBeenCalledWith('https://example.invalid/v1/emails',
      { email: input.email, locale: input.locale, source: input.source }, expect.objectContaining({ timeout: 4000, maxRedirects: 0 }))
  })

  it('handles validation and broker failures without exposing provider detail', async () => {
    expect(await submitEarlyAccess({ ...input, email: 'bad' })).toMatchObject({ ok: false, code: 'VALIDATION_ERROR' })
    vi.mocked(verifyEarlyAccessChallenge).mockResolvedValue(true)
    vi.mocked(axios.post).mockRejectedValue(new Error('internal detail'))
    expect(await submitEarlyAccess(input)).toEqual({ ok: false, code: 'UNAVAILABLE' })
  })

  it('rejects malformed token before verification', async () => {
    expect(await submitEarlyAccess({ ...input, turnstileToken: 'x'.repeat(2049) })).toEqual({ ok: false, code: 'CHALLENGE_FAILED' })
    expect(await submitEarlyAccess({ email: input.email, locale: input.locale, source: input.source })).toEqual({ ok: false, code: 'CHALLENGE_FAILED' })
    expect(await submitEarlyAccess({ ...input, turnstileToken: null })).toEqual({ ok: false, code: 'CHALLENGE_FAILED' })
    expect(verifyEarlyAccessChallenge).not.toHaveBeenCalled()
  })

  it('does not accept a non-202 response', async () => {
    vi.mocked(verifyEarlyAccessChallenge).mockResolvedValue(true)
    vi.mocked(axios.post).mockResolvedValue({ status: 200 })
    expect(await submitEarlyAccess(input)).toEqual({ ok: false, code: 'UNAVAILABLE' })
  })
})
