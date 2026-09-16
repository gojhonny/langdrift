import { AgentOrb } from '@repo/react/ui/agent-orb'
import { Brand } from '@repo/react/ui/brand'
import { DriftCurve } from '@repo/react/ui/drift-curve'
import { Metric } from '@repo/react/ui/metric'
import { StatusPill } from '@repo/react/ui/status-pill'

const nav = [
  ['Overview', '⌁'],
  ['Evolution', '↗'],
  ['Decisions', '◇'],
  ['People', '◎'],
  ['Reports', '▤'],
  ['Evidence', '◫']
]

const signals = [
  {
    title: 'Authentication scope diverged',
    detail: 'No linked decision found for guest access removal.',
    tone: 'unexplained' as const,
    label: 'Unexplained Drift',
    time: '17m ago'
  },
  {
    title: 'Pricing direction moved',
    detail: 'Annual-first packaging matches Q3 decision record.',
    tone: 'intentional' as const,
    label: 'Intentional Evolution',
    time: '2d ago'
  },
  {
    title: 'Export behavior changed',
    detail: 'Scheduled exports no longer represented in v21.',
    tone: 'review' as const,
    label: 'Under Review',
    time: '4d ago'
  }
]

const evidence = [
  ['checkout-flow-2026-08-29.png', 'Visual observation', 'Processed'],
  ['Q3-pricing-review.pdf', 'Decision evidence', 'Processed'],
  ['exports-roadmap.md', 'Vision artifact', 'Processed'],
  ['demo-call-sep-08.mp4', 'Video observation', 'Pending']
]

