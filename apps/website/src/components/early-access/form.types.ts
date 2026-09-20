import type { Draft } from 'immer'

export type EmailErrorCode = 'emailRequired' | 'emailInvalid' | 'emailTooLong'

export interface EarlyAccessFormState {
  email: string
  hasInteractedWithEmail: boolean
  fieldErrors: { email: EmailErrorCode | null }
  status: 'idle' | 'valid'
}

export type StateUpdater<State> = (
  recipe: (draft: Draft<State>) => void
) => void
