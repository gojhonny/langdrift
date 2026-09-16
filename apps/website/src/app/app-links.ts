function normalizeBase(value: string | undefined) {
  return value?.replace(/\/+$/, '') ?? ''
}

const ssoBase = normalizeBase(process.env.NEXT_PUBLIC_SSO_URL)

export const websiteLinks = {
  signIn: `${ssoBase}/sign-in`,
  signUp: `${ssoBase}/sign-up`
}
