import 'server-only'

function required(name: string, value: string | undefined): string {
  if (!value?.trim())
    throw new Error(`Missing required environment variable: ${name}`)
  return value
}
const serviceUrl = new URL(
  required('EMAIL_SERVICE_URL', process.env.EMAIL_SERVICE_URL)
)
const mode = required('EARLY_ACCESS_MODE', process.env.EARLY_ACCESS_MODE)
const turnstileSecret = required(
  'TURNSTILE_SECRET_KEY',
  process.env.TURNSTILE_SECRET_KEY
)
const turnstileSiteKey = required(
  'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
)
const turnstileHostname = required(
  'TURNSTILE_EXPECTED_HOSTNAME',
  process.env.TURNSTILE_EXPECTED_HOSTNAME
)
if (!['development', 'test', 'production'].includes(mode))
  throw new Error('Invalid EARLY_ACCESS_MODE')
if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?$/.test(turnstileHostname)) {
  throw new Error(
    'TURNSTILE_EXPECTED_HOSTNAME must be a hostname without a scheme, port or path'
  )
}
const turnstileVerifyUrl = required(
  'TURNSTILE_VERIFY_URL',
  process.env.TURNSTILE_VERIFY_URL
)
if (
  mode === 'production' &&
  (/^[123]x0{20}/.test(turnstileSecret) ||
    /^[123]x0{18}/.test(turnstileSiteKey))
)
  throw new Error('Production requires real Turnstile credentials')
if (
  !['http:', 'https:'].includes(serviceUrl.protocol) ||
  serviceUrl.username ||
  serviceUrl.password ||
  serviceUrl.pathname !== '/' ||
  serviceUrl.search ||
  serviceUrl.hash ||
  (serviceUrl.protocol !== 'https:' &&
    (mode === 'production' ||
      !['localhost', '127.0.0.1', 'email-store'].includes(serviceUrl.hostname)))
)
  throw new Error(
    'EMAIL_SERVICE_URL must be an HTTPS origin (HTTP is allowed for local development)'
  )

export const earlyAccessServerEnv = {
  mode,
  serviceUrl: serviceUrl.origin,
  apiKey: required('EMAIL_SERVICE_API_KEY', process.env.EMAIL_SERVICE_API_KEY),
  turnstileSecret,
  turnstileHostname,
  turnstileVerifyUrl
}
