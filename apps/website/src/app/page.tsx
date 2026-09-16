'use client'

import { CompactDriftChart } from '@repo/react/vendors/shadcn'
import {
  AIContextMeter,
  AnimatedAvatarGroup,
  BasicToast,
  FigmaComment,
  Header4,
  Pricing2,
  Scrubber,
  SmoothFooter,
  UserAccountAvatar,
  type PricingPlan
} from '@repo/react/vendors/smoothui'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'

import {
  accountActionAtom,
  annualBillingAtom,
  commentOpenAtom,
  selectedPlanAtom,
  selectedPointAtom,
  themeAtom,
  toastAtom
} from '../state'
import { StateLogger } from './state-logger'

const curve = [
  { label: 'Apr', value: 100 },
  { label: 'May', value: 95 },
  { label: 'Jun', value: 95 },
  { label: 'Jul', value: 85 },
  { label: 'Aug', value: 73 }
]

const changes = [
  {
    delta: '—',
    detail: 'Vision baseline recorded',
    people: [{ initials: 'MR', name: 'Marina Reis', role: 'CEO' }],
    status: 'Baseline'
  },
  {
    delta: '−5',
    detail: 'Navigation scope clarified',
    people: [{ initials: 'AN', name: 'Ana', role: 'Product' }],
    status: 'Intentional'
  },
  {
    delta: '−9',
    detail: 'Pricing strategy changed',
    people: [
      { initials: 'AN', name: 'Ana', role: 'Product' },
      { initials: 'CA', name: 'Carlos', role: 'Engineering' }
    ],
    status: 'Intentional'
  },
  {
    delta: '−6',
    detail: 'Authentication redesigned',
    people: [
      { initials: 'CA', name: 'Carlos', role: 'Engineering' },
      { initials: 'LI', name: 'Lia', role: 'Design' }
    ],
    status: 'Unexplained'
  },
  {
    delta: '−3',
    detail: 'Export rules changed',
    people: [
      { initials: 'AN', name: 'Ana', role: 'Product' },
      { initials: 'CA', name: 'Carlos', role: 'Engineering' }
    ],
    status: 'Review'
  }
]

const plans: PricingPlan[] = [
  {
    id: 'team',
    name: 'Team',
    price: 'For one product team',
    description: 'A focused view of Vision, Drift, decisions, and evidence.',
    features: ['1 product', '2 teams', 'Drift reports', 'Decision attribution']
  },
  {
    id: 'executive',
    name: 'Executive',
    price: 'For product leadership',
    description: 'Cross-team visibility with executive Voice inquiry.',
    features: ['Multiple teams', 'Executive Voice', 'Team and area views', 'Reports']
  },
  {
    id: 'organization',
    name: 'Organization',
    price: 'For product portfolios',
    description: 'Organization-wide product evolution and governance.',
    features: ['Multiple products', 'SSO', 'Role controls', 'Evidence retention']
  }
]

