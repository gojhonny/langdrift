const cloudflareSiteverify =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export function requireTurnstileVerifyUrl(
  value: string | undefined,
  mode: string
): string {
  const configured = value?.trim()
  if (!configured)
    throw new Error(
      'Missing required environment variable: TURNSTILE_VERIFY_URL'
    )
  if (mode === 'production' || mode === 'development') {
    if (configured !== cloudflareSiteverify) {
      throw new Error(
        'TURNSTILE_VERIFY_URL must be the Cloudflare siteverify endpoint'
      )
    }
    return configured
  }
  if (mode !== 'test') throw new Error('Invalid EARLY_ACCESS_MODE')
  let url: URL
  try {
    url = new URL(configured)
  } catch {
    throw new Error('TURNSTILE_VERIFY_URL must be an absolute URL')
  }
  if (
    url.protocol !== 'http:' ||
    !['localhost', '127.0.0.1'].includes(url.hostname) ||
    url.pathname !== '/siteverify' ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      'TURNSTILE_VERIFY_URL in test mode must be a loopback /siteverify URL'
    )
  }
  return url.toString()
}
