import type { Draft } from 'immer'

export type EmailErrorCode = 'emailRequired' | 'emailInvalid' | 'emailTooLong'

export interface EarlyAccessFormState {
  email: string
  hasInteractedWithEmail: boolean
  fieldErrors: { email: EmailErrorCode | null }
  status: 'idle' | 'submitting' | 'success' | 'error'
}

export type StateUpdater<State> = (
  recipe: (draft: Draft<State>) => void
) => void

export type EarlyAccessActionResult =
  | { ok: true }
  | { ok: false; code: 'VALIDATION_ERROR'; fieldErrors?: { email?: string } }
  | { ok: false; code: 'UNAVAILABLE' }
