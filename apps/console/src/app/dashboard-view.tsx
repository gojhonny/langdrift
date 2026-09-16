'use client'

import {
  CheckCircle,
  GitBranch,
  ShieldCheck,
  WarningDiamond
} from '@phosphor-icons/react'
import {
  ProductVisionCurve,
  type VisionDriftEvent,
  type VisionPoint
} from '@repo/react/ui/product-vision-curve'
import { AnimatedAvatarGroup, FigmaComment } from '@repo/react/vendors/smoothui'

import {
  type EvolutionClassification,
  type EvolutionGroup,
  useConsoleStore
} from './state'

export type ConsoleSection =
  | 'decisions'
  | 'drift-by-product-area'
  | 'drift-by-team'
  | 'drift-events'
  | 'drift-graph'
  | 'drift-report'
  | 'drift-timeline'
  | 'evidence'
  | 'evolution'
  | 'intentional-drift'
  | 'overview'
  | 'people'
  | 'reports'
  | 'settings'
  | 'unexplained-drift'
  | 'vision-baseline'

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

const driftEvents = visionPoints.flatMap((point) => (point.event ? [point.event] : []))

const titles: Record<ConsoleSection, [string, string]> = {
  decisions: ['Decisions', 'Why product direction changed, who approved it, and what it affected.'],
  'drift-by-product-area': ['Evolution', 'Product-area grouping of Product Vision movement.'],
  'drift-by-team': ['Evolution', 'Team grouping of Product Vision movement.'],
  'drift-events': ['Evolution', 'Important Product Vision events and their classifications.'],
  'drift-graph': ['Evolution', 'How Product Vision moved over time.'],
  'drift-report': ['Reports', 'Executive explanations over a selected period.'],
  'drift-timeline': ['Evolution', 'Product evolution in chronological order.'],
  evidence: ['Evidence', 'Contextual proof behind product conclusions.'],
  evolution: ['Evolution', 'See the curve, filter movement, and inspect the baseline.'],
  'intentional-drift': ['Evolution', 'Intentional Evolution filtered from the same product history.'],
  overview: ['Overview', 'Where we are now, why we moved, and what needs attention.'],
  people: ['People', 'Ownership, decisions, implementation, and review participation.'],
  reports: ['Reports', 'Executive summaries of Product Vision movement and attention items.'],
  settings: ['Settings', 'Workspace appearance and deterministic product context.'],
  'unexplained-drift': ['Evolution', 'Unexplained movement filtered from the same product history.'],
  'vision-baseline': ['Evolution', 'Auditable provenance for the current Vision baseline.']
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
      <span className="demo-label">Demo workspace · illustrative data</span>
    </div>
  )
}

function ClassificationPill({ classification }: { classification: VisionDriftEvent['classification'] }) {
  const labels = {
    baseline: 'Baseline',
    intentional: 'Intentional Evolution',
    review: 'Under Review',
    unexplained: 'Unexplained Drift'
  }
  return (
    <span className={`event-class event-class-${classification}`}>
      {labels[classification]}
    </span>
  )
}

function VisionPanel() {
  const selectedPoint = useConsoleStore((state) => state.selectedPoint)
  const setSelectedPoint = useConsoleStore((state) => state.setSelectedPoint)
  const range = useConsoleStore((state) => state.range)
  const setRange = useConsoleStore((state) => state.setRange)
  const notify = useConsoleStore((state) => state.notify)
  const selectedEventId = visionPoints[selectedPoint]?.event?.id ?? 'exports'

  function selectEvent(event: VisionDriftEvent) {
    const index = visionPoints.findIndex((point) => point.event?.id === event.id)
    if (index >= 0) setSelectedPoint(index)
  }

  return (
    <section className="dashboard-card signature-curve-card">
      <div className="card-heading-row">
        <div>
          <span className="card-kicker">Product Vision</span>
          <strong className="vision-number">73%</strong>
          <small>↓ 18 from the selected baseline</small>
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
      <ProductVisionCurve
        data={visionPoints}
        onSelectEvent={selectEvent}
        selectedEventId={selectedEventId}
      />
      <div className="graph-comment">
        <FigmaComment
          author="Ana"
          initials="AN"
          message="Pricing was intentional. Authentication remains unexplained and exports are still under review."
          onOpenChange={(open) => notify(`Curve comment ${open ? 'opened' : 'closed'}`)}
          timestamp="Aug 20"
        />
      </div>
    </section>
  )
}

