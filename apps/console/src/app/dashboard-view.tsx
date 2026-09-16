'use client'

import {
  CheckCircle,
  GitBranch,
  ShieldCheck,
  WarningDiamond
} from '@phosphor-icons/react'
import { CompactDriftChart } from '@repo/react/vendors/shadcn'
import {
  AnimatedAvatarGroup,
  FigmaComment,
  Scrubber
} from '@repo/react/vendors/smoothui'

import { useConsoleStore } from './state'

export type ConsoleSection =
  | 'overview'
  | 'vision-baseline'
  | 'drift-graph'
  | 'drift-report'
  | 'drift-timeline'
  | 'drift-events'
  | 'drift-by-team'
  | 'drift-by-product-area'
  | 'intentional-drift'
  | 'unexplained-drift'
  | 'decisions'
  | 'people'
  | 'evidence'
  | 'settings'

const curve = [
  { label: 'Apr', value: 100 },
  { label: 'May', value: 95 },
  { label: 'Jun', value: 95 },
  { label: 'Jul', value: 85 },
  { label: 'Aug', value: 73 }
]

const changes = [
  { date: 'Apr 02', delta: '—', title: 'Vision baseline approved', type: 'Baseline' },
  { date: 'May 11', delta: '−5', title: 'Navigation scope clarified', type: 'Intentional' },
  { date: 'Jun 28', delta: '−9', title: 'Pricing strategy changed', type: 'Intentional' },
  { date: 'Jul 22', delta: '−6', title: 'Authentication redesigned', type: 'Unexplained' },
  { date: 'Aug 14', delta: '−3', title: 'Export rules changed', type: 'Review' }
]

const titles: Record<ConsoleSection, [string, string]> = {
  overview: ['Overview', 'Product evolution at a glance.'],
  'vision-baseline': ['Vision Baseline', 'The recorded compare target for product evolution.'],
  'drift-graph': ['Drift Graph', 'How Product Vision moved over time.'],
  'drift-report': ['Drift Report', 'A concise executive explanation of what changed.'],
  'drift-timeline': ['Drift Timeline', 'Decision and observation history in chronological order.'],
  'drift-events': ['Drift Events', 'Discrete movements with classification and evidence.'],
  'drift-by-team': ['Drift by Team', 'Where changes concentrate across ownership boundaries.'],
  'drift-by-product-area': ['Drift by Product Area', 'How product areas contribute to movement.'],
  'intentional-drift': ['Intentional Drift', 'Recorded evolution that intentionally moved from baseline.'],
  'unexplained-drift': ['Unexplained Drift', 'Movement without enough recorded rationale.'],
  decisions: ['Decisions', 'The decisions that explain why Product Vision moved.'],
  people: ['People', 'Human attribution across proposals, approvals, and implementation.'],
  evidence: ['Evidence', 'The observation trail behind every important conclusion.'],
  settings: ['Settings', 'Workspace appearance and deterministic product context.']
}

function Heading({ section }: { section: ConsoleSection }) {
  const [title, description] = titles[section]
  return (
    <div className="dashboard-heading">
      <div>
        <span>{title}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <span className="demo-label">Demo workspace</span>
    </div>
  )
}

function DriftGraph() {
  const selectedPoint = useConsoleStore((state) => state.selectedPoint)
  const setSelectedPoint = useConsoleStore((state) => state.setSelectedPoint)
  const range = useConsoleStore((state) => state.range)
  const setRange = useConsoleStore((state) => state.setRange)
  const notify = useConsoleStore((state) => state.notify)
  const active = changes[selectedPoint] ?? changes[changes.length - 1]

  return (
    <section className="dashboard-card drift-graph-card">
      <div className="card-heading-row">
        <div>
          <span className="card-kicker">Product Vision</span>
          <strong className="vision-number">73%</strong>
        </div>
        <fieldset aria-label="Time range" className="range-control">
          {(['30d', '90d', '1y', 'all'] as const).map((item) => (
            <button
              data-active={range === item}
              key={item}
              onClick={() => {
                setRange(item)
                notify(`${item.toUpperCase()} range selected`)
              }}
              type="button"
            >
              {item}
            </button>
          ))}
        </fieldset>
      </div>
      <CompactDriftChart activeIndex={selectedPoint} data={curve} height={146} />
      <Scrubber
        label="Event"
        max={curve.length - 1}
        onChange={setSelectedPoint}
        value={selectedPoint}
      />
      <div className="drift-event-focus">
        <div>
          <small>{active.date} · What happened?</small>
          <strong>{active.title}</strong>
        </div>
        <span>{active.delta}</span>
        <AnimatedAvatarGroup
          people={[
            { initials: 'AN', name: 'Ana', role: 'Product' },
            { initials: 'CA', name: 'Carlos', role: 'Engineering' }
          ]}
        />
        <span className={`event-class event-class-${active.type.toLowerCase()}`}>{active.type}</span>
      </div>
      <div className="graph-comment">
        <FigmaComment
          author="Ana"
          initials="AN"
          message="The line moved because pricing and authentication changed. Export scope remains under review."
          onOpenChange={(open) => notify(`Chart comment ${open ? 'opened' : 'closed'}`)}
          timestamp="Aug 20"
        />
      </div>
    </section>
  )
}

