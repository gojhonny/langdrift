'use client'

import {
  AppleLogo,
  CaretDown,
  GithubLogo,
  GoogleLogo
} from '@repo/react/ui/icons'
import { Brand } from '@repo/react/ui/brand'
import { ThemeToggle } from '@repo/react/ui/theme-toggle'
import { GlowHoverCard } from '@repo/react/vendors/smoothui'
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
  { href: '/sign-up', id: 'sign-up', label: 'Account' },
  {
    href: '/create-organization',
    id: 'create-organization',
    label: 'Organization'
  },
  { href: '/select-plan', id: 'select-plan', label: 'Plan' },
  { href: '/setup', id: 'setup', label: 'Setup' }
] as const

const socialProviders = [
  { icon: AppleLogo, id: 'Apple', label: 'Apple' },
  { icon: GoogleLogo, id: 'Google', label: 'Google' },
  { icon: GithubLogo, id: 'GitHub', label: 'GitHub' }
] as const

const planOptions = [
  {
    description:
      'A simple starting point for understanding Product Vision and Drift.',
    id: 'free',
    name: 'Free',
    note: 'For getting started'
  },
  {
    description:
      'For product teams that want shared context around decisions, people, and evolution.',
    featured: true,
    id: 'plus',
    name: 'Plus+',
    note: 'For growing product teams'
  },
  {
    description:
      'For organizations that need deeper governance across products and teams.',
    id: 'pro',
    name: 'Pro',
    note: 'For organizations'
  }
] as const

function flowIndex(step: AccountFlowStep) {
  return flowSteps.findIndex((item) => item.id === step)
}

function planName(planId: string) {
  return planOptions.find((plan) => plan.id === planId)?.name ?? 'Free'
}