function MovementList() {
  const rows = driftEvents.filter((event) => event.classification !== 'baseline')
  return (
    <section className="dashboard-card movement-card">
      <div className="section-card-heading">
        <div>
          <span className="card-kicker">Why did Product Vision move?</span>
          <h2>Three movements explain the current demo state.</h2>
        </div>
        <span className="movement-totals">14 intentional · 4 unexplained</span>
      </div>
      <div className="movement-list">
        {rows.map((event) => (
          <article key={event.id}>
            <b>{event.delta}</b>
            <div>
              <strong>{event.productArea}</strong>
              <span>{event.title}</span>
            </div>
            <AnimatedAvatarGroup
              people={event.actors.map((actor) => ({
                initials: actor.initials,
                name: actor.name,
                role: actor.team
              }))}
              size={26}
            />
            <ClassificationPill classification={event.classification} />
          </article>
        ))}
      </div>
    </section>
  )
}

function Attention() {
  return (
    <section className="attention-grid">
      <article className="dashboard-card attention-card">
        <WarningDiamond aria-hidden="true" size={18} />
        <span className="card-kicker">Needs attention</span>
        <strong>Authentication lacks a recorded product decision.</strong>
        <p>Classified as Unexplained Drift · Carlos · Platform</p>
        <a href="/decisions">Review decision context →</a>
      </article>
      <article className="dashboard-card attention-card">
        <ShieldCheck aria-hidden="true" size={18} />
        <span className="card-kicker">Under review</span>
        <strong>Export behavior changed without final classification.</strong>
        <p>Evidence exists, but the product rationale is still incomplete.</p>
        <a href="/evolution">Inspect evolution →</a>
      </article>
    </section>
  )
}

function Overview() {
  const product = useConsoleStore((state) => state.selectedProduct)
  const range = useConsoleStore((state) => state.range)
  return (
    <>
      <section className="overview-score-grid">
        <article className="dashboard-card overview-primary-score">
          <span className="card-kicker">Product Vision</span>
          <strong>73%</strong>
          <p>↓ 18 from Vision Baseline v1.0</p>
          <div>
            <span>{product}</span>
            <span>{range.toUpperCase()}</span>
            <span>Baseline v1.0</span>
          </div>
        </article>
        <article className="dashboard-card overview-explainer intentional">
          <span>Intentional Evolution</span>
          <strong>14</strong>
          <small>points explained by recorded decisions</small>
        </article>
        <article className="dashboard-card overview-explainer unexplained">
          <span>Unexplained Drift</span>
          <strong>4</strong>
          <small>points still requiring product context</small>
        </article>
      </section>
      <VisionPanel />
      <MovementList />
      <Attention />
    </>
  )
}

function BaselineProvenance() {
  return (
    <section className="dashboard-card baseline-provenance">
      <div className="baseline-provenance-head">
        <div>
          <span className="card-kicker">Current reference</span>
          <h2>Vision Baseline v1.0</h2>
        </div>
        <span>Current</span>
      </div>
      <dl>
        <div><dt>Approved at</dt><dd>Apr 02</dd></div>
        <div><dt>Approved by</dt><dd>Marina Reis · CEO</dd></div>
        <div><dt>Source artifacts</dt><dd>PRD-001 · Product Strategy v3</dd></div>
        <div><dt>Scope</dt><dd>Atlas Home Hub · Core product</dd></div>
        <div><dt>Product areas</dt><dd>Pricing · Authentication · Onboarding · Exports</dd></div>
        <div><dt>Supersedes</dt><dd>Initial founder intent snapshot</dd></div>
        <div><dt>Reason</dt><dd>First organization-approved product reference.</dd></div>
      </dl>
      <small>Illustrative provenance. Baseline approval semantics remain open product work.</small>
    </section>
  )
}

