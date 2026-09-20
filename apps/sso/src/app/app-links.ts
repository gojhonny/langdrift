function normalizeBase(value: string | undefined) {
  return value?.replace(/\/+$/, '') ?? ''
}

const websiteBase = normalizeBase(process.env.NEXT_PUBLIC_WEBSITE_URL)
const dashboardBase = normalizeBase(process.env.NEXT_PUBLIC_DASHBOARD_URL)

export const ssoLinks = {
  dashboard: dashboardBase || '/',
  website: websiteBase || '/'
}
