import {
  docsRouteSlug,
  type LangdriftLocale
} from '@repo/react/ui/language-switcher'

import { websiteEnv } from '../env'

export const websiteLinks = {
  docs: websiteEnv.docsUrl,
  signIn: `${websiteEnv.ssoUrl}/sign-in`,
  signUp: `${websiteEnv.ssoUrl}/sign-up`
}

export function docsUrlForLocale(locale: LangdriftLocale) {
  return `${websiteEnv.docsUrl}/${docsRouteSlug(locale)}`
}