function EvolutionControls() {
  const classification = useConsoleStore((state) => state.classification)
  const groupBy = useConsoleStore((state) => state.groupBy)
  const setClassification = useConsoleStore((state) => state.setClassification)
  const setGroupBy = useConsoleStore((state) => state.setGroupBy)

  const classifications: Array<[EvolutionClassification, string]> = [
    ['all', 'All'],
    ['intentional', 'Intentional'],
    ['unexplained', 'Unexplained'],
    ['review', 'Under Review']
  ]
  const groups: Array<[EvolutionGroup, string]> = [
    ['event', 'Event'],
    ['product-area', 'Product Area'],
    ['team', 'Team']
  ]

  return (
    <div className="evolution-controls">
      <fieldset>
        <legend>Classification</legend>
        {classifications.map(([value, label]) => (
          <button
            data-active={classification === value}
            key={value}
            onClick={() => setClassification(value)}
            type="button"
          >
            {label}
          </button>
        ))}
      </fieldset>
      <fieldset>
        <legend>Group by</legend>
        {groups.map(([value, label]) => (
          <button
            data-active={groupBy === value}
            key={value}
            onClick={() => setGroupBy(value)}
            type="button"
          >
            {label}
          </button>
        ))}
      </fieldset>
    </div>
  )
}

function GroupedEvolution() {
  const classification = useConsoleStore((state) => state.classification)
  const groupBy = useConsoleStore((state) => state.groupBy)
  const filtered = driftEvents.filter(
    (event) => event.classification !== 'baseline' &&
      (classification === 'all' || event.classification === classification)
  )

  if (groupBy === 'product-area') {
    return (
      <section className="dashboard-card comparison-card">
        {filtered.map((event) => (
          <article key={event.id}>
            <strong>{event.productArea}</strong>
            <span>{event.title}</span>
            <b>{event.delta}</b>
            <ClassificationPill classification={event.classification} />
          </article>
        ))}
      </section>
    )
  }

  if (groupBy === 'team') {
    const teams = [
      ['Product', 'Pricing · Exports', '2 decisions'],
      ['Platform', 'Pricing · Authentication', '1 decision · 1 unexplained'],
      ['Leadership', 'Baseline approval', '1 approval']
    ]
    return (
      <section className="dashboard-card comparison-card">
        {teams.map(([team, areas, detail]) => (
          <article key={team}>
            <strong>{team}</strong>
            <span>{areas}</span>
            <b>{detail}</b>
          </article>
        ))}
      </section>
    )
  }

  return (
    <section className="dashboard-card evolution-event-list">
      {filtered.map((event) => (
        <article key={event.id}>
          <time>{event.date}</time>
          <div>
            <strong>{event.title}</strong>
            <span>{event.productArea} · {event.actors.map((actor) => actor.name).join(' + ')}</span>
          </div>
          <b>{event.delta}</b>
          <ClassificationPill classification={event.classification} />
        </article>
      ))}
      {filtered.length === 0 ? <p>No demo events match this filter.</p> : null}
    </section>
  )
}

function Evolution() {
  return (
    <>
      <EvolutionControls />
      <VisionPanel />
      <GroupedEvolution />
      <BaselineProvenance />
    </>
  )
}

function Decisions() {
  const decisions = [
    {
      date: 'Jun 28',
      evidence: ['PRD-014', 'Decision note', 'Review by Marina'],
      impact: 'Pricing · −9',
      people: 'Ana proposed · Marina approved · Carlos implemented',
      title: 'Enterprise packaging model'
    },
    {
      date: 'Jul 22',
      evidence: ['PR #821', 'ADR-042', 'Review by Ana', 'No matching product decision'],
      impact: 'Authentication · −6',
      people: 'Carlos implemented · Ana reviewed',
      title: 'Authentication redesign'
    }
  ]
  return (
    <div className="decision-grid">
      {decisions.map((decision) => (
        <article className="dashboard-card decision-detail" key={decision.title}>
          <GitBranch aria-hidden="true" size={17} />
          <span className="card-kicker">{decision.date}</span>
          <h2>{decision.title}</h2>
          <p>{decision.people}</p>
          <strong>{decision.impact}</strong>
          <details>
            <summary>Why do we believe this?</summary>
            <ul>{decision.evidence.map((item) => <li key={item}>{item}</li>)}</ul>
          </details>
        </article>
      ))}
    </div>
  )
}

