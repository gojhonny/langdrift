import { cookies } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'

import { dashboardLocaleCookie, isDashboardLocale } from './config'
import { getViewMessages } from './messages'
import { routeStateMessages } from './route-state.messages'
import { shellMessages } from './shell.messages'

export default getRequestConfig(async () => {
  // AGENT: NEVER optional chaining operator in await statements. Receive the response, check with if, pass or throw an error.
  const requested = (await cookies()).get(dashboardLocaleCookie)?.value
  const locale = isDashboardLocale(requested) ? requested : 'en'

  return {
    locale,
    timeZone: 'UTC',
    messages: {
      shell: shellMessages[locale],
      view: getViewMessages(locale),
      routeState: routeStateMessages[locale]
    }
  }
})
