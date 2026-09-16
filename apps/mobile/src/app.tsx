import { AgentOrb } from '@repo/react/ui/agent-orb'
import { Brand } from '@repo/react/ui/brand'
import { StatusPill } from '@repo/react/ui/status-pill'
import { useState } from 'react'

type Tab = 'Connect' | 'Library' | 'Signals' | 'Studio'

const tabs: Array<{ label: Tab; icon: string }> = [
  { label: 'Studio', icon: '⌁' },
  { label: 'Library', icon: '▤' },
  { label: 'Signals', icon: '↗' },
  { label: 'Connect', icon: '⊕' }
]

const signals = [
  {
    title: 'Authentication scope diverged',
    label: 'Unexplained Drift',
    tone: 'unexplained' as const,
    time: '17m'
  },
  {
    title: 'Export scope changed',
    label: 'Under Review',
    tone: 'review' as const,
    time: '4d'
  }
]

function Studio() {
  return (
    <>
      <section className="mobile-hero-card">
        <div className="mobile-hero-top">
          <div>
            <span className="micro-label">Product Vision</span>
            <strong>73</strong>
          </div>
          <StatusPill tone="review">Needs attention</StatusPill>
        </div>
        <div className="mobile-drift-visual" aria-label="Product Vision moved from 91 to 73">
          <svg viewBox="0 0 320 112" preserveAspectRatio="none" role="img">
            <defs>
              <linearGradient id="mobile-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--ld-brand)" stopOpacity="0.22" />
                <stop offset="100%" stopColor="var(--ld-brand)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 22 C60 17 82 24 116 42 S174 49 203 68 S260 68 320 91 L320 112 L0 112 Z" fill="url(#mobile-fill)" />
            <path d="M0 22 C60 17 82 24 116 42 S174 49 203 68 S260 68 320 91" fill="none" stroke="var(--ld-brand)" strokeLinecap="round" strokeWidth="4" />
            <circle cx="203" cy="68" r="5" fill="#151517" stroke="var(--ld-unexplained)" strokeWidth="3" />
          </svg>
        </div>
        <div className="mobile-score-foot">
          <span>91 · Jun</span>
          <span className="negative">−18 points</span>
          <span>73 · Today</span>
        </div>
      </section>

      <section className="compact-section">
        <div className="section-title-row">
          <div>
            <span className="micro-label">Active drift</span>
            <h2>What moved</h2>
          </div>
          <button type="button">See all</button>
        </div>
        <article className="drift-card">
          <div className="drift-card-icon drift-card-icon-red">↗</div>
          <div className="drift-card-copy">
            <strong>Authentication behavior changed</strong>
            <p>Guest access disappeared without a linked decision.</p>
            <div className="drift-card-meta">
              <StatusPill tone="unexplained">Unexplained</StatusPill>
              <span>−6 Vision pts</span>
            </div>
          </div>
        </article>
      </section>

      <section className="compact-section">
        <div className="section-title-row">
          <div>
            <span className="micro-label">Recent evidence</span>
            <h2>Observed</h2>
          </div>
        </div>
        <div className="mobile-list-card">
          <div className="evidence-row-mobile">
            <span className="file-chip">PNG</span>
            <div>
              <strong>checkout-flow-2026-08-29.png</strong>
              <span>Processed · confidence 0.96</span>
            </div>
            <span className="row-chevron">›</span>
          </div>
          <div className="evidence-row-mobile">
            <span className="file-chip">PDF</span>
            <div>
              <strong>Q3-pricing-review.pdf</strong>
              <span>Decision evidence · 2d ago</span>
            </div>
            <span className="row-chevron">›</span>
          </div>
        </div>
      </section>
    </>
  )
}

function Library() {
  return (
    <section className="tab-view">
      <span className="micro-label">Library</span>
      <h1>Evidence stays attached to the story.</h1>
      <div className="filter-pills">
        <button className="filter-active" type="button">All</button>
        <button type="button">Visual</button>
        <button type="button">Docs</button>
        <button type="button">Decisions</button>
      </div>
      <div className="library-grid">
        {[
          ['PNG', 'Checkout flow', 'Visual observation · 17m'],
          ['PDF', 'Q3 pricing review', 'Decision evidence · 2d'],
          ['MP4', 'Product demo', 'Video observation · 4d'],
          ['MD', 'Export roadmap', 'Vision artifact · 6d']
        ].map(([type, title, detail]) => (
          <article className="library-card" key={title}>
            <span className="library-type">{type}</span>
            <strong>{title}</strong>
            <span>{detail}</span>
          </article>
        ))}
      </div>
    </section>
  )
}

function Signals() {
  return (
    <section className="tab-view">
      <span className="micro-label">Signals</span>
      <h1>Evidence-backed facts that need attention.</h1>
      <div className="signal-summary">
        <div><strong>4</strong><span>Unexplained</span></div>
        <div><strong>2</strong><span>Review</span></div>
        <div><strong>8</strong><span>Intentional</span></div>
      </div>
      <div className="mobile-list-card">
        {signals.map((signal) => (
          <div className="signal-row-mobile" key={signal.title}>
            <div>
              <strong>{signal.title}</strong>
              <StatusPill tone={signal.tone}>{signal.label}</StatusPill>
            </div>
            <span>{signal.time}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function Connect() {
  return (
    <section className="tab-view">
      <span className="micro-label">Connect</span>
      <h1>Keep observation sources close to the model.</h1>
      <div className="connect-list">
        {[
          ['Web', 'Website observation', 'Connected', '●'],
          ['Drive', 'Product documents', 'Connected', '●'],
          ['Figma', 'Design evidence', 'Not connected', '○'],
          ['Linear', 'Decision context', 'Not connected', '○']
        ].map(([name, detail, state, dot]) => (
          <button className="connect-row" type="button" key={name}>
            <span className="connect-logo">{name.slice(0, 1)}</span>
            <span><strong>{name}</strong><small>{detail}</small></span>
            <span className={state === 'Connected' ? 'connected' : 'disconnected'}>{dot} {state}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Studio')
  const view = {
    Studio: <Studio />,
    Library: <Library />,
    Signals: <Signals />,
    Connect: <Connect />
  }[activeTab]

  return (
    <div className="mobile-app" data-theme="dark">
      <header className="mobile-header">
        <Brand compact tone="dark" />
        <button className="profile-button" aria-label="Open profile" type="button">JS</button>
      </header>

      <div className="product-context">
        <div>
          <span className="product-context-mark">A</span>
          <span>
            <small>Product</small>
            <strong>Atlas Home Hub</strong>
          </span>
        </div>
        <button aria-label="Switch product" type="button">⌄</button>
      </div>

      <main className="mobile-content">{view}</main>

      <button className="floating-voice" aria-label="Ask Lang Drift by voice" type="button">
        <AgentOrb size="46px" speed={0.72} state="idle" />
      </button>

      <nav className="bottom-nav" aria-label="Primary">
        {tabs.map((tab) => (
          <button
            className={activeTab === tab.label ? 'bottom-tab bottom-tab-active' : 'bottom-tab'}
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            type="button"
          >
            <span aria-hidden="true">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
