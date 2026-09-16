'use client'

import { aiAvatars } from '@repo/react/ui/ai-avatars'
import {
  ProductVisionCurve,
  type VisionDriftEvent,
  type VisionPoint
} from '@repo/react/ui/product-vision-curve'
import {
  AnimatedAvatarGroup,
  Header4,
  SmoothFooter
} from '@repo/react/vendors/smoothui'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect } from 'react'

import {
  selectedPointAtom,
  themeAtom
} from '../state'
import { websiteLinks } from './app-links'
import { StateLogger } from './state-logger'
import { VoicePreview } from './voice-preview'

// Illustrative frontend fixture data. This disclosure stays internal so development labels are not customer-facing.
const visionPoints: VisionPoint[] = [
  {
    label: 'Apr',
    value: 91,
    event: {
      actionHref: '#why',
      actionLabel: 'See baseline context',
      actors: [{ initials: 'MR', name: 'Marina Reis', src: aiAvatars.marina, team: 'Leadership' }],
      classification: 'baseline',
      date: 'Apr 02',
      decision: 'Vision baseline recorded',
      delta: 0,
      id: 'baseline',
      productArea: 'Vision',
      reason: 'Leadership recorded the product direction used as the reference for this period.',
      title: 'Vision baseline approved'
    }
  },
  { label: 'May', value: 88 },
  {
    label: 'Jun',
    value: 84,
    event: {
      actionHref: '#why',
      actionLabel: 'View decision context',
      actors: [
        { initials: 'AN', name: 'Ana', src: aiAvatars.ana, team: 'Product' },
        { initials: 'CA', name: 'Carlos', src: aiAvatars.carlos, team: 'Platform' }
      ],
      classification: 'intentional',
      date: 'Jun 28',
      decision: 'Decision recorded',
      delta: -9,
      id: 'pricing',
      productArea: 'Pricing',
      reason: 'Enterprise customers required a different packaging model.',
      title: 'Pricing strategy changed'
    }
  },
  {
    label: 'Jul',
    value: 79,
    event: {
      actionHref: '#why',
      actionLabel: 'Review context',
      actors: [{ initials: 'CA', name: 'Carlos', src: aiAvatars.carlos, team: 'Platform' }],
      classification: 'unexplained',
      date: 'Jul 22',
      decision: 'No matching product decision found',
      delta: -6,
      id: 'authentication',
      productArea: 'Authentication',
      reason: 'LangDrift found implementation evidence, but no matching recorded product decision.',
      title: 'Authentication redesigned'
    }
  },
  {
    label: 'Aug',
    value: 73,
    event: {
      actionHref: '#why',
      actionLabel: 'Inspect review state',
      actors: [{ initials: 'AN', name: 'Ana', src: aiAvatars.ana, team: 'Product' }],
      classification: 'review',
      date: 'Aug 20',
      decision: 'Classification under review',
      delta: -3,
      id: 'exports',
      productArea: 'Exports',
      reason: 'Evidence shows the behavior changed, but the product rationale is not complete yet.',
      title: 'Export behavior changed'
    }
  }
]

const attribution = [
  {
    area: 'Pricing',
    change: 'Pricing strategy changed',
    date: 'Jun 28',
    delta: '−9',
    people: [
      { initials: 'AN', name: 'Ana', role: 'Product', src: aiAvatars.ana },
      { initials: 'CA', name: 'Carlos', role: 'Platform', src: aiAvatars.carlos }
    ],
    status: 'Intentional Evolution'
  },
  {
    area: 'Authentication',
    change: 'Authentication redesigned',
    date: 'Jul 22',
    delta: '−6',
    people: [{ initials: 'CA', name: 'Carlos', role: 'Platform', src: aiAvatars.carlos }],
    status: 'Unexplained Drift'
  },
  {
    area: 'Exports',
    change: 'Export behavior changed',
    date: 'Aug 20',
    delta: '−3',
    people: [{ initials: 'AN', name: 'Ana', role: 'Product', src: aiAvatars.ana }],
    status: 'Under Review'
  }
]

