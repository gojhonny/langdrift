function normalizeBase(value: string | undefined) {
  return value?.replace(/\/+$/, '') ?? ''
}

const websiteBase = normalizeBase(process.env.NEXT_PUBLIC_WEBSITE_URL)
const consoleBase = normalizeBase(process.env.NEXT_PUBLIC_CONSOLE_URL)

export const ssoLinks = {
  console: consoleBase || '/',
  website: websiteBase || '/'
}
