'use client'

import { produce } from 'immer'
import { useId, useRef, useState } from 'react'
import type { EarlyAccessMessages } from '../../messages/early-access'
import { createEarlyAccessFormState } from './form-state.data'
import {
  handleEmailBlur,
  handleEmailChange,
  handleFormSubmit
} from './form.handlers'
import type { EarlyAccessFormState, StateUpdater } from './form.types'

export function EarlyAccessForm({
  copy,
  helperId
}: {
  copy: EarlyAccessMessages
  helperId: string
}) {
  const [formState, setFormState] = useState(createEarlyAccessFormState)
  const inputRef = useRef<HTMLInputElement>(null)
  const instanceId = useId()
  const emailId = `${instanceId}-email`
  const errorId = `${instanceId}-error`
  const statusId = `${instanceId}-status`
  const emailError = formState.fieldErrors.email
  const update: StateUpdater<EarlyAccessFormState> = (recipe) => {
    setFormState(produce<EarlyAccessFormState>(recipe))
  }

  return (
    <form
      className="early-access-form"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        handleFormSubmit(inputRef.current?.value ?? '', update, () => {
          inputRef.current?.focus()
        })
      }}
    >
      <label htmlFor={emailId}>{copy.emailLabel}</label>
      <div className="early-access-controls">
        <input
          ref={inputRef}
          id={emailId}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          required
          value={formState.email}
          placeholder={copy.placeholder}
          aria-describedby={`${helperId}${emailError ? ` ${errorId}` : ''}`}
          aria-invalid={emailError !== null}
          onChange={(event) => {
            handleEmailChange(
              event.currentTarget.value,
              formState.hasInteractedWithEmail,
              update
            )
          }}
          onBlur={(event) => {
            handleEmailBlur(event.currentTarget.value, update)
          }}
        />
        <button type="submit">
          {copy.submit}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      <div
        className="early-access-feedback"
        aria-live="polite"
        aria-atomic="true"
      >
        {emailError ? (
          <p id={errorId} className="early-access-field-error">
            {copy.errors[emailError]}
          </p>
        ) : null}
        <p id={statusId} className="early-access-valid-status">
          {formState.status === 'valid' ? copy.addressValid : ''}
        </p>
      </div>
    </form>
  )
}