function People() {
  return (
    <section className="dashboard-card people-list">
      {[
        ['AN', 'Ana', 'Product Director', '5 decisions · 3 approvals · owns Pricing'],
        ['CA', 'Carlos', 'Engineering Lead', '4 implementations · 2 reviews · owns Authentication'],
        ['MR', 'Marina', 'CEO', '3 approvals · Vision owner'],
        ['LI', 'Lia', 'Design Lead', '3 proposals · owns product navigation']
      ].map(([initials, name, role, detail]) => (
        <article key={name}>
          <span className="person-avatar">{initials}</span>
          <div><strong>{name}</strong><span>{role}</span></div>
          <small>{detail}</small>
        </article>
      ))}
    </section>
  )
}

function Reports() {
  return (
    <div className="report-grid">
      <section className="dashboard-card report-lead">
        <span className="card-kicker">Weekly executive digest</span>
        <h2>Product Vision moved from 79 to 73.</h2>
        <p>Authentication was the largest unresolved contributor. Export behavior remains under review. Pricing movement is linked to an approved decision.</p>
        <small>Demo report · same structured truth as Overview and Voice.</small>
      </section>
      <section className="dashboard-card report-stat intentional">
        <CheckCircle aria-hidden="true" size={20} />
        <strong>14 points</strong>
        <span>intentional evolution</span>
      </section>
      <section className="dashboard-card report-stat unexplained">
        <WarningDiamond aria-hidden="true" size={20} />
        <strong>4 points</strong>
        <span>unexplained drift</span>
      </section>
    </div>
  )
}

function Evidence() {
  return (
    <section className="dashboard-card compact-table-card">
      <div className="context-warning">Evidence is a contextual drill-down, not a primary executive destination.</div>
      <table>
        <thead><tr><th>Artifact</th><th>Observation</th><th>Status</th></tr></thead>
        <tbody>
          {[
            ['PR #821', 'Authentication implementation changed', 'Linked'],
            ['ADR-042', 'Enterprise authentication strategy', 'Linked'],
            ['exports-roadmap.md', 'Export behavior changed', 'Under Review']
          ].map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}
        </tbody>
      </table>
    </section>
  )
}

function Settings() {
  const theme = useConsoleStore((state) => state.theme)
  const setTheme = useConsoleStore((state) => state.setTheme)
  const notify = useConsoleStore((state) => state.notify)
  return (
    <section className="dashboard-card settings-list">
      <div>
        <span><strong>Appearance</strong><small>Light and dark are first-class product themes.</small></span>
        <button onClick={() => {
          const next = theme === 'light' ? 'dark' : 'light'
          setTheme(next)
          notify(`${next} theme selected`)
        }} type="button">Use {theme === 'light' ? 'dark' : 'light'}</button>
      </div>
      <div>
        <span><strong>Demo workspace</strong><small>Illustrative values must remain disclosed until the real product model exists.</small></span>
        <button onClick={() => notify('Demo disclosure confirmed', 'success')} type="button">Review</button>
      </div>
      <div>
        <span><strong>Executive Voice</strong><small>Initial Voice stays deterministic over structured product context.</small></span>
        <button onClick={() => notify('Voice policy opened')} type="button">View policy</button>
      </div>
    </section>
  )
}

function LegacyEvolution({ classification }: { classification?: EvolutionClassification }) {
  const setClassification = useConsoleStore((state) => state.setClassification)
  if (classification) setClassification(classification)
  return <Evolution />
}

export function DashboardView({ section }: { section: ConsoleSection }) {
  return (
    <>
      <Heading section={section} />
      {section === 'overview' ? <Overview /> : null}
      {section === 'evolution' ? <Evolution /> : null}
      {section === 'decisions' ? <Decisions /> : null}
      {section === 'people' ? <People /> : null}
      {section === 'reports' || section === 'drift-report' ? <Reports /> : null}
      {section === 'settings' ? <Settings /> : null}
      {section === 'vision-baseline' ? <BaselineProvenance /> : null}
      {section === 'drift-graph' || section === 'drift-timeline' || section === 'drift-events' ? <Evolution /> : null}
      {section === 'drift-by-team' || section === 'drift-by-product-area' ? <Evolution /> : null}
      {section === 'intentional-drift' ? <LegacyEvolution classification="intentional" /> : null}
      {section === 'unexplained-drift' ? <LegacyEvolution classification="unexplained" /> : null}
      {section === 'evidence' ? <Evidence /> : null}
    </>
  )
}
