import { describe, expect, it } from 'vitest'
import { requireTurnstileVerifyUrl } from './turnstile-verify-url'

const cloudflare = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

describe('Turnstile verify URL', () => {
  it('throws when the variable is missing', () => {
    expect(() => requireTurnstileVerifyUrl(undefined, 'development')).toThrow(
      /TURNSTILE_VERIFY_URL/
    )
    expect(() => requireTurnstileVerifyUrl('   ', 'production')).toThrow(
      /TURNSTILE_VERIFY_URL/
    )
  })

  it('accepts the Cloudflare endpoint in development and production', () => {
    expect(requireTurnstileVerifyUrl(cloudflare, 'development')).toBe(
      cloudflare
    )
    expect(requireTurnstileVerifyUrl(cloudflare, 'production')).toBe(cloudflare)
  })

  it('rejects every other URL outside test mode', () => {
    expect(() =>
      requireTurnstileVerifyUrl(
        'http://127.0.0.1:18082/siteverify',
        'production'
      )
    ).toThrow(/Cloudflare/)
    expect(() =>
      requireTurnstileVerifyUrl(
        'https://evil.example/siteverify',
        'development'
      )
    ).toThrow(/Cloudflare/)
    expect(() => requireTurnstileVerifyUrl(cloudflare, 'staging')).toThrow(
      /EARLY_ACCESS_MODE/
    )
  })

  it('accepts only a loopback siteverify URL in test mode', () => {
    expect(
      requireTurnstileVerifyUrl('http://127.0.0.1:18082/siteverify', 'test')
    ).toBe('http://127.0.0.1:18082/siteverify')
    expect(
      requireTurnstileVerifyUrl('http://localhost:18082/siteverify', 'test')
    ).toBe('http://localhost:18082/siteverify')
    expect(() =>
      requireTurnstileVerifyUrl('http://evil.example/siteverify', 'test')
    ).toThrow(/loopback/)
    expect(() =>
      requireTurnstileVerifyUrl('http://127.0.0.1:18082/siteverify?x=1', 'test')
    ).toThrow(/loopback/)
    expect(() =>
      requireTurnstileVerifyUrl(
        'http://user:pass@127.0.0.1:18082/siteverify',
        'test'
      )
    ).toThrow(/loopback/)
    expect(() =>
      requireTurnstileVerifyUrl(
        'http://127.0.0.1:18082/siteverify#fragment',
        'test'
      )
    ).toThrow(/loopback/)
    expect(() => requireTurnstileVerifyUrl('not a url', 'test')).toThrow(
      /absolute URL/
    )
  })
})
