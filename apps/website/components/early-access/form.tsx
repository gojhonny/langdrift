'use client'

import { produce } from 'immer'
import Script from 'next/script'
import { useEffect, useId, useRef, useState } from 'react'

import { websiteEnv } from '@environment/client'
import type { WebsiteLocale } from '@i18n/routing'
import type { EarlyAccessMessages } from '@messages/early-access'

import {
  handleEmailBlur,
  handleEmailChange,
  handleFormSubmit
} from './form.handlers'
import type { EarlyAccessFormState, StateUpdater } from './form.types'
import { createEarlyAccessFormState } from './form-state.data'

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string
          action: string
          callback: (token: string) => void
          'expired-callback': () => void
          'error-callback': () => void
        }
      ) => string
      reset: (id: string) => void
    }
  }
}

export function EarlyAccessForm({
  copy,
  helperId,
  locale,
  source
}: {
  copy: EarlyAccessMessages
  helperId: string
  locale: WebsiteLocale
  source: 'landing' | 'pricing'
}) {
  const [formState, setFormState] = useState(createEarlyAccessFormState)
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    setHydrated(true)
  }, [])
  const inputRef = useRef<HTMLInputElement>(null)
  const submitting = useRef(false)
  const challenge = useRef('')
  const challengeWidget = useRef<string | null>(null)
  const challengeElement = useRef<HTMLDivElement>(null)
  const instanceId = useId()
  const emailId = `${instanceId}-email`
  const errorId = `${instanceId}-error`
  const statusId = `${instanceId}-status`
  const emailError = formState.fieldErrors.email
  const update: StateUpdater<EarlyAccessFormState> = (recipe) => {
    setFormState(produce<EarlyAccessFormState>(recipe))
  }

  function resetChallenge() {
    challenge.current = ''
    if (challengeWidget.current)
      window.turnstile?.reset(challengeWidget.current)
  }

  return (
    <form
      className="early-access-form"
      noValidate
      aria-busy={formState.status === 'submitting'}
      onSubmit={(event) => {
        event.preventDefault()
        if (submitting.current) return
        if (!challenge.current) {
          update((draft) => {
            draft.status = 'challenge-error'
          })
          return
        }
        submitting.current = true
        void handleFormSubmit(
          inputRef.current?.value ?? '',
          update,
          () => {
            inputRef.current?.focus()
          },
          locale,
          source,
          challenge.current
        ).finally(() => {
          submitting.current = false
          resetChallenge()
        })
      }}
    >
      <label htmlFor={emailId}>{copy.emailLabel}</label>
      <div className="early-access-controls">
        <input
          ref={inputRef}
          id={emailId}
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          disabled={formState.status === 'submitting'}
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
        <button
          type="submit"
          disabled={!hydrated || formState.status === 'submitting'}
        >
          {formState.status === 'submitting' ? copy.submitting : copy.submit}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      <fieldset className="early-access-challenge">
        <legend>{copy.challengeLabel}</legend>
        <div ref={challengeElement} />
      </fieldset>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => {
          if (
            !challengeElement.current ||
            !window.turnstile ||
            challengeWidget.current
          )
            return
          challengeWidget.current = window.turnstile.render(
            challengeElement.current,
            {
              sitekey: websiteEnv.turnstileSiteKey,
              action: 'early-access',
              callback: (token) => {
                challenge.current = token
              },
              'expired-callback': () => {
                challenge.current = ''
              },
              'error-callback': () => {
                challenge.current = ''
              }
            }
          )
        }}
      />
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
          {formState.status === 'success'
            ? copy.success
            : formState.status === 'challenge-error'
              ? copy.challengeFailed
              : formState.status === 'error' && !emailError
                ? copy.unavailable
                : ''}
        </p>
      </div>
    </form>
  )
}
