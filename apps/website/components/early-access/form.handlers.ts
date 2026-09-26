import type { WebsiteLocale } from '@i18n/routing'

import { submitEarlyAccess } from './form.action'
import {
  mapEmailBlur,
  mapEmailChange,
  mapValidationFailed,
  mapValidationPassed
} from './form.mappers'
import type { EarlyAccessFormState, StateUpdater } from './form.types'
import { earlyAccessFormSchema, getEmailError } from './form.validation'

export function handleEmailChange(
  email: string,
  hasInteractedWithEmail: boolean,
  update: StateUpdater<EarlyAccessFormState>
): void {
  const error = hasInteractedWithEmail ? getEmailError(email) : null
  update((draft) => {
    mapEmailChange(draft, email, error)
  })
}

export function handleEmailBlur(
  email: string,
  update: StateUpdater<EarlyAccessFormState>
): void {
  const error = getEmailError(email)
  update((draft) => {
    mapEmailBlur(draft, error)
  })
}

export async function handleFormSubmit(
  email: string,
  update: StateUpdater<EarlyAccessFormState>,
  focusEmail: () => void,
  locale: WebsiteLocale,
  source: 'landing' | 'pricing',
  turnstileToken: string
): Promise<void> {
  const result = earlyAccessFormSchema.safeParse({ email })
  if (!result.success) {
    const error = getEmailError(email) ?? 'emailInvalid'
    update((draft) => {
      mapValidationFailed(draft, error)
    })
    focusEmail()
    return
  }

  update((draft) => {
    mapValidationPassed(draft, result.data.email)
  })

  try {
    const response = await submitEarlyAccess({
      ...result.data,
      locale,
      source,
      turnstileToken
    })
    update((draft) => {
      draft.status = response.ok
        ? 'success'
        : response.code === 'CHALLENGE_FAILED'
          ? 'challenge-error'
          : 'error'
      if (response.ok) draft.email = ''
      if (!response.ok && response.code === 'VALIDATION_ERROR') {
        const error = response.fieldErrors?.email
        draft.fieldErrors.email =
          error === 'emailRequired' || error === 'emailTooLong'
            ? error
            : 'emailInvalid'
      }
    })
  } catch {
    update((draft) => {
      draft.status = 'error'
    })
  }
}
