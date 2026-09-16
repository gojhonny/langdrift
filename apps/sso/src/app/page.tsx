'use client'

import { Brand } from '@repo/react/ui/brand'
import { BasicToast, GlowHoverCard } from '@repo/react/vendors/smoothui'
import { useAtom, useSetAtom } from 'jotai'
import type { FormEvent } from 'react'
import { useEffect } from 'react'

import {
  selectedPlanAtom,
  signInAttemptsAtom,
  themeAtom,
  toastAtom
} from '../state'
import { StateLogger } from './state-logger'

const plans = [
  {
    id: 'team',
    name: 'Team',
    eyebrow: 'Focused product view',
    details: 'Vision, Drift, decisions, evidence, and team attribution.'
  },
  {
    id: 'executive',
    name: 'Executive',
    eyebrow: 'Leadership view + Voice',
    details: 'Cross-team evolution, reports, and deterministic executive inquiry.'
  },
  {
    id: 'organization',
    name: 'Organization',
    eyebrow: 'Portfolio governance',
    details: 'Multiple products, SSO, role controls, and deeper evidence retention.'
  }
]

export default function SsoPage() {
  const [theme, setTheme] = useAtom(themeAtom)
  const [selectedPlan, setSelectedPlan] = useAtom(selectedPlanAtom)
  const [toast, setToast] = useAtom(toastAtom)
  const incrementAttempts = useSetAtom(signInAttemptsAtom)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
  }, [theme])

  function notify(message: string) {
    setToast({ message, open: true })
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    incrementAttempts((current) => current + 1)
    notify('SSO handoff prepared. Authentication wiring remains backend-owned.')
  }

  return (
    <main className="sso-shell">
      <StateLogger />
      <header className="sso-header">
        <a aria-label="LangDrift website" href="http://localhost:3000">
          <Brand compact tone={theme === 'dark' ? 'dark' : 'light'} />
        </a>
        <button
          onClick={() => {
            const next = theme === 'light' ? 'dark' : 'light'
            setTheme(next)
            notify(`${next === 'dark' ? 'Dark' : 'Light'} theme enabled`)
          }}
          type="button"
        >
          Theme · {theme}
        </button>
      </header>

      <section className="sso-grid">
        <div className="auth-column">
          <span className="sso-kicker">Workspace access</span>
          <h1>Continue to LangDrift.</h1>
          <p>
            Sign in with your work identity. The selected workspace plan is shown
            before the authentication handoff.
          </p>
          <form onSubmit={submit}>
            <label>
              Work email
              <input name="email" placeholder="you@company.com" required type="email" />
            </label>
            <button className="sso-primary" type="submit">
              Continue with SSO
            </button>
          </form>
          <button
            className="sso-secondary"
            onClick={() => notify('Magic link flow selected')}
            type="button"
          >
            Use a magic link instead
          </button>
        </div>

        <div className="plan-column">
          <div className="plan-heading">
            <span className="sso-kicker">Plans</span>
            <h2>Choose the visibility layer your organization needs.</h2>
          </div>
          <div className="plan-stack">
            {plans.map((plan) => (
              <GlowHoverCard key={plan.id} selected={selectedPlan === plan.id}>
                <button
                  className="plan-card-button"
                  onClick={() => {
                    setSelectedPlan(plan.id)
                    notify(`${plan.name} plan selected`)
                  }}
                  type="button"
                >
                  <span>{plan.eyebrow}</span>
                  <strong>{plan.name}</strong>
                  <p>{plan.details}</p>
                  <small>{selectedPlan === plan.id ? 'Selected ✓' : 'Select plan'}</small>
                </button>
              </GlowHoverCard>
            ))}
          </div>
        </div>
      </section>

      <BasicToast
        message={toast.message}
        onClose={() => setToast((current) => ({ ...current, open: false }))}
        open={toast.open}
        tone="info"
      />
    </main>
  )
}
