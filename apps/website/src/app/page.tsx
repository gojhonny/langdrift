'use client'

import {
  ProductVisionCurve,
  type VisionDriftEvent,
  type VisionPoint
} from '@repo/react/ui/product-vision-curve'
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
  commentOpenAtom,
  selectedPlanAtom,
  selectedPointAtom,
  themeAtom,
  toastAtom
} from '../state'
import { StateLogger } from './state-logger'

const visionPoints: VisionPoint[] = [
  {
    label: 'Apr',
    value: 91,
    event: {
      actors: [{ initials: 'MR', name: 'Marina Reis', team: 'Leadership' }],
      classification: 'baseline',
      date: 'Apr 02',
      delta: 0,
      id: 'baseline',
      productArea: 'Vision',
      title: 'Vision baseline approved'
    }
  },
  { label: 'May', value: 88 },
  {
    label: 'Jun',
    value: 84,
    event: {
      actors: [
        { initials: 'AN', name: 'Ana', team: 'Product' },
        { initials: 'CA', name: 'Carlos', team: 'Platform' }
      ],
      classification: 'intentional',
      date: 'Jun 28',
      delta: -9,
      id: 'pricing',
      productArea: 'Pricing',
      title: 'Pricing strategy changed'
    }
  },
  {
    label: 'Jul',
    value: 79,
    event: {
      actors: [{ initials: 'CA', name: 'Carlos', team: 'Platform' }],
      classification: 'unexplained',
      date: 'Jul 22',
      delta: -6,
      id: 'authentication',
      productArea: 'Authentication',
      title: 'Authentication redesigned'
    }
  },
  {
    label: 'Aug',
    value: 73,
    event: {
      actors: [{ initials: 'AN', name: 'Ana', team: 'Product' }],
      classification: 'review',
      date: 'Aug 20',
      delta: -3,
      id: 'exports',
      productArea: 'Exports',
      title: 'Export behavior changed'
    }
  }
]

const changes = visionPoints.map((point) => ({
  delta: point.event?.delta ?? 0,
  detail: point.event?.title ?? `${point.label} Product Vision snapshot`,
  event: point.event,
  status: point.event?.classification ?? 'baseline'
}))

const plans: PricingPlan[] = [
  {
    id: 'plan-01',
    name: 'Plan 01',
    price: 'Pricing · TBD',
    description: 'Commercial name, price, and limits are intentionally not defined yet.',
    features: ['Teams · TBD', 'People · TBD', 'Products · TBD', 'Voice access · TBD']
  },
  {
    id: 'plan-02',
    name: 'Plan 02',
    price: 'Pricing · TBD',
    description: 'The final packaging will be defined by Pricing without changing the product truth.',
    features: ['Teams · TBD', 'People · TBD', 'Products · TBD', 'Voice access · TBD']
  },
  {
    id: 'plan-03',
    name: 'Plan 03',
    price: 'Pricing · TBD',
    description: 'This card demonstrates the acquisition surface, not a committed entitlement model.',
    features: ['Teams · TBD', 'People · TBD', 'Products · TBD', 'Voice access · TBD']
  }
]

const attribution = [
  {
    area: 'Pricing',
    change: 'Pricing strategy changed',
    date: 'Jun 28',
    delta: '−9',
    people: [
      { initials: 'AN', name: 'Ana', role: 'Product' },
      { initials: 'CA', name: 'Carlos', role: 'Platform' }
    ],
    status: 'Intentional Evolution'
  },
  {
    area: 'Authentication',
    change: 'Authentication redesigned',
    date: 'Jul 22',
    delta: '−6',
    people: [{ initials: 'CA', name: 'Carlos', role: 'Platform' }],
    status: 'Unexplained Drift'
  },
  {
    area: 'Exports',
    change: 'Export behavior changed',
    date: 'Aug 20',
    delta: '−3',
    people: [{ initials: 'AN', name: 'Ana', role: 'Product' }],
    status: 'Under Review'
  }
]

const founderOutcomes = [
  ['See the movement', 'Watch Product Vision evolve over time.'],
  ['Know why', 'Every important movement stays connected to a decision and reason.'],
  ['Know who', 'See the people and teams behind the change.'],
  ['Separate evolution from drift', 'Intentional decisions stay distinct from unexplained changes.'],
  ['Ask instead of digging', 'Executive Voice queries the same structured product history.'],
  ['Keep proof underneath', 'Drill into evidence only when you need to verify the conclusion.']
]

