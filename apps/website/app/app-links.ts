import { websiteEnv } from '@environment/client'

export const websiteLinks = {
  docs: websiteEnv.docsUrl,
  signIn: `${websiteEnv.ssoUrl}/sign-in`,
  signUp: `${websiteEnv.ssoUrl}/sign-up`
}
