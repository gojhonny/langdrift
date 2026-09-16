'use client'

import { Brand } from '@repo/react/ui/brand'
import { BasicToast, GlowHoverCard } from '@repo/react/vendors/smoothui'
import { useAtom, useSetAtom } from 'jotai'
import type { FormEvent } from 'react'
import { useEffect } from 'react'

import {
  accountEmailAtom,
  organizationNameAtom,
  selectedPlanAtom,
  setupStepAtom,
  signInAttemptsAtom,
  themeAtom,
  toastAtom
} from '../state'
import { StateLogger } from './state-logger'

export type AccountFlowStep =
  | 'create-organization'
  | 'select-plan'
  | 'setup'
  | 'sign-in'
  | 'sign-up'

const plans = [
  {
    id: 'plan-01',
    label: 'Plan 01',
    note: 'Teams · People · Products · Voice · History · Integrations remain TBD.'
  },
  {
    id: 'plan-02',
    label: 'Plan 02',
    note: 'Commercial packaging remains an open Pricing decision.'
  },
  {
    id: 'plan-03',
    label: 'Plan 03',
    note: 'No price, limits, billing cadence, or entitlement is implied.'
  }
]

const flowLinks = [
  ['/sign-up', 'Account'],
  ['/create-organization', 'Organization'],
  ['/select-plan', 'Plan'],
  ['/setup', 'Setup']
] as const

export function AccountFlow({ step }: { step: AccountFlowStep }) {
  const [theme, setTheme] = useAtom(themeAtom)
  const [email, setEmail] = useAtom(accountEmailAtom)
  const [organization, setOrganization] = useAtom(organizationNameAtom)
  const [selectedPlan, setSelectedPlan] = useAtom(selectedPlanAtom)
  const [toast, setToast] = useAtom(toastAtom)
  const setSetupStep = useSetAtom(setupStepAtom)
  const incrementAttempts = useSetAtom(signInAttemptsAtom)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
  }, [theme])

  function notify(message: string) {
    setToast({ message, open: true })
  }

  function submitIdentity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    incrementAttempts((current) => current + 1)
    setSetupStep('account')
    notify('Identity step captured for this frontend preview. Auth provider remains open.')
  }

  function submitOrganization(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSetupStep('organization')
    notify('Organization preview created with the current user as initial Owner.')
  }

  const titles: Record<AccountFlowStep, [string, string]> = {
    'create-organization': ['Create your organization.', 'Establish the tenant and initial Owner before technical product setup.'],
    'select-plan': ['Choose the structure.', 'Preview plan dimensions without inventing prices, limits, billing cadence, or Voice entitlements.'],
    setup: ['Set up the first product.', 'Move from organization entry into product setup, invitation, and later developer integration.'],
    'sign-in': ['Sign in to LangDrift.', 'Use your work identity. The authentication provider and exact method remain open architecture decisions.'],
    'sign-up': ['Create your LangDrift account.', 'Capture only the minimum identity needed to begin organization setup.']
  }
  const [title, description] = titles[step]

  return (
    <main className="account-flow-shell">
      <StateLogger />
      <header className="sso-header">
        <a aria-label="LangDrift website" href="http://localhost:3000">
          <Brand compact tone={theme === 'dark' ? 'dark' : 'light'} />
        </a>
        <div className="account-flow-header-actions">
          <a href="/sign-in">Sign in</a>
          <button
            onClick={() => {
              const next = theme === 'light' ? 'dark' : 'light'
              setTheme(next)
              notify(`${next} theme enabled`)
            }}
            type="button"
          >
            Theme · {theme}
          </button>
        </div>
      </header>

      <nav aria-label="Account setup progress" className="account-flow-progress">
        {flowLinks.map(([href, label], index) => (
          <a href={href} key={href}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            {label}
          </a>
        ))}
      </nav>

      <section className="account-flow-card">
        <div className="account-flow-copy">
          <span className="sso-kicker">Account entry · frontend preview</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        {step === 'sign-in' || step === 'sign-up' ? (
          <form className="account-flow-form" onSubmit={submitIdentity}>
            <label>
              Work email
              <input
                onChange={(event) => setEmail(event.currentTarget.value)}
                placeholder="you@company.com"
                required
                type="email"
                value={email}
              />
            </label>
            <button className="sso-primary" type="submit">
              {step === 'sign-in' ? 'Continue' : 'Create account preview'}
            </button>
            <small>
              Password, magic link, Google, GitHub, and enterprise SSO are candidates only; none is selected here.
            </small>
            {step === 'sign-up' ? <a href="/create-organization">Continue to organization →</a> : null}
          </form>
        ) : null}

        {step === 'create-organization' ? (
          <form className="account-flow-form" onSubmit={submitOrganization}>
            <label>
              Organization name
              <input
                onChange={(event) => setOrganization(event.currentTarget.value)}
                placeholder="Acme"
                required
                value={organization}
              />
            </label>
            <label>
              Your role
              <select defaultValue="owner">
                <option value="owner">Owner / Founder</option>
                <option value="executive">Executive</option>
                <option value="other">Other</option>
              </select>
            </label>
            <button className="sso-primary" type="submit">Create organization preview</button>
            <a href="/select-plan">Continue to plan →</a>
          </form>
        ) : null}

        {step === 'select-plan' ? (
          <div className="account-plan-grid">
            {plans.map((plan) => (
              <GlowHoverCard key={plan.id} selected={selectedPlan === plan.id}>
                <button
                  className="account-plan-card"
                  onClick={() => {
                    setSelectedPlan(plan.id)
                    setSetupStep('plan')
                    notify(`${plan.label} preview selected`)
                  }}
                  type="button"
                >
                  <span>Commercial configuration · TBD</span>
                  <strong>{plan.label}</strong>
                  <p>{plan.note}</p>
                  <small>{selectedPlan === plan.id ? 'Selected ✓' : 'Select preview'}</small>
                </button>
              </GlowHoverCard>
            ))}
            <a className="account-flow-next" href="/setup">Continue to setup →</a>
          </div>
        ) : null}

        {step === 'setup' ? (
          <div className="setup-preview">
            <div>
              <span>Organization</span>
              <strong>{organization || 'Organization name · pending'}</strong>
            </div>
            <div>
              <span>Plan</span>
              <strong>{selectedPlan} · commercial details TBD</strong>
            </div>
            <label>
              First product
              <input placeholder="Atlas Home Hub" />
            </label>
            <div className="setup-actions">
              <button onClick={() => notify('Invite step skipped in preview')} type="button">Invite / skip</button>
              <button onClick={() => {
                setSetupStep('setup')
                notify('Developer setup is the next boundary; no backend integration is invented here.')
              }} type="button">Developer setup →</button>
            </div>
          </div>
        ) : null}
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
