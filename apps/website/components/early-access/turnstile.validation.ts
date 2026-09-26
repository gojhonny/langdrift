import 'server-only'

import { earlyAccessServerEnv } from '@environment/server'

interface SiteverifyResult {
  success: boolean
  hostname?: string
  action?: string
}

export async function verifyEarlyAccessChallenge(
  token: string
): Promise<boolean> {
  if (!token || token.length > 2048) return false
  try {
    const response = await fetch(earlyAccessServerEnv.turnstileVerifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: earlyAccessServerEnv.turnstileSecret,
        response: token
      }),
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(2500)
    })
    if (!response.ok) return false
    const result = (await response.json()) as SiteverifyResult
    const action = earlyAccessServerEnv.turnstileSecret.startsWith(
      '1x0000000000000000000000000000000'
    )
      ? 'test'
      : 'early-access'
    return (
      result.success === true &&
      result.hostname === earlyAccessServerEnv.turnstileHostname &&
      result.action === action
    )
  } catch {
    return false
  }
}