export default function WebsitePage() {
  const [theme, setTheme] = useAtom(themeAtom)
  const [selectedPoint, setSelectedPoint] = useAtom(selectedPointAtom)
  const [annual, setAnnual] = useAtom(annualBillingAtom)
  const [selectedPlan, setSelectedPlan] = useAtom(selectedPlanAtom)
  const [toast, setToast] = useAtom(toastAtom)
  const setCommentOpen = useSetAtom(commentOpenAtom)
  const setAccountAction = useSetAtom(accountActionAtom)
  const active = changes[selectedPoint] ?? changes[changes.length - 1]
  const currentTheme = useAtomValue(themeAtom)

  useEffect(() => {
    document.documentElement.dataset.theme = currentTheme
    document.documentElement.style.colorScheme = currentTheme
  }, [currentTheme])

  function notify(message: string, tone: 'info' | 'success' | 'warning' = 'info') {
    setToast({ message, open: true, tone })
  }

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    notify(`${next === 'dark' ? 'Dark' : 'Light'} theme enabled`)
  }

  function handleAccountAction(action: 'account' | 'settings' | 'signout') {
    setAccountAction(action)
    notify(`${action === 'signout' ? 'Sign out' : action} action selected`)
  }

  function choosePlan(plan: string) {
    setSelectedPlan(plan)
    notify(`${plans.find((item) => item.id === plan)?.name ?? plan} plan selected`, 'success')
  }

  return (
    <>
      <StateLogger />
      <a className="skip-link" href="#product">
        Skip to product
      </a>
      <main id="top">
        <Header4
          actions={
            <UserAccountAvatar
              detail="Preview"
              initials="JS"
              name="Jonny"
              onAction={handleAccountAction}
            />
          }
          onThemeToggle={toggleTheme}
          theme={theme}
        />

        <section className="curve-section" id="product">
          <div className="curve-copy">
            <span className="section-kicker">Drift graph</span>
            <h2>See the moment Product Vision moved.</h2>
            <p>
              One compact view connects the score change to the people, decision,
              reason, and evidence behind it.
            </p>
          </div>
          <div className="curve-card">
            <div className="curve-card-top">
              <div>
                <span>Product Vision</span>
                <strong>73%</strong>
              </div>
              <div className="curve-summary">
                <span>14 points · intentional evolution</span>
                <span>4 points · unexplained drift</span>
              </div>
            </div>
            <CompactDriftChart activeIndex={selectedPoint} data={curve} height={150} />
            <Scrubber
              label="Timeline"
              max={curve.length - 1}
              onChange={setSelectedPoint}
              value={selectedPoint}
            />
            <div className="active-change">
              <div>
                <small>{curve[selectedPoint]?.label ?? 'Aug'} · What happened?</small>
                <strong>{active.detail}</strong>
              </div>
              <span className="active-change-delta">{active.delta}</span>
              <AnimatedAvatarGroup people={active.people} />
              <span className={`change-state change-state-${active.status.toLowerCase()}`}>
                {active.status}
              </span>
            </div>
            <div className="chart-comment">
              <FigmaComment
                author="Ana"
                initials="AN"
                message="The August movement is partially explained. Pricing was intentional; export scope still needs review."
                onOpenChange={setCommentOpen}
                timestamp="Aug 20"
              />
            </div>
          </div>
        </section>

        <section className="why-section" id="why">
          <div className="why-title">
            <span className="section-kicker">Why did it happen?</span>
            <h2>Change is useful only when the reason stays attached.</h2>
          </div>
          <article className="reason-card">
            <div className="reason-date">Aug 14</div>
            <div className="reason-main">
              <h3>Ana + Carlos changed the pricing strategy.</h3>
              <dl>
                <div>
                  <dt>Reason</dt>
                  <dd>Enterprise customers required a different packaging model.</dd>
                </div>
                <div>
                  <dt>Impact</dt>
                  <dd>Pricing, onboarding and billing.</dd>
                </div>
                <div>
                  <dt>Decision</dt>
                  <dd>Recorded ✓</dd>
                </div>
              </dl>
            </div>
            <AnimatedAvatarGroup
              people={[
                { initials: 'AN', name: 'Ana', role: 'Product' },
                { initials: 'CA', name: 'Carlos', role: 'Engineering' }
              ]}
              size={32}
            />
          </article>
        </section>

        <section className="features-section">
          <div className="features-heading">
            <span className="section-kicker">One model, multiple views</span>
            <h2>Read the same product evolution from the level you need.</h2>
          </div>
          <div className="feature-grid">
            {[
              'Vision Baseline',
              'Drift Graph',
              'Drift Report',
              'Drift Timeline',
              'Drift Events',
              'Drift by Team',
              'Drift by Product Area',
              'Intentional Drift',
              'Unexplained Drift'
            ].map((feature, index) => (
              <article key={feature}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{feature}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="voice-band">
          <div>
            <span className="section-kicker section-kicker-dark">Voice inquiry</span>
            <h2>Ask the product history, not the repository.</h2>
            <p>
              Executive Voice queries the same structured Product Vision, Drift,
              decisions, people, and evidence represented in the visual layer.
            </p>
          </div>
          <div className="voice-meter-card">
            <span>Deterministic context loaded</span>
            <AIContextMeter
              breakdown={[
                { label: 'Vision', value: 18 },
                { label: 'Decisions', value: 27 },
                { label: 'Evidence', value: 46 }
              ]}
              limit={130}
              used={91}
            />
            <button
              onClick={() => notify('Voice preview opened from structured context', 'success')}
              type="button"
            >
              Ask why Vision moved
            </button>
          </div>
        </section>

        <Pricing2
          annual={annual}
          onBillingChange={(value) => {
            setAnnual(value)
            notify(`${value ? 'Annual' : 'Monthly'} billing selected`)
          }}
          onSelectPlan={choosePlan}
          plans={plans}
          selectedPlan={selectedPlan}
        />
      </main>
      <SmoothFooter />
      <BasicToast
        message={toast.message}
        onClose={() => setToast((current) => ({ ...current, open: false }))}
        open={toast.open}
        tone={toast.tone}
      />
    </>
  )
}
