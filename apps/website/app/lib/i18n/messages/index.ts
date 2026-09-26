import type { WebsiteLocale } from '@i18n/routing'

import { demoMessages } from './demo'
import { headerMessages } from './header'
import { homeMessages } from './home'

export function getWebsiteMessages(locale: WebsiteLocale) {
  return {
    home: homeMessages[locale],
    header: headerMessages[locale],
    demo: demoMessages[locale]
  }
}