export default function WebsitePage() {
  const [theme, setTheme] = useAtom(themeAtom)
  const [selectedPoint, setSelectedPoint] = useAtom(selectedPointAtom)
  const currentTheme = useAtomValue(themeAtom)
  const activeEvent = visionPoints[selectedPoint]?.event ?? visionPoints.at(-1)?.event
  const selectedEventId = activeEvent?.id ?? 'exports'

  useEffect(() => {
    document.documentElement.dataset.theme = currentTheme
    document.documentElement.style.colorScheme = currentTheme
  }, [currentTheme])

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  function selectCurveEvent(event: VisionDriftEvent) {
    const index = visionPoints.findIndex((point) => point.event?.id === event.id)
    if (index >= 0) setSelectedPoint(index)
  }

  const heroVisual = (
    <div className="hero-product-card">
      <div className="header-four-visual-head">
        <div className="header-four-visual-score">
          <span>Product Vision</span>
          <strong>73%</strong>
        </div>
        <div className="header-four-visual-meta">
          <span>Vision movement</span>
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
      <a className="skip-link" href="#why">
        Skip to product explanation
      </a>
      <main id="top">
        <Header4
          actions={
            <div className="public-auth-actions">
              <a className="public-sign-in" href={websiteLinks.signIn}>Sign in</a>
              <a className="smooth-primary-button" href={websiteLinks.signUp}>Get started</a>
            </div>
          }
          onThemeToggle={toggleTheme}
          theme={theme}
          visual={heroVisual}
        />

        <section className="why-section" id="why">
          <div className="why-title">
            <span className="section-kicker">Know why</span>
            <h2>The movement stays attached to its reason.</h2>
            <p>
              Select a point in the curve and LangDrift keeps the executive explanation,
              people, decision state, and classification together.
            </p>
          </div>
          {activeEvent ? (
            <article className="reason-card">
              <div className="reason-date">{activeEvent.date}</div>
              <div className="reason-main">
                <h3>{activeEvent.title}</h3>
                <dl>
                  <div>
                    <dt>Why</dt>
                    <dd>{activeEvent.reason}</dd>
                  </div>
                  <div>
                    <dt>Decision</dt>
                    <dd>{activeEvent.decision}</dd>
                  </div>
                  <div>
                    <dt>Product area</dt>
                    <dd>{activeEvent.productArea ?? 'Product'}</dd>
                  </div>
                </dl>
              </div>
              <AnimatedAvatarGroup
                people={activeEvent.actors.map((actor) => ({
                  initials: actor.initials,
                  name: actor.name,
                  role: actor.team,
                  src: actor.src
                }))}
                size={32}
              />
            </article>
          ) : null}
        </section>

        <section className="attribution-section" id="attribution">
          <div className="features-heading">
            <span className="section-kicker">Know who</span>
            <h2>Know who moved the product.</h2>
            <p>
              Important movement stays connected to people, teams, product areas,
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

        <section className="intent-section" id="intent">
          <div>
            <span className="section-kicker">Intent matters</span>
            <h2>Evolution is expected. Unexplained movement is different.</h2>
          </div>
          <div className="intent-grid">
            <article>
              <span>Intentional Evolution</span>
              <strong>14 points</strong>
              <p>Movement backed by a recorded decision, reason, and attributable actors.</p>
            </article>
            <article>
              <span>Unexplained Drift</span>
              <strong>4 points</strong>
              <p>Meaningful movement without enough recorded product rationale.</p>
            </article>
            <article>
              <span>Under Review</span>
              <strong>1 event</strong>
              <p>Evidence exists, but the relationship is not ready for a confident classification.</p>
            </article>
          </div>
        </section>

        <section className="voice-band" id="voice">
          <VoicePreview />
        </section>

        <section className="report-section" id="report">
          <div className="report-copy">
            <span className="section-kicker">Executive output</span>
            <h2>A report should read like a decision brief, not an engineering dump.</h2>
          </div>
          <article className="report-preview">
            <div className="report-preview-head">
              <span>Weekly product evolution</span>
              <strong>Product Vision · 81 → 76</strong>
            </div>
            <dl>
              <div><dt>Largest movement</dt><dd>Authentication · −3</dd></div>
              <div><dt>Why</dt><dd>No linked product decision</dd></div>
              <div><dt>Who</dt><dd>Carlos · Platform</dd></div>
              <div><dt>Status</dt><dd>Unexplained Drift</dd></div>
              <div><dt>Needs attention</dt><dd>Review authentication rationale</dd></div>
            </dl>
          </article>
        </section>

        <section className="packaging-section" id="pricing">
          <span className="section-kicker">Plans</span>
          <h2>Built for founder-led teams and growing product organizations.</h2>
          <p>Packaging is being finalized. Start with the product experience now.</p>
          <a className="smooth-primary-button" href={websiteLinks.signUp}>Get started</a>
        </section>
      </main>
      <SmoothFooter />
    </>
  )
}
