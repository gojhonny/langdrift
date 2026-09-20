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

export function handleFormSubmit(
  email: string,
  update: StateUpdater<EarlyAccessFormState>,
  focusEmail: () => void
): void {
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
}