function ReasonCard() {
  return (
    <section className="dashboard-card reason-detail-card">
      <div className="card-heading-row">
        <div>
          <span className="card-kicker">Why did it happen?</span>
          <h2>Ana + Carlos changed the pricing strategy.</h2>
        </div>
        <AnimatedAvatarGroup
          people={[
            { initials: 'AN', name: 'Ana', role: 'Product' },
            { initials: 'CA', name: 'Carlos', role: 'Engineering' }
          ]}
          size={30}
        />
      </div>
      <div className="reason-grid">
        <div><span>Reason</span><strong>Enterprise customers required a different packaging model.</strong></div>
        <div><span>Impact</span><strong>Pricing, onboarding and billing.</strong></div>
        <div><span>Decision</span><strong>Recorded ✓</strong></div>
      </div>
    </section>
  )
}

function Overview() {
  return (
    <>
      <div className="metric-row">
        <article><span>Product Vision</span><strong>73%</strong><small>−27 from baseline</small></article>
        <article><span>Intentional evolution</span><strong>14</strong><small>points explained</small></article>
        <article><span>Unexplained drift</span><strong>4</strong><small>points need review</small></article>
        <article><span>Evidence coverage</span><strong>91%</strong><small>118 / 130 linked</small></article>
      </div>
      <DriftGraph />
      <ReasonCard />
    </>
  )
}

