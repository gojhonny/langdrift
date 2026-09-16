'use client'

import { Brand } from '@repo/react/ui/brand'
import { BasicToast, GlowHoverCard } from '@repo/react/vendors/smoothui'
import { useAtom, useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
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
import { ssoLinks } from './app-links'
import { StateLogger } from './state-logger'

export type AccountFlowStep =
  | 'create-organization'
  | 'select-plan'
  | 'setup'
  | 'sign-in'
  | 'sign-up'

const flowSteps = [
  { href: '/sign-up', id: 'sign-up', label: 'Account' },
  { href: '/create-organization', id: 'create-organization', label: 'Organization' },
  { href: '/select-plan', id: 'select-plan', label: 'Plan' },
  { href: '/setup', id: 'setup', label: 'Setup' }
] as const

function flowIndex(step: AccountFlowStep) {
  return flowSteps.findIndex((item) => item.id === step)
}

export function AccountFlow({ step }: { step: AccountFlowStep }) {
  const router = useRouter()
  const [theme, setTheme] = useAtom(themeAtom)
  const [email, setEmail] = useAtom(accountEmailAtom)
  const [organization, setOrganization] = useAtom(organizationNameAtom)
  const [selectedPlan, setSelectedPlan] = useAtom(selectedPlanAtom)
  const [toast, setToast] = useAtom(toastAtom)
  const setSetupStep = useSetAtom(setupStepAtom)
  const incrementAttempts = useSetAtom(signInAttemptsAtom)
  const currentIndex = flowIndex(step)

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

    if (step === 'sign-in') {
      window.location.assign(ssoLinks.console)
      return
    }

    setSetupStep('account')
    router.push('/create-organization')
  }

  function submitOrganization(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSetupStep('organization')
    router.push('/select-plan')
  }

  function continuePlan() {
    setSelectedPlan('packaging-pending')
    setSetupStep('plan')
    router.push('/setup')
  }

  const titles: Record<AccountFlowStep, [string, string]> = {
    'create-organization': [
      'Create your organization.',
      'Give your LangDrift workspace a home. You will be the initial Owner.'
    ],
    'select-plan': [
      'Choose how to start.',
      'Packaging is being finalized. Continue with the product setup without inventing commercial limits.'
    ],
    setup: [
      'Set up your first product.',
      'Name the product you want LangDrift to understand first. Integrations come after this step.'
    ],
    'sign-in': [
      'Sign in to LangDrift.',
      'Use your work identity to continue to your product workspace.'
    ],
    'sign-up': [
      'Create your LangDrift account.',
      'Start with your work identity. Organization setup comes next.'
    ]
  }
  const [title, description] = titles[step]

  return (
    <main className="account-flow-shell">
      <StateLogger />
      <header className="sso-header">
        <a aria-label="LangDrift website" href={ssoLinks.website}>
          <Brand compact tone={theme === 'dark' ? 'dark' : 'light'} />
        </a>
        <div className="account-flow-header-actions">
          <a href={step === 'sign-in' ? '/sign-up' : '/sign-in'}>
            {step === 'sign-in' ? 'Create account' : 'Sign in'}
          </a>
          <button
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
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

      {step !== 'sign-in' ? (
        <nav aria-label="Account setup progress" className="account-flow-progress">
          {flowSteps.map((item, index) => {
            const state = index < currentIndex ? 'completed' : index === currentIndex ? 'current' : 'future'
            const content = (
              <>
                <span>{state === 'completed' ? '✓' : String(index + 1).padStart(2, '0')}</span>
                {item.label}
              </>
            )

            if (state === 'future') {
              return <span className="account-flow-progress-step" data-state={state} key={item.href}>{content}</span>
            }

            return (
              <a
                aria-current={state === 'current' ? 'step' : undefined}
                className="account-flow-progress-step"
                data-state={state}
                href={item.href}
                key={item.href}
              >
                {content}
              </a>
            )
          })}
        </nav>
      ) : null}

      <section className="account-flow-card" data-step={step}>
        <div className="account-flow-copy">
          <span className="sso-kicker">{step === 'sign-in' ? 'Welcome back' : 'Account setup'}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        {step === 'sign-in' || step === 'sign-up' ? (
          <form className="account-flow-form" onSubmit={submitIdentity}>
            <label>
              Work email
              <input
                autoComplete="email"
                onChange={(event) => setEmail(event.currentTarget.value)}
                placeholder="you@company.com"
                required
                type="email"
                value={email}
              />
            </label>
            <button className="sso-primary" type="submit">
              {step === 'sign-in' ? 'Continue' : 'Create account'}
            </button>
            <small>
              Additional sign-in methods can appear here when authentication is configured.
            </small>
            {step === 'sign-in' ? <a href="/sign-up">Create account →</a> : null}
          </form>
        ) : null}

        {step === 'create-organization' ? (
          <form className="account-flow-form" onSubmit={submitOrganization}>
            <label>
              Organization name
              <input
                autoComplete="organization"
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
            <button className="sso-primary" type="submit">Create organization</button>
          </form>
        ) : null}

        {step === 'select-plan' ? (
          <div className="account-plan-grid">
            <GlowHoverCard selected>
              <div className="account-plan-card account-plan-card-neutral">
                <span>Packaging in progress</span>
                <strong>Start with LangDrift</strong>
                <p>
                  Final pricing and limits are not published yet. The commercial model will describe Teams,
                  People, Products, Voice access, History, and Integrations when it is ready.
                </p>
                <small>No price or entitlement is implied.</small>
              </div>
            </GlowHoverCard>
            <button className="sso-primary account-flow-next" onClick={continuePlan} type="button">
              Continue to setup
            </button>
          </div>
        ) : null}

        {step === 'setup' ? (
          <form
            className="setup-preview"
            onSubmit={(event) => {
              event.preventDefault()
              setSetupStep('setup')
              window.location.assign(ssoLinks.console)
            }}
          >
            <div>
              <span>Organization</span>
              <strong>{organization || 'Your organization'}</strong>
            </div>
            <div>
              <span>Plan</span>
              <strong>{selectedPlan === 'packaging-pending' ? 'Packaging to be confirmed' : 'Packaging to be confirmed'}</strong>
            </div>
            <label>
              First product
              <input name="product" placeholder="Atlas Home Hub" required />
            </label>
            <button className="sso-primary" type="submit">Open LangDrift</button>
            <button
              className="sso-secondary"
              onClick={() => notify('Invitations can be completed later from the workspace.')}
              type="button"
            >
              Invite team later
            </button>
          </form>
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
