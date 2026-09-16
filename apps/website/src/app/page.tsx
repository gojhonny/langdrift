import { Brand } from '@repo/react/ui/brand'
import { DriftCurve } from '@repo/react/ui/drift-curve'
import { StatusPill } from '@repo/react/ui/status-pill'
import { VoicePreview } from './voice-preview'

const proof = [
  { value: '62%', label: 'intentional evolution' },
  { value: '4', label: 'unexplained changes' },
  { value: '2', label: 'items under review' },
  { value: '18', label: 'linked evidence items' }
]

const events = [
  {
    date: 'Aug 18',
    title: 'Pricing direction changed',
    detail: 'Annual-first packaging replaced usage-first framing.',
    delta: '−9',
    tone: 'intentional' as const,
    status: 'Intentional Evolution'
  },
  {
    date: 'Aug 29',
    title: 'Authentication behavior changed',
    detail: 'Guest access disappeared without a linked decision.',
    delta: '−6',
    tone: 'unexplained' as const,
    status: 'Unexplained Drift'
  },
  {
    date: 'Sep 08',
    title: 'Export scope narrowed',
    detail: 'CSV remains; scheduled export is no longer represented.',
    delta: '−3',
    tone: 'review' as const,
    status: 'Under Review'
  }
]

export default function WebsitePage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a className="brand-link" href="#top" aria-label="Lang Drift home">
          <Brand compact />
        </a>
        <nav aria-label="Primary navigation">
          <a href="#product">Product</a>
          <a href="#how">How it works</a>
          <a href="#voice">Voice</a>
        </nav>
        <div className="header-actions">
          <a className="text-link" href="/signin">
            Sign in
          </a>
          <a className="button button-dark" href="#contact">
            Request access
          </a>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="eyebrow-mark" /> Product evolution, made legible
            </span>
            <h1>
              Stay in charge of what your product <em>becomes.</em>
            </h1>
            <p className="hero-lede">
              Lang Drift shows how far reality has moved from Product Vision —
              when it moved, why it moved, and who was involved.
            </p>
            <div className="hero-actions">
              <a className="button button-brand" href="#product">
                See the product
              </a>
              <a className="button button-ghost" href="#how">
                How it works <span aria-hidden="true">↘</span>
              </a>
            </div>
            <div className="hero-note">
              Visual-first for truth. Voice-first for inquiry.
            </div>
          </div>

          <section className="hero-product" aria-label="Sample Lang Drift workspace">
            <div className="product-chrome">
              <div>
                <span className="product-overline">Demo model</span>
                <strong>Atlas Home Hub</strong>
              </div>
              <span className="live-pill">Updated 12m ago</span>
            </div>
            <div className="vision-row">
              <div>
                <span className="product-overline">Product Vision</span>
                <div className="vision-value">
                  73 <span>−18 since Q2</span>
                </div>
              </div>
              <StatusPill tone="review">Needs attention</StatusPill>
            </div>
            <div className="curve-wrap">
              <div className="curve-scale" aria-hidden="true">
                <span>100</span>
                <span>75</span>
                <span>50</span>
              </div>
              <DriftCurve height={270} />
              <div className="curve-dates" aria-hidden="true">
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
              </div>
            </div>
            <div className="event-preview">
              <span className="event-dot event-dot-red" />
              <div>
                <strong>Authentication behavior changed</strong>
                <span>No linked decision found · −6 Vision points</span>
              </div>
              <StatusPill tone="unexplained">Unexplained</StatusPill>
            </div>
          </section>
        </section>

        <section className="proof-strip" aria-label="Sample workspace summary">
          <div className="proof-label">
            <span>What moved</span>
            <strong>Last 30 days</strong>
          </div>
          {proof.map((item) => (
            <div className="proof-stat" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </section>

        <section className="editorial-section" id="product">
          <div className="editorial-intro">
            <span className="section-kicker">Product Vision</span>
            <h2>Vision is a compare target, not a forgotten document.</h2>
          </div>
          <div className="editorial-copy">
            <p>
              Lang Drift keeps Product Vision explicit while the product changes.
              Decisions, observations, evidence, and versions form a queryable
              timeline instead of disappearing across tools.
            </p>
          </div>
          <div className="story-grid">
            <article className="story-card story-card-dark">
              <span className="card-index">01</span>
              <h3>See what moved.</h3>
              <p>
                Compare reality to Vision across time. The Drift Curve makes
                directional change visible before it becomes institutional memory.
              </p>
              <div className="mini-chart" aria-hidden="true">
                <svg viewBox="0 0 300 100" preserveAspectRatio="none">
                  <title>Decorative product evolution curve</title>
                  <path
                    d="M0 18 C60 15 88 22 122 43 S188 52 215 69 S260 70 300 88"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                </svg>
              </div>
            </article>
            <article className="story-card story-card-gradient">
              <span className="card-index">02</span>
              <h3>Know why.</h3>
              <p>
                Every important movement can point back to a decision, an
                observation, or the absence of one.
              </p>
              <div className="decision-stack">
                <div>
                  <span>Decision</span>
                  <strong>Annual-first packaging</strong>
                </div>
                <div>
                  <span>Effect</span>
                  <strong>Product Vision −9</strong>
                </div>
              </div>
            </article>
            <article className="story-card">
              <span className="card-index">03</span>
              <h3>Keep people in the story.</h3>
              <p>
                Attribution is human-readable: who proposed, approved, and
                implemented the change — with technical provenance kept deeper.
              </p>
              <div className="people-stack">
                <div className="person">
                  <span className="avatar avatar-a">AS</span>
                  <div>
                    <strong>Ana Silva</strong>
                    <span>Product · Proposed</span>
                  </div>
                </div>
                <div className="person">
                  <span className="avatar avatar-b">CS</span>
                  <div>
                    <strong>Carlos Souza</strong>
                    <span>Engineering · Implemented</span>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="change-section" id="how">
          <div className="change-heading">
            <span className="section-kicker">Drift, explained</span>
            <h2>Not every change is drift. Not every drift is a failure.</h2>
            <p>
              Classification keeps deliberate evolution separate from unexplained
              divergence and work that still needs review.
            </p>
          </div>
          <div className="change-list">
            {events.map((event) => (
              <article className="change-row" key={event.title}>
                <span className="change-date">{event.date}</span>
                <div className="change-body">
                  <strong>{event.title}</strong>
                  <span>{event.detail}</span>
                </div>
                <strong className="change-delta">{event.delta}</strong>
                <StatusPill tone={event.tone}>{event.status}</StatusPill>
              </article>
            ))}
          </div>
        </section>

        <section className="voice-section" id="voice">
          <VoicePreview />
        </section>

        <section className="evidence-section">
          <div className="evidence-copy">
            <span className="section-kicker">Evidence lineage</span>
            <h2>Every conclusion keeps a path back to what was observed.</h2>
            <p>
              Screenshots, documents, images, video, 3D, URLs, and structured
              records become normalized observations with confidence, provenance,
              freshness, and version history.
            </p>
          </div>
          <div className="evidence-board">
            <div className="evidence-board-top">
              <span>Evidence / Atlas Home Hub</span>
              <span>18 linked items</span>
            </div>
            <div className="evidence-columns">
              <div>
                <span className="evidence-label">Observation</span>
                <strong>Guest checkout removed</strong>
                <p>Captured from web flow · Aug 29 · confidence 0.96</p>
              </div>
              <div className="evidence-arrow" aria-hidden="true">
                →
              </div>
              <div>
                <span className="evidence-label">Derived signal</span>
                <strong>Authentication scope diverged</strong>
                <p>Unexplained Drift · linked to v18 → v19</p>
              </div>
            </div>
            <div className="evidence-source-row">
              <span className="source-icon">PNG</span>
              <span>checkout-flow-2026-08-29.png</span>
              <span className="evidence-source-status">Processed</span>
            </div>
          </div>
        </section>

        <section className="closing" id="contact">
          <div>
            <span className="section-kicker section-kicker-dark">From vision to reality</span>
            <h2>See how products evolve.</h2>
          </div>
          <div className="closing-actions">
            <p>
              Keep the decisions, people, evidence, and change itself in one
              understandable product history.
            </p>
            <a className="button button-brand" href="mailto:hello@langdrift.com">
              Request access
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <Brand compact tone="dark" />
        <span>Visual intelligence for what changes.</span>
        <span>© 2026 Lang Drift</span>
      </footer>
    </>
  )
}
