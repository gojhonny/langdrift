import 'server-only'

function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}
const serviceUrl = new URL(
  required('EMAIL_SERVICE_URL', process.env.EMAIL_SERVICE_URL)
)
if (
  !['http:', 'https:'].includes(serviceUrl.protocol) ||
  serviceUrl.username ||
  serviceUrl.password ||
  serviceUrl.pathname !== '/' ||
  serviceUrl.search ||
  serviceUrl.hash ||
  (serviceUrl.protocol !== 'https:' &&
    !['localhost', '127.0.0.1', 'email-store'].includes(serviceUrl.hostname))
)
  throw new Error(
    'EMAIL_SERVICE_URL must be an HTTPS origin (HTTP is allowed for local development)'
  )

export const earlyAccessServerEnv = {
  serviceUrl: serviceUrl.origin,
  apiKey: required('EMAIL_SERVICE_API_KEY', process.env.EMAIL_SERVICE_API_KEY)
}