export default function WebsitePage() {
  const [theme, setTheme] = useAtom(themeAtom)
  const [selectedPoint, setSelectedPoint] = useAtom(selectedPointAtom)
  const [selectedPlan, setSelectedPlan] = useAtom(selectedPlanAtom)
  const [toast, setToast] = useAtom(toastAtom)
  const setCommentOpen = useSetAtom(commentOpenAtom)
  const setAccountAction = useSetAtom(accountActionAtom)
  const currentTheme = useAtomValue(themeAtom)
  const active = changes[selectedPoint] ?? changes[changes.length - 1]
  const selectedEventId = active.event?.id ?? 'exports'

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
    notify(`${plans.find((item) => item.id === plan)?.name ?? plan} preview selected`, 'success')
  }

  function selectCurveEvent(event: VisionDriftEvent) {
    const index = visionPoints.findIndex((point) => point.event?.id === event.id)
    if (index >= 0) setSelectedPoint(index)
  }

  const heroVisual = (
    <div>
      <div className="header-four-visual-head">
        <div className="header-four-visual-score">
          <span>Product Vision</span>
          <strong>73%</strong>
        </div>
        <div className="header-four-visual-meta">
          <span>Illustrative movement</span>
          <strong>down from 91% · 14 intentional · 4 unexplained</strong>
        </div>
      </div>
      <ProductVisionCurve
        data={visionPoints}
        onSelectEvent={selectCurveEvent}
        selectedEventId={selectedEventId}
      />
    </div>
  )

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
          visual={heroVisual}
        />

        <section className="curve-section" id="product">
          <div className="curve-copy">
            <span className="section-kicker">Visual-first for truth</span>
            <h2>The curve itself tells the story.</h2>
            <p>
              Product Vision movement stays attached to the event, person, product
              area, classification, and decision context that explain it. Demo values
              illustrate the experience, not a final scoring formula.
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
            <ProductVisionCurve
              data={visionPoints}
              onSelectEvent={selectCurveEvent}
              selectedEventId={selectedEventId}
            />
            <Scrubber
              label="Timeline"
              max={visionPoints.length - 1}
              onChange={setSelectedPoint}
              value={selectedPoint}
            />
            <div className="chart-comment">
              <FigmaComment
                author="Ana"
                initials="AN"
                message="Pricing was intentional. Authentication remains unexplained and export behavior is still under review."
                onOpenChange={setCommentOpen}
                timestamp="Aug 20"
              />
            </div>
          </div>
        </section>

        <section className="why-section" id="why">
          <div className="why-title">
            <span className="section-kicker">Know why</span>
            <h2>Change stays useful when the reason stays attached.</h2>
          </div>
          <article className="reason-card">
            <div className="reason-date">Jun 28</div>
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
                { initials: 'CA', name: 'Carlos', role: 'Platform' }
              ]}
              size={32}
            />
          </article>
        </section>

        <section className="attribution-section" id="attribution">
          <div className="features-heading">
            <span className="section-kicker">Know who</span>
            <h2>Know who moved the product.</h2>
            <p>
              Important movement stays attached to people, teams, product areas,
              decisions, and review state without turning LangDrift into punitive surveillance.
            </p>
          </div>
          <div className="attribution-grid">
            {attribution.map((event) => (
              <article key={event.change}>
                <div className="attribution-meta">
                  <span>{event.date}</span>
                  <span>{event.area}</span>
                </div>
                <h3>{event.change}</h3>
                <div className="attribution-bottom">
                  <AnimatedAvatarGroup people={event.people} />
                  <strong>{event.delta}</strong>
                  <span>{event.status}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="features-section">
          <div className="features-heading">
            <span className="section-kicker">Founder outcomes</span>
            <h2>See the movement. Ask why. Drill down only when needed.</h2>
          </div>
          <div className="feature-grid">
            {founderOutcomes.map(([title, description], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{title}</strong>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="report-section" id="report">
          <div className="report-copy">
            <span className="section-kicker">Executive report</span>
            <h2>Explain movement without sending leadership into engineering history.</h2>
            <p>
              Reports translate structured product truth into the same Product Vision,
              Drift, attribution, and decision language used everywhere else.
            </p>
          </div>
          <article className="report-preview">
            <div className="report-preview-head">
              <span>Illustrative period</span>
              <strong>Product Vision · 91 → 73</strong>
            </div>
            <dl>
              <div><dt>Intentional evolution</dt><dd>14 points</dd></div>
              <div><dt>Unexplained drift</dt><dd>4 points</dd></div>
              <div><dt>Largest movement</dt><dd>Pricing · −9</dd></div>
              <div><dt>Responsible</dt><dd>Ana + Carlos</dd></div>
            </dl>
            <small>Demo data · final Product Vision formula remains open.</small>
          </article>
        </section>

        <section className="voice-band">
          <div>
            <span className="section-kicker section-kicker-dark">Voice-first for inquiry</span>
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
              Ask why Product Vision moved
            </button>
          </div>
        </section>

        <Pricing2
          onSelectPlan={choosePlan}
          plans={plans}
          selectedPlan={selectedPlan}
          showBillingToggle={false}
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