export function AccountFlow({ step }: { step: AccountFlowStep }) {
  const router = useRouter()
  const [theme, setTheme] = useAtom(themeAtom)
  const [email, setEmail] = useAtom(accountEmailAtom)
  const [organization, setOrganization] = useAtom(organizationNameAtom)
  const [selectedPlan, setSelectedPlan] = useAtom(selectedPlanAtom)
  const setSetupStep = useSetAtom(setupStepAtom)
  const incrementAttempts = useSetAtom(signInAttemptsAtom)
  const [providerStatus, setProviderStatus] = useState<string | null>(null)
  const currentIndex = flowIndex(step)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
  }, [theme])

  function submitIdentity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    incrementAttempts((current) => current + 1)

    if (step === 'sign-in') {
      window.location.assign(ssoLinks.dashboard)
      return
    }

    setSetupStep('account')
    router.push('/create-organization')
  }

  function continueWithProvider(provider: string) {
    incrementAttempts((current) => current + 1)
    setProviderStatus(`${provider} sign in is not connected yet.`)
  }

  function submitOrganization(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSetupStep('organization')
    router.push('/select-plan')
  }

  function choosePlan(planId: string) {
    setSelectedPlan(planId)
    setSetupStep('plan')
    router.push('/setup')
  }

  const titles: Record<AccountFlowStep, [string, string]> = {
    'create-organization': [
      'Create your organization.',
      'Give your LangDrift workspace a home. You will be the initial Owner.'
    ],
    'select-plan': [
      'Choose your plan.',
      'Select how you want to start with LangDrift.'
    ],
    setup: [
      'Set up your first product.',
      'Name the product you want LangDrift to understand first. Integrations come next.'
    ],
    'sign-in': [
      'Welcome back',
      'Sign in to continue to your LangDrift workspace.'
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
          <a
            className="account-header-link"
            href={step === 'sign-in' ? '/sign-up' : '/sign-in'}
          >
            {step === 'sign-in' ? 'Create account' : 'Sign in'}
          </a>
          <ThemeToggle
            onToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            theme={theme}
          />
        </div>
      </header>

      {step !== 'sign-in' ? (
        <nav
          aria-label="Account setup progress"
          className="account-flow-progress"
        >
          {flowSteps.map((item, index) => {
            const state =
              index < currentIndex
                ? 'completed'
                : index === currentIndex
                  ? 'current'
                  : 'future'
            const content = (
              <>
                <span>
                  {state === 'completed'
                    ? '✓'
                    : String(index + 1).padStart(2, '0')}
                </span>
                {item.label}
              </>
            )

            if (state === 'future') {
              return (
                <span
                  className="account-flow-progress-step"
                  data-state={state}
                  key={item.href}
                >
                  {content}
                </span>
              )
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

      {step === 'sign-in' ? (
        <section className="login-five-shell">
          <div className="login-five-card">
            <div className="login-five-heading">
              <h1>{title}</h1>
              <p>{description}</p>
              <small>
                Don&apos;t have an account?{' '}
                <a href="/sign-up">Create account</a>
              </small>
            </div>
            <form className="login-five-form" onSubmit={submitIdentity}>
              <label htmlFor="login-email">Email</label>
              <input
                autoComplete="email"
                id="login-email"
                onChange={(event) => setEmail(event.currentTarget.value)}
                placeholder="m@example.com"
                required
                type="email"
                value={email}
              />
              <button className="sso-primary" type="submit">
                Continue with email
              </button>
            </form>
            <div className="auth-divider">
              <span>Or continue with</span>
            </div>
            <div className="login-five-providers">
              {socialProviders.map(({ icon: Icon, id, label }) => (
                <button
                  key={id}
                  onClick={() => continueWithProvider(id)}
                  type="button"
                >
                  <Icon aria-hidden="true" size={18} weight="fill" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
            {providerStatus ? (
              <output className="auth-status">{providerStatus}</output>
            ) : null}
          </div>
        </section>
      ) : null}

      {step === 'select-plan' ? (
        <section className="plan-selection-shell">
          <div className="plan-selection-heading">
            <span className="sso-kicker">Account setup</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <div className="plan-selection-grid">
            {planOptions.map((plan) => (
              <GlowHoverCard
                key={plan.id}
                selected={'featured' in plan ? plan.featured : false}
              >
                <article className="plan-selection-card">
                  <div>
                    <span>{plan.note}</span>
                    <h2>{plan.name}</h2>
                    <p>{plan.description}</p>
                  </div>
                  <button onClick={() => choosePlan(plan.id)} type="button">
                    Choose {plan.name}
                  </button>
                </article>
              </GlowHoverCard>
            ))}
          </div>
        </section>
      ) : null}

      {step !== 'sign-in' && step !== 'select-plan' ? (
        <section className="account-flow-card" data-step={step}>
          <div className="account-flow-copy">
            <span className="sso-kicker">Account setup</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>

          {step === 'sign-up' ? (
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
                Create account
              </button>
            </form>
          ) : null}

          {step === 'create-organization' ? (
            <form className="account-flow-form" onSubmit={submitOrganization}>
              <label>
                Organization name
                <input
                  autoComplete="organization"
                  onChange={(event) =>
                    setOrganization(event.currentTarget.value)
                  }
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
                    <option value="other">Other</option>
                  </select>
                  <CaretDown aria-hidden="true" size={14} />
                </span>
              </label>
              <button className="sso-primary" type="submit">
                Create organization
              </button>
            </form>
          ) : null}

          {step === 'setup' ? (
            <form
              className="setup-preview"
              onSubmit={(event) => {
                event.preventDefault()
                setSetupStep('setup')
                window.location.assign(ssoLinks.dashboard)
              }}
            >
              <div>
                <span>Organization</span>
                <strong>{organization || 'Your organization'}</strong>
              </div>
              <div>
                <span>Plan</span>
                <strong>{planName(selectedPlan)}</strong>
              </div>
              <label>
                First product
                <input name="product" placeholder="Atlas Home Hub" required />
              </label>
              <button className="sso-primary" type="submit">
                Open LangDrift
              </button>
            </form>
          ) : null}
        </section>
      ) : null}
    </main>
  )
}