export default function DashboardPage() {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Brand compact />
        </div>
        <button className="product-switcher" type="button">
          <span className="product-avatar">A</span>
          <span>
            <small>Product</small>
            <strong>Atlas Home Hub</strong>
          </span>
          <span className="switcher-chevron">⌄</span>
        </button>
        <nav aria-label="Product navigation">
          {nav.map(([label, icon], index) => (
            <a className={index === 0 ? 'nav-item nav-item-active' : 'nav-item'} href="#" key={label}>
              <span aria-hidden="true">{icon}</span>
              {label}
            </a>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <a className="nav-item" href="#">
            <span aria-hidden="true">⚙</span> Settings
          </a>
          <div className="account-row">
            <span className="account-avatar">JS</span>
            <span>
              <strong>Jonny Sales</strong>
              <small>Executive workspace</small>
            </span>
          </div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Lang Drift</span>
            <span>/</span>
            <strong>Atlas Home Hub</strong>
          </div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Search" type="button">⌕</button>
            <button className="icon-button" aria-label="Notifications" type="button">○</button>
            <button className="voice-button" type="button">
              <span className="voice-button-orb" aria-hidden="true">
                <AgentOrb size="28px" speed={0.62} state="idle" />
              </span>
              Ask Lang Drift
            </button>
          </div>
        </header>

        <div className="content">
          <div className="page-heading">
            <div>
              <div className="heading-meta">
                <span>Overview</span>
                <span className="demo-badge">Demo workspace</span>
              </div>
              <h1>Product evolution</h1>
              <p>How reality moved relative to Product Vision.</p>
            </div>
            <div className="range-control" aria-label="Time range">
              <button type="button">30d</button>
              <button className="range-active" type="button">90d</button>
              <button type="button">1y</button>
              <button type="button">All</button>
            </div>
          </div>

          <section className="vision-card" aria-labelledby="vision-heading">
            <div className="vision-card-head">
              <div>
                <span className="overline">Product Vision</span>
                <h2 id="vision-heading">Current alignment</h2>
              </div>
              <div className="vision-score">
                <strong>73</strong>
                <span>−18 since Jun 01</span>
              </div>
              <StatusPill tone="review">Needs attention</StatusPill>
            </div>
            <div className="vision-chart">
              <div className="chart-y-axis" aria-hidden="true">
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
              </div>
              <div className="chart-main">
                <DriftCurve height={308} />
                <div className="chart-x-axis" aria-hidden="true">
                  <span>Jun 01</span>
                  <span>Jul 01</span>
                  <span>Aug 01</span>
                  <span>Sep 01</span>
                  <span>Today</span>
                </div>
              </div>
            </div>
            <div className="chart-events">
              <div>
                <span className="event-marker marker-blue" />
                <span><strong>Jun 28</strong> Pricing direction</span>
                <StatusPill tone="intentional">Intentional</StatusPill>
              </div>
              <div>
                <span className="event-marker marker-red" />
                <span><strong>Aug 29</strong> Authentication behavior</span>
                <StatusPill tone="unexplained">Unexplained</StatusPill>
              </div>
              <div>
                <span className="event-marker marker-purple" />
                <span><strong>Sep 08</strong> Export scope</span>
                <StatusPill tone="review">Review</StatusPill>
              </div>
            </div>
          </section>

          <section className="metric-grid" aria-label="Product evolution summary">
            <div className="metric-card">
              <Metric label="Intentional evolution" value="62%" detail="8 of 13 changes" />
              <span className="micro-trend micro-blue">↗ 8%</span>
            </div>
            <div className="metric-card">
              <Metric label="Unexplained drift" value="4" detail="2 high-impact" />
              <span className="micro-trend micro-red">+1 this week</span>
            </div>
            <div className="metric-card">
              <Metric label="Under review" value="2" detail="Awaiting classification" />
              <span className="micro-trend micro-purple">Open</span>
            </div>
            <div className="metric-card">
              <Metric label="Evidence coverage" value="91%" detail="118 of 130 linked" />
              <span className="micro-trend micro-green">Healthy</span>
            </div>
          </section>

          <div className="dashboard-grid">
            <section className="panel signals-panel">
              <div className="panel-head">
                <div>
                  <span className="overline">Signals</span>
                  <h2>What needs attention</h2>
                </div>
                <a href="#">View all →</a>
              </div>
              <div className="signal-list">
                {signals.map((signal) => (
                  <article className="signal-row" key={signal.title}>
                    <div className={`signal-icon signal-icon-${signal.tone}`} aria-hidden="true">↗</div>
                    <div className="signal-copy">
                      <strong>{signal.title}</strong>
                      <span>{signal.detail}</span>
                      <div>
                        <StatusPill tone={signal.tone}>{signal.label}</StatusPill>
                        <small>{signal.time}</small>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="panel decision-panel">
              <div className="panel-head">
                <div>
                  <span className="overline">Decision chain</span>
                  <h2>Latest high-impact move</h2>
                </div>
              </div>
              <div className="decision-timeline">
                <div className="timeline-row">
                  <span className="timeline-dot dot-neutral" />
                  <div>
                    <small>Proposed · Aug 14</small>
                    <strong>Annual-first packaging</strong>
                    <span className="person-inline"><span className="tiny-avatar">AS</span>Ana Silva · Product</span>
                  </div>
                </div>
                <div className="timeline-line" />
                <div className="timeline-row">
                  <span className="timeline-dot dot-blue" />
                  <div>
                    <small>Approved · Aug 18</small>
                    <strong>Q3 commercial review</strong>
                    <span className="person-inline"><span className="tiny-avatar avatar-dark">MR</span>Marina Reis · CEO</span>
                  </div>
                </div>
                <div className="timeline-line" />
                <div className="timeline-row">
                  <span className="timeline-dot dot-orange" />
                  <div>
                    <small>Observed · Aug 22</small>
                    <strong>Pricing UI changed</strong>
                    <span className="person-inline">Evidence linked · Vision −9</span>
                  </div>
                </div>
              </div>
              <div className="decision-foot">
                <StatusPill tone="intentional">Intentional Evolution</StatusPill>
                <a href="#">Open decision →</a>
              </div>
            </section>
          </div>

          <section className="panel evidence-panel">
            <div className="panel-head">
              <div>
                <span className="overline">Evidence</span>
                <h2>Recently processed</h2>
              </div>
              <div className="table-actions">
                <button type="button">Filter</button>
                <button type="button">Add source</button>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Artifact</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Last observed</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {evidence.map(([name, type, status], index) => (
                  <tr key={name}>
                    <td><span className="file-type">{name.split('.').at(-1)?.toUpperCase()}</span>{name}</td>
                    <td>{type}</td>
                    <td><span className={status === 'Pending' ? 'table-status pending' : 'table-status'}>{status}</span></td>
                    <td>{index === 0 ? '17m ago' : `${index + 1}d ago`}</td>
                    <td>{status === 'Pending' ? '—' : `0.${96 - index * 3}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </section>
    </main>
  )
}