function Baseline() {
  return (
    <section className="dashboard-card baseline-card">
      <div className="baseline-score"><TargetIcon /><span>Vision v1.0</span><strong>100</strong></div>
      <div className="baseline-grid">
        {[
          ['Audience', 'Enterprise product leaders'],
          ['Commercial model', 'Usage-first with team expansion'],
          ['Access', 'SSO + role-scoped workspaces'],
          ['Export', 'CSV + scheduled reporting'],
          ['Voice', 'Executive deterministic inquiry'],
          ['Evidence', 'Versioned observations and decisions']
        ].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
      </div>
    </section>
  )
}

function TargetIcon() {
  return <ShieldCheck aria-hidden="true" size={18} weight="duotone" />
}

function Report() {
  return (
    <div className="report-grid">
      <section className="dashboard-card report-lead"><span className="card-kicker">Executive summary</span><h2>Vision moved 27 points since April.</h2><p>Most movement is explained by deliberate pricing and navigation decisions. Authentication and export rules account for the unresolved portion.</p></section>
      <section className="dashboard-card report-stat intentional"><CheckCircle aria-hidden="true" size={20} /><strong>14 points</strong><span>intentional evolution</span></section>
      <section className="dashboard-card report-stat unexplained"><WarningDiamond aria-hidden="true" size={20} /><strong>4 points</strong><span>unexplained drift</span></section>
    </div>
  )
}

function Timeline() {
  return (
    <section className="dashboard-card timeline-card">
      {changes.map((event, index) => (
        <article key={event.date}>
          <span className="timeline-index">{String(index + 1).padStart(2, '0')}</span>
          <time>{event.date}</time>
          <strong>{event.title}</strong>
          <span>{event.delta}</span>
          <span className={`event-class event-class-${event.type.toLowerCase()}`}>{event.type}</span>
        </article>
      ))}
    </section>
  )
}

function Events() {
  return (
    <section className="dashboard-card compact-table-card">
      <table>
        <thead><tr><th>Date</th><th>Event</th><th>Impact</th><th>Classification</th><th>Owner</th></tr></thead>
        <tbody>
          {changes.slice(1).map((event, index) => (
            <tr key={event.date}><td>{event.date}</td><td>{event.title}</td><td>{event.delta}</td><td><span className={`event-class event-class-${event.type.toLowerCase()}`}>{event.type}</span></td><td>{index % 2 === 0 ? 'Ana' : 'Carlos'}</td></tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function Comparison({ type }: { type: 'area' | 'team' }) {
  const items = type === 'team'
    ? [['Product', '−12', '8 explained'], ['Engineering', '−9', '6 explained'], ['Design', '−4', '3 explained'], ['GTM', '−2', '1 explained']]
    : [['Pricing', '−9', 'Intentional'], ['Authentication', '−6', 'Unexplained'], ['Export', '−3', 'Review'], ['Navigation', '−5', 'Intentional']]

  return (
    <section className="dashboard-card comparison-card">
      {items.map(([label, delta, detail]) => {
        const magnitude = Math.abs(Number.parseInt(delta.replace('−', '-'), 10))
        return (
          <article key={label}><strong>{label}</strong><span>{detail}</span><b>{delta}</b><div><i style={{ width: `${Math.min(92, magnitude * 8)}%` }} /></div></article>
        )
      })}
    </section>
  )
}

function ClassifiedList({ intentional }: { intentional: boolean }) {
  const rows = intentional
    ? [['Pricing strategy changed', '−9', 'Decision recorded'], ['Navigation scope clarified', '−5', 'Decision recorded']]
    : [['Authentication redesigned', '−6', 'No linked decision'], ['Export rules changed', '−3', 'Classification pending']]
  return (
    <section className="dashboard-card classified-list">
      {rows.map(([title, delta, detail]) => (
        <article key={title}><span className={intentional ? 'classification-icon intentional' : 'classification-icon unexplained'}>{intentional ? <CheckCircle aria-hidden="true" /> : <WarningDiamond aria-hidden="true" />}</span><div><strong>{title}</strong><span>{detail}</span></div><b>{delta}</b></article>
      ))}
    </section>
  )
}

function Decisions() {
  return (
    <div className="decision-grid">
      {[
        ['Aug 14', 'Enterprise packaging model', 'Ana proposed · Marina approved', 'Pricing −9'],
        ['May 11', 'Navigation scope', 'Lia proposed · Ana approved', 'Navigation −5'],
        ['Apr 02', 'Vision baseline', 'Leadership approved', 'Baseline 100']
      ].map(([date, title, people, impact]) => (
        <article className="dashboard-card" key={date}><GitBranch aria-hidden="true" size={17} /><span className="card-kicker">{date}</span><h2>{title}</h2><p>{people}</p><strong>{impact}</strong></article>
      ))}
    </div>
  )
}

function People() {
  return (
    <section className="dashboard-card people-list">
      {[
        ['AN', 'Ana', 'Product Director', '5 decisions · 12 attributed points'],
        ['CA', 'Carlos', 'Engineering Lead', '4 implementations · 9 attributed points'],
        ['MR', 'Marina', 'CEO', '3 approvals · Vision owner'],
        ['LI', 'Lia', 'Design Lead', '3 proposals · 4 attributed points']
      ].map(([initials, name, role, detail]) => (
        <article key={name}><span className="person-avatar">{initials}</span><div><strong>{name}</strong><span>{role}</span></div><small>{detail}</small></article>
      ))}
    </section>
  )
}

function Evidence() {
  return (
    <section className="dashboard-card compact-table-card">
      <table><thead><tr><th>Artifact</th><th>Observation</th><th>Confidence</th><th>Status</th></tr></thead><tbody>
        {[
          ['pricing-review.pdf', 'Pricing strategy approved', '0.99', 'Linked'],
          ['checkout-flow.png', 'Guest checkout removed', '0.96', 'Linked'],
          ['exports-roadmap.md', 'Scheduled exports absent', '0.91', 'Review'],
          ['product-demo.mp4', 'Navigation behavior changed', '0.87', 'Linked']
        ].map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}
      </tbody></table>
    </section>
  )
}

function Settings() {
  const theme = useConsoleStore((state) => state.theme)
  const setTheme = useConsoleStore((state) => state.setTheme)
  const notify = useConsoleStore((state) => state.notify)
  return (
    <section className="dashboard-card settings-list">
      <div><span><strong>Appearance</strong><small>Light and dark are first-class product themes.</small></span><button onClick={() => { const next = theme === 'light' ? 'dark' : 'light'; setTheme(next); notify(`${next} theme selected`) }} type="button">Use {theme === 'light' ? 'dark' : 'light'}</button></div>
      <div><span><strong>Evidence refresh</strong><small>Controls are visual only until ingestion is connected.</small></span><button onClick={() => notify('Evidence refresh requested', 'success')} type="button">Refresh</button></div>
      <div><span><strong>Executive Voice</strong><small>Queries structured product data only.</small></span><button onClick={() => notify('Voice policy opened')} type="button">View policy</button></div>
    </section>
  )
}

export function DashboardView({ section }: { section: ConsoleSection }) {
  return (
    <>
      <Heading section={section} />
      {section === 'overview' ? <Overview /> : null}
      {section === 'vision-baseline' ? <Baseline /> : null}
      {section === 'drift-graph' ? <><DriftGraph /><ReasonCard /></> : null}
      {section === 'drift-report' ? <Report /> : null}
      {section === 'drift-timeline' ? <Timeline /> : null}
      {section === 'drift-events' ? <Events /> : null}
      {section === 'drift-by-team' ? <Comparison type="team" /> : null}
      {section === 'drift-by-product-area' ? <Comparison type="area" /> : null}
      {section === 'intentional-drift' ? <ClassifiedList intentional /> : null}
      {section === 'unexplained-drift' ? <ClassifiedList intentional={false} /> : null}
      {section === 'decisions' ? <Decisions /> : null}
      {section === 'people' ? <People /> : null}
      {section === 'evidence' ? <Evidence /> : null}
      {section === 'settings' ? <Settings /> : null}
    </>
  )
}
