'use client'

import { Brand } from '@repo/react/ui/brand'
import { AppleLogo, CaretDown, GithubLogo, GoogleLogo } from '@repo/react/ui/icons'
import { ThemeToggle } from '@repo/react/ui/theme-toggle'
import { useAtom, useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'

import {
  accountEmailAtom,
  organizationNameAtom,
  selectedPlanAtom,
  setupStepAtom,
  signInAttemptsAtom,
  themeAtom
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
  { href: '/sign-up', id: 'sign-up', label: 'Account', note: 'Your personal account' },
  { href: '/create-organization', id: 'create-organization', label: 'Organization', note: 'Create your workspace' },
  { href: '/select-plan', id: 'select-plan', label: 'Plan', note: 'Choose how to start' },
  { href: '/setup', id: 'setup', label: 'Setup', note: 'Create your first product' }
] as const

const providers = [
  { icon: GoogleLogo, id: 'Google', label: 'Continue with Google' },
  { icon: GithubLogo, id: 'GitHub', label: 'Continue with GitHub' },
  { icon: AppleLogo, id: 'Apple', label: 'Continue with Apple' }
] as const

function flowIndex(step: AccountFlowStep) {
  return flowSteps.findIndex((item) => item.id === step)
}

export function AccountFlow({ step }: { step: AccountFlowStep }) {
  const router = useRouter()
  const [theme, setTheme] = useAtom(themeAtom)
  const [email, setEmail] = useAtom(accountEmailAtom)
  const [organization, setOrganization] = useAtom(organizationNameAtom)
  const [, setSelectedPlan] = useAtom(selectedPlanAtom)
  const setSetupStep = useSetAtom(setupStepAtom)
  const incrementAttempts = useSetAtom(signInAttemptsAtom)
  const [signInStatus, setSignInStatus] = useState<string | null>(null)
  const currentIndex = flowIndex(step)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
  }, [theme])

  function submitIdentity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    incrementAttempts((current) => current + 1)

    if (step === 'sign-in') {
      setSignInStatus('Email sign in will become active when authentication is connected.')
      return
    }

    setSetupStep('account')
    router.push('/create-organization')
  }

  function chooseProvider(provider: string) {
    incrementAttempts((current) => current + 1)
    setSignInStatus(`${provider} sign in will become active when authentication is connected.`)
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
      'Create your organization',
      'Give your LangDrift workspace a home. You will be the initial Owner.'
    ],
    'select-plan': [
      'Choose how to start',
      'Packaging is being finalized. Continue with product setup now.'
    ],
    setup: [
      'Set up your first product',
      'Name the product you want LangDrift to understand first.'
    ],
    'sign-in': [
      'Sign in',
      'Return to the product history your team already understands with LangDrift.'
    ],
    'sign-up': [
      'Create your account',
      'Start with your work identity. Organization setup comes next.'
    ]
  }
  const [title, description] = titles[step]
  const onboarding = step !== 'sign-in'

  return (
    <main className="account-flow-shell">
      <StateLogger />
      <header className="sso-header">
        <a aria-label="LangDrift website" href={ssoLinks.website}>
          <Brand compact tone={theme === 'dark' ? 'dark' : 'light'} />
        </a>
        <div className="account-flow-header-actions">
          <a className="account-header-link" href={step === 'sign-in' ? '/sign-up' : '/sign-in'}>
            {step === 'sign-in' ? 'Create account' : 'Sign in'}
          </a>
          <ThemeToggle
            onToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            theme={theme}
          />
        </div>
      </header>

      <section className={`auth-stage ${onboarding ? 'auth-stage-onboarding' : 'auth-stage-signin'}`}>
        <div className="auth-main">
          <div className="account-flow-copy">
            <span className="sso-kicker">{step === 'sign-in' ? 'Welcome back' : 'Get started'}</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>

          {step === 'sign-in' ? (
            <div className="identity-stack">
              <div className="social-login-stack">
                {providers.map(({ icon: Icon, id, label }) => (
                  <button key={id} onClick={() => chooseProvider(id)} type="button">
                    <Icon aria-hidden="true" size={18} weight="fill" />
                    <span>{label}</span>
                  </button>
                ))}
                <div className="auth-divider"><span>or</span></div>
              </div>
              <form className="account-flow-form account-flow-form-flat" onSubmit={submitIdentity}>
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
                <button className="sso-primary" type="submit">Continue with email</button>
                {signInStatus ? <output className="auth-status">{signInStatus}</output> : null}
                <p className="auth-secondary-copy">
                  New to LangDrift? <a className="create-account-link" href="/sign-up">Create account</a>
                </p>
              </form>
            </div>
          ) : null}

          {step === 'sign-up' ? (
            <form className="account-flow-form" onSubmit={submitIdentity}>
              <label>
                Full name
                <input autoComplete="name" name="name" placeholder="Your name" required />
              </label>
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
              <button className="sso-primary" type="submit">Continue</button>
              <p className="auth-secondary-copy">Already have an account? <a href="/sign-in">Sign in</a></p>
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
                <span className="select-control">
                  <select defaultValue="owner">
                    <option value="owner">Owner / Founder</option>
                    <option value="executive">Executive</option>
                    <option value="director">Director</option>
                    <option value="manager">Manager</option>
                    <option value="other">Other</option>
                  </select>
                  <CaretDown aria-hidden="true" size={14} />
                </span>
              </label>
              <button className="sso-primary" type="submit">Continue</button>
            </form>
          ) : null}

          {step === 'select-plan' ? (
            <div className="account-plan-grid">
              <article className="account-plan-card account-plan-card-neutral">
                <span>Packaging in progress</span>
                <strong>Start with LangDrift</strong>
                <p>Teams, people, products, Voice, history, and integrations will define final packaging.</p>
              </article>
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
              <label>
                First product
                <input name="product" placeholder="Atlas Home Hub" required />
              </label>
              <button className="sso-primary" type="submit">Open LangDrift</button>
            </form>
          ) : null}
        </div>

        {onboarding ? (
          <aside className="onboarding-progress" aria-label="Account setup progress">
            {flowSteps.map((item, index) => {
              const state = index < currentIndex ? 'completed' : index === currentIndex ? 'current' : 'future'
              return (
                <div
                  aria-current={state === 'current' ? 'step' : undefined}
                  className="onboarding-progress-step"
                  data-state={state}
                  key={item.id}
                >
                  <span>{state === 'completed' ? '✓' : index + 1}</span>
                  <div>
                    <strong>{item.label}</strong>
                    <small>{item.note}</small>
                  </div>
                </div>
              )
            })}
          </aside>
        ) : null}
      </section>
    </main>
  )
}
