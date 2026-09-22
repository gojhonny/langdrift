import { produce } from 'immer'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createEarlyAccessFormState } from './form-state.data'
import type { EarlyAccessActionResult, EarlyAccessFormState, StateUpdater } from './form.types'

vi.mock('./form.action', () => ({ submitEarlyAccess: vi.fn() }))

import { submitEarlyAccess } from './form.action'
import { handleEmailBlur, handleEmailChange, handleFormSubmit } from './form.handlers'

let state: EarlyAccessFormState
const update: StateUpdater<EarlyAccessFormState> = (recipe) => { state = produce(state, recipe) }

beforeEach(() => {
  state = createEarlyAccessFormState()
  vi.clearAllMocks()
})

describe('form transitions', () => {
  it('validates on blur and on changes after interaction', () => {
    handleEmailChange('bad', false, update)
    expect(state.fieldErrors.email).toBeNull()
    handleEmailBlur('bad', update)
    expect(state.fieldErrors.email).toBe('emailInvalid')
    handleEmailChange('a@example.com', true, update)
    expect(state.fieldErrors.email).toBeNull()
    expect(state.status).toBe('idle')
  })

  it('focuses invalid email and does not call the server', async () => {
    const focus = vi.fn()
    await handleFormSubmit('bad', update, focus, 'en', 'landing', 'token')
    expect(focus).toHaveBeenCalledOnce()
    expect(state.fieldErrors.email).toBe('emailInvalid')
    expect(submitEarlyAccess).not.toHaveBeenCalled()
  })

  it.each([
    [{ ok: true }, 'success', ''],
    [{ ok: false, code: 'CHALLENGE_FAILED' }, 'challenge-error', 'a@example.com'],
    [{ ok: false, code: 'UNAVAILABLE' }, 'error', 'a@example.com'],
    [{ ok: false, code: 'VALIDATION_ERROR', fieldErrors: { email: 'emailTooLong' } }, 'error', 'a@example.com'],
    [{ ok: false, code: 'VALIDATION_ERROR', fieldErrors: { email: 'bogus' } }, 'error', 'a@example.com']
  ] as const)('maps server result %j to %s', async (response, status, email) => {
    vi.mocked(submitEarlyAccess).mockResolvedValue(response as EarlyAccessActionResult)
    await handleFormSubmit(' a@example.com ', update, vi.fn(), 'en', 'pricing', 'token')
    expect(state.status).toBe(status)
    expect(state.email).toBe(email)
    expect(submitEarlyAccess).toHaveBeenCalledWith({ email: 'a@example.com', locale: 'en', source: 'pricing', turnstileToken: 'token' })
    if (!response.ok && response.code === 'VALIDATION_ERROR') {
      expect(state.fieldErrors.email).toBe(response.fieldErrors.email === 'emailTooLong' ? 'emailTooLong' : 'emailInvalid')
    }
  })

  it('recovers from an unexpected action rejection', async () => {
    vi.mocked(submitEarlyAccess).mockRejectedValue(new Error('offline'))
    await handleFormSubmit('a@example.com', update, vi.fn(), 'en', 'landing', 'token')
    expect(state.status).toBe('error')
  })
})
