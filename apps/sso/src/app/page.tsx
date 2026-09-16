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
    id: 'plan-01',
    name: 'Plan 01',
    eyebrow: 'Commercial configuration · TBD',
    details: 'Name, pricing, limits, and exact entitlements remain open.',
    dimensions: ['Teams · TBD', 'People · TBD', 'Products · TBD', 'Voice access · TBD']
  },
  {
    id: 'plan-02',
    name: 'Plan 02',
    eyebrow: 'Commercial configuration · TBD',
    details: 'This card previews plan structure without inventing commercial rules.',
    dimensions: ['Teams · TBD', 'People · TBD', 'Products · TBD', 'Voice access · TBD']
  },
  {
    id: 'plan-03',
    name: 'Plan 03',
    eyebrow: 'Commercial configuration · TBD',
    details: 'Pricing will define final packaging and role-scoped Voice access.',
    dimensions: ['Teams · TBD', 'People · TBD', 'Products · TBD', 'Voice access · TBD']
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
    notify('Account-flow preview advanced. Authentication provider remains an open architecture decision.')
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
          <span className="sso-kicker">Account access</span>
          <h1>Continue to LangDrift.</h1>
          <p>
            This frontend demonstrates the acquisition and organization-entry surface.
            The authentication provider and exact sign-in method are intentionally not fixed here.
          </p>
          <form onSubmit={submit}>
            <label>
              Work identity
              <input
                aria-describedby="auth-method-note"
                name="identity"
                placeholder="you@company.com"
                required
                type="email"
              />
            </label>
            <button className="sso-primary" type="submit">
              Continue
            </button>
          </form>
          <small id="auth-method-note">
            Auth methods such as password, magic link, Google, GitHub, or enterprise SSO remain open decisions.
          </small>
          <button
            className="sso-secondary"
            onClick={() => notify('Organization setup preview selected: tenant + initial Owner + first product/project.')}
            type="button"
          >
            Preview organization setup
          </button>
        </div>

        <div className="plan-column">
          <div className="plan-heading">
            <span className="sso-kicker">Plans</span>
            <h2>Preview the commercial structure without inventing the commercial rules.</h2>
            <p>
              Final plan names, prices, limits, and Voice entitlements are intentionally left for Pricing.
            </p>
          </div>
          <div className="plan-stack">
            {plans.map((plan) => (
              <GlowHoverCard key={plan.id} selected={selectedPlan === plan.id}>
                <button
                  className="plan-card-button"
                  onClick={() => {
                    setSelectedPlan(plan.id)
                    notify(`${plan.name} structure preview selected`)
                  }}
                  type="button"
                >
                  <span>{plan.eyebrow}</span>
                  <strong>{plan.name}</strong>
                  <p>{plan.details}</p>
                  <ul>
                    {plan.dimensions.map((dimension) => (
                      <li key={dimension}>{dimension}</li>
                    ))}
                  </ul>
                  <small>{selectedPlan === plan.id ? 'Preview selected ✓' : 'Select preview'}</small>
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
