import 'server-only'

import { earlyAccessServerEnv } from '../../env.server'

interface SiteverifyResult {
  success: boolean
  hostname?: string
  action?: string
}

export async function verifyEarlyAccessChallenge(token: string): Promise<boolean> {
  if (!token || token.length > 2048) return false
  try {
    const configured = process.env.TURNSTILE_VERIFY_URL
    const testEndpoint = configured ? new URL(configured) : null
    if (testEndpoint && (process.env.EARLY_ACCESS_MODE !== 'test' || testEndpoint.protocol !== 'http:' || !['localhost', '127.0.0.1'].includes(testEndpoint.hostname) || testEndpoint.pathname !== '/siteverify' || testEndpoint.username || testEndpoint.password || testEndpoint.search || testEndpoint.hash)) return false
    const response = await fetch(testEndpoint?.toString() ?? 'https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: earlyAccessServerEnv.turnstileSecret, response: token }),
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(2500)
    })
    if (!response.ok) return false
    const result = (await response.json()) as SiteverifyResult
    const action = earlyAccessServerEnv.turnstileSecret.startsWith('1x0000000000000000000000000000000')
      ? 'test'
      : 'early-access'
    return result.success === true && result.hostname === earlyAccessServerEnv.turnstileHostname && result.action === action
  } catch {
    return false
  }
}
