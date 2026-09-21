function requireOrigin(name: string, value: string | undefined) {
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value.replace(/\/+$/, '')
}

export const ssoLinks = {
  dashboard: requireOrigin(
    'NEXT_PUBLIC_DASHBOARD_URL',
    process.env.NEXT_PUBLIC_DASHBOARD_URL
  ),
  website: requireOrigin(
    'NEXT_PUBLIC_WEBSITE_URL',
    process.env.NEXT_PUBLIC_WEBSITE_URL
  )
}
