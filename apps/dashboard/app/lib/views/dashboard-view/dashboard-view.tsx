'use client'

// Illustrative product values are frontend fixtures; this is not the Product Vision scoring contract.
import {
  CheckCircle,
  GitBranch,
  ShieldCheck,
  WarningDiamond
} from '@phosphor-icons/react'
import { aiAvatars } from '@repo/react/ui/ai-avatars'
import {
  ProductVisionCurve,
  type VisionDriftEvent,
  type VisionPoint
} from '@repo/react/ui/product-vision-curve'
import { ThemeToggle } from '@repo/react/ui/theme-toggle'
import { AnimatedAvatarGroup, FigmaComment } from '@repo/react/vendors/smoothui'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import Image from 'next/image'

import {
  classificationAtom,
  type EvolutionClassification,
  type EvolutionGroup,
  groupByAtom,
  rangeAtom,
  selectedPointAtom,
  selectedProductAtom,
  themeAtom
} from '@state/state'
import { Card, cx, Kicker } from '@template/ui'

export type DashboardSection =
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
      actors: [
        {
          initials: 'MR',
          name: 'Marina Reis',
          src: aiAvatars.marina,
          team: 'Leadership'
        }
      ],
      classification: 'baseline',
      date: 'Apr 02',
      decision: 'Vision baseline recorded',
      delta: 0,
      id: 'baseline',
      productArea: 'Vision',
      reason:
        'Leadership recorded the product direction used as the reference for this period.',
      title: 'Vision baseline approved'
    }
  },
  { label: 'May', value: 88 },
  {
    label: 'Jun',
    value: 84,
    event: {
      actors: [
        { initials: 'AN', name: 'Ana', src: aiAvatars.ana, team: 'Product' },
        {
          initials: 'CA',
          name: 'Carlos',
          src: aiAvatars.carlos,
          team: 'Platform'
        }
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
      actors: [
        {
          initials: 'CA',
          name: 'Carlos',
          src: aiAvatars.carlos,
          team: 'Platform'
        }
      ],
      classification: 'unexplained',
      date: 'Jul 22',
      decision: 'Decision not found',
      delta: -6,
      id: 'authentication',
      productArea: 'Authentication',
      reason: 'No matching product decision was found.',
      title: 'Authentication redesigned'
    }
  },
  {
    label: 'Aug',
    value: 73,
    event: {
      actors: [
        { initials: 'AN', name: 'Ana', src: aiAvatars.ana, team: 'Product' }
      ],
      classification: 'review',
      date: 'Aug 20',
      decision: 'Review pending',
      delta: -3,
      id: 'exports',
      productArea: 'Exports',
      reason: 'Evidence exists, but the product rationale is still incomplete.',
      title: 'Export behavior changed'
    }
  }
]

const driftEvents = visionPoints.flatMap((point) =>
  point.event ? [point.event] : []
)

const titles: Record<DashboardSection, [string, string]> = {
  decisions: [
    'Decisions',
    'Why product direction changed, who approved it, and what it affected.'
  ],
  'drift-by-product-area': [
    'Evolution',
    'Product-area grouping of Product Vision movement.'
  ],
  'drift-by-team': ['Evolution', 'Team grouping of Product Vision movement.'],
  'drift-events': [
    'Evolution',
    'Important Product Vision events and their classifications.'
  ],
  'drift-graph': ['Evolution', 'How Product Vision moved over time.'],
  'drift-report': ['Reports', 'Executive explanations over a selected period.'],
  'drift-timeline': ['Evolution', 'Product evolution in chronological order.'],
  evidence: ['Evidence', 'Contextual proof behind product conclusions.'],
  evolution: [
    'Evolution',
    'See the curve, filter movement, and inspect the baseline.'
  ],
  'intentional-drift': [
    'Evolution',
    'Intentional Evolution filtered from the same product history.'
  ],
  overview: [
    'Overview',
    'Where we are now, why we moved, and what needs attention.'
  ],
  people: [
    'People',
    'Ownership, decisions, implementation, and review participation.'
  ],
  reports: [
    'Reports',
    'Executive summaries of Product Vision movement and attention items.'
  ],
  settings: [
    'Settings',
    'Workspace appearance and deterministic product context.'
  ],
  'unexplained-drift': [
    'Evolution',
    'Unexplained movement filtered from the same product history.'
  ],
  'vision-baseline': [
    'Evolution',
    'Auditable provenance for the current Vision baseline.'
  ]
}

function Heading({ section }: { section: DashboardSection }) {
  const [title, description] = titles[section]
  return (
    <div className="mb-[22px] flex items-end justify-between max-sm:flex-col max-sm:items-start max-sm:gap-2">
      <div className="grid min-w-0 gap-[3px]">
        <Kicker>{title}</Kicker>
        <h1 className="m-0 text-[27px] font-medium tracking-[-0.035em] max-sm:text-[27px]">
          {title}
        </h1>
        <p className="m-0 mt-0.5 text-[11px] text-muted">{description}</p>
      </div>
    </div>
  )
}

function ClassificationPill({
  className,
  classification
}: {
  className?: string
  classification: VisionDriftEvent['classification']
}) {
  const labels = {
    baseline: 'Baseline',
    intentional: 'Intentional Evolution',
    review: 'Under Review',
    unexplained: 'Unexplained Drift'
  }
  return (
    <span
      className={cx(
        'rounded-full border border-hairline px-1.5 py-1 text-[8px]',
        className,
        classification === 'intentional' && 'text-intentional',
        classification === 'unexplained' && 'text-unexplained',
        classification === 'review' && 'text-review',
        classification === 'baseline' && 'text-muted'
      )}
    >
      {labels[classification]}
    </span>
  )
}

function VisionPanel() {
  const [selectedPoint, setSelectedPoint] = useAtom(selectedPointAtom)
  const [range, setRange] = useAtom(rangeAtom)
  const selectedEventId = visionPoints[selectedPoint]?.event?.id ?? 'exports'

  function selectEvent(event: VisionDriftEvent) {
    const index = visionPoints.findIndex(
      (point) => point.event?.id === event.id
    )
    if (index >= 0) setSelectedPoint(index)
  }

  return (
    <Card className="relative mb-2.5 p-4">
      <div className="mb-1 flex items-start justify-between gap-2.5 max-sm:flex-wrap">
        <div className="grid min-w-0 gap-[5px]">
          <Kicker>Product Vision</Kicker>
          <strong className="text-[28px] font-medium tracking-[-0.045em]">
            73%
          </strong>
          <small className="text-[8px] text-muted">
            ↓ 18 from the selected baseline
          </small>
        </div>
        <fieldset
          aria-label="Time range"
          className="m-0 inline-flex min-w-0 rounded-md border-0 bg-subtle p-0.5"
        >
          {(['30d', '90d', '1y', 'all'] as const).map((item) => (
            <button
              className={cx(
                'min-h-6 cursor-pointer rounded-[5px] border-0 bg-transparent px-2 text-[8px] text-muted',
                range === item &&
                  'bg-surface text-ink shadow-[0_1px_4px_rgba(0,0,0,.08)]'
              )}
              key={item}
              onClick={() => setRange(item)}
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
      <div className="absolute top-12 right-3.5 max-sm:static max-sm:mt-2.5">
        <FigmaComment
          author="Ana"
          initials="AN"
          message="Pricing was intentional. Authentication remains unexplained and exports are still under review."
          src={aiAvatars.ana}
          timestamp="Aug 20"
        />
      </div>
    </Card>
  )
}

function MovementList() {
  const rows = driftEvents.filter(
    (event) => event.classification !== 'baseline'
  )
  return (
    <Card className="mb-2.5 p-4">
      <div className="mb-3 flex items-end justify-between gap-4 max-sm:flex-wrap max-sm:items-start max-sm:gap-2.5">
        <div className="grid min-w-0 gap-[5px]">
          <Kicker>Why did Product Vision move?</Kicker>
          <h2 className="m-0 text-[17px] font-medium">
            Three movements explain the current state.
          </h2>
        </div>
        <span className="font-mono text-[8px] text-muted">
          14 intentional · 4 unexplained
        </span>
      </div>
      <div className="border-t border-hairline">
        {rows.map((event) => (
          <article
            className="grid min-h-[58px] items-center gap-2.5 border-b border-hairline last:border-b-0 max-sm:grid-cols-[34px_minmax(0,1fr)_auto] max-sm:py-2.5 min-[621px]:grid-cols-[38px_minmax(0,1fr)_auto_auto]"
            key={event.id}
          >
            <b className="font-mono text-[11px]">{event.delta}</b>
            <div className="grid gap-0.5">
              <strong className="text-[10px]">{event.productArea}</strong>
              <span className="text-[8px] text-muted">{event.title}</span>
            </div>
            <AnimatedAvatarGroup
              people={event.actors.map((actor) => ({
                initials: actor.initials,
                name: actor.name,
                role: actor.team,
                src: actor.src
              }))}
              size={26}
            />
            <ClassificationPill
              className="max-sm:col-start-2 max-sm:justify-self-start"
              classification={event.classification}
            />
          </article>
        ))}
      </div>
    </Card>
  )
}

function Attention() {
  return (
    <section className="grid grid-cols-1 gap-2.5 min-[881px]:grid-cols-2">
      <Card as="article" className="grid min-h-[170px] gap-[7px] p-4">
        <WarningDiamond
          aria-hidden="true"
          className="text-unexplained"
          size={18}
        />
        <Kicker>Needs attention</Kicker>
        <strong className="text-sm leading-snug font-medium">
          Authentication lacks a recorded product decision.
        </strong>
        <p className="m-0 text-[9px] leading-snug text-muted">
          Classified as Unexplained Drift · Carlos · Platform
        </p>
        <a className="self-end text-[9px] no-underline" href="/decisions">
          Review decision context →
        </a>
      </Card>
      <Card as="article" className="grid min-h-[170px] gap-[7px] p-4">
        <ShieldCheck aria-hidden="true" className="text-review" size={18} />
        <Kicker>Under review</Kicker>
        <strong className="text-sm leading-snug font-medium">
          Export behavior changed without final classification.
        </strong>
        <p className="m-0 text-[9px] leading-snug text-muted">
          Evidence exists, but the product rationale is still incomplete.
        </p>
        <a className="self-end text-[9px] no-underline" href="/evolution">
          Inspect evolution →
        </a>
      </Card>
    </section>
  )
}

function Overview() {
  const product = useAtomValue(selectedProductAtom)
  const range = useAtomValue(rangeAtom)
  return (
    <>
      <section className="mb-2.5 grid grid-cols-1 gap-2.5 min-[621px]:grid-cols-2 min-[881px]:grid-cols-[minmax(0,2fr)_minmax(170px,1fr)_minmax(170px,1fr)]">
        <Card
          as="article"
          className="grid min-h-[132px] gap-[5px] p-4 min-[621px]:col-span-2 min-[881px]:col-span-1"
        >
          <Kicker>Product Vision</Kicker>
          <strong className="text-5xl leading-none font-medium tracking-[-0.055em]">
            73%
          </strong>
          <p className="m-0 text-[10px] text-muted">
            ↓ 18 from Vision Baseline v1.0
          </p>
          <div className="mt-auto flex items-center gap-2">
            {[product, range.toUpperCase(), 'Baseline v1.0'].map((item) => (
              <span
                className="rounded-full border border-hairline px-1.5 py-1 text-[8px] text-muted"
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
        </Card>
        <Card
          as="article"
          className="grid min-h-[132px] content-end gap-[5px] p-4"
        >
          <span className="text-[9px] text-muted">Intentional Evolution</span>
          <strong className="text-[30px] font-medium text-intentional">
            14
          </strong>
          <small className="text-[8px] leading-snug text-muted">
            points explained by recorded decisions
          </small>
        </Card>
        <Card
          as="article"
          className="grid min-h-[132px] content-end gap-[5px] p-4"
        >
          <span className="text-[9px] text-muted">Unexplained Drift</span>
          <strong className="text-[30px] font-medium text-unexplained">
            4
          </strong>
          <small className="text-[8px] leading-snug text-muted">
            points still requiring product context
          </small>
        </Card>
      </section>
      <VisionPanel />
      <MovementList />
      <Attention />
    </>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid min-h-[66px] gap-1 border-t border-hairline py-2.5 pr-3">
      <dt className="font-mono text-[7px] text-muted uppercase">{label}</dt>
      <dd className="m-0 text-[9px]">{value}</dd>
    </div>
  )
}

function BaselineProvenance() {
  const facts = [
    ['Approved at', 'Apr 02'],
    ['Approved by', 'Marina Reis · CEO'],
    ['Source artifacts', 'PRD-001 · Product Strategy v3'],
    ['Scope', 'Atlas Home Hub · Core product'],
    ['Product areas', 'Pricing · Authentication · Onboarding · Exports'],
    ['Supersedes', 'Initial founder intent snapshot'],
    ['Reason', 'First organization-approved product reference.']
  ]
  return (
    <Card className="mt-2.5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <Kicker>Current reference</Kicker>
          <h2 className="m-0 mt-1 text-lg font-medium">Vision Baseline v1.0</h2>
        </div>
        <span className="rounded-full border border-aligned px-[7px] py-1 text-[8px] text-aligned">
          Current
        </span>
      </div>
      <dl className="mt-4 mb-2.5 grid grid-cols-1 min-[621px]:grid-cols-2">
        {facts.map(([label, value]) => (
          <Fact key={label} label={label} value={value} />
        ))}
      </dl>
    </Card>
  )
}

function EvolutionControls() {
  const [classification, setClassification] = useAtom(classificationAtom)
  const [groupBy, setGroupBy] = useAtom(groupByAtom)

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
    <div className="mb-2.5 flex items-end justify-between gap-3 max-[880px]:flex-col max-[880px]:items-stretch">
      <fieldset className="m-0 flex min-w-0 items-center gap-[3px] rounded-lg border border-hairline bg-surface p-1">
        <legend className="px-1 text-[7px] text-muted uppercase">
          Classification
        </legend>
        {classifications.map(([value, label]) => (
          <button
            className={cx(
              'min-h-[26px] cursor-pointer rounded-[5px] border-0 bg-transparent px-2 text-[8px] text-muted',
              classification === value && 'bg-subtle font-semibold text-ink'
            )}
            key={value}
            onClick={() => setClassification(value)}
            type="button"
          >
            {label}
          </button>
        ))}
      </fieldset>
      <fieldset className="m-0 flex min-w-0 items-center gap-[3px] rounded-lg border border-hairline bg-surface p-1">
        <legend className="px-1 text-[7px] text-muted uppercase">
          Group by
        </legend>
        {groups.map(([value, label]) => (
          <button
            className={cx(
              'min-h-[26px] cursor-pointer rounded-[5px] border-0 bg-transparent px-2 text-[8px] text-muted',
              groupBy === value && 'bg-subtle font-semibold text-ink'
            )}
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
  const classification = useAtomValue(classificationAtom)
  const groupBy = useAtomValue(groupByAtom)
  const filtered = driftEvents.filter(
    (event) =>
      event.classification !== 'baseline' &&
      (classification === 'all' || event.classification === classification)
  )

  if (groupBy === 'product-area') {
    return (
      <Card className="mb-2.5 px-3.5">
        {filtered.map((event) => (
          <article
            className="grid min-h-[54px] items-center gap-2 border-b border-hairline py-2 last:border-b-0 max-[420px]:grid-cols-[minmax(0,1fr)_auto] min-[421px]:grid-cols-[minmax(86px,0.8fr)_minmax(0,1fr)_auto] sm:gap-3 sm:py-0 min-[901px]:grid-cols-[minmax(130px,0.8fr)_minmax(0,1.4fr)_auto_auto]"
            key={event.id}
          >
            <strong className="text-[10px]">{event.productArea}</strong>
            <span className="text-[8px] text-muted max-[420px]:col-span-2">
              {event.title}
            </span>
            <b className="font-mono text-[9px] font-medium">{event.delta}</b>
            <ClassificationPill
              className="col-span-2 justify-self-start min-[901px]:col-span-1"
              classification={event.classification}
            />
          </article>
        ))}
      </Card>
    )
  }

  if (groupBy === 'team') {
    const teams = [
      ['Product', 'Pricing · Exports', '2 decisions'],
      ['Platform', 'Pricing · Authentication', '1 decision · 1 unexplained'],
      ['Leadership', 'Baseline approval', '1 approval']
    ]
    return (
      <Card className="mb-2.5 px-3.5">
        {teams.map(([team, areas, detail]) => (
          <article
            className="grid min-h-[54px] items-center gap-3 border-b border-hairline last:border-b-0 min-[901px]:grid-cols-[minmax(130px,0.8fr)_minmax(0,1.4fr)_auto]"
            key={team}
          >
            <strong className="text-[10px]">{team}</strong>
            <span className="text-[8px] text-muted">{areas}</span>
            <b className="font-mono text-[9px] font-medium">{detail}</b>
          </article>
        ))}
      </Card>
    )
  }

  return (
    <Card className="mb-2.5 px-3.5">
      {filtered.map((event) => (
        <article
          className="grid min-h-14 items-center gap-2 border-b border-hairline py-2 last:border-b-0 max-sm:grid-cols-[56px_minmax(0,1fr)_auto] min-[421px]:grid-cols-[48px_minmax(0,1fr)_auto] sm:grid-cols-[70px_minmax(0,1fr)_40px_auto] sm:gap-3 sm:py-0"
          key={event.id}
        >
          <time className="font-mono text-[8px] text-muted">{event.date}</time>
          <div className="grid gap-0.5">
            <strong className="text-[10px]">{event.title}</strong>
            <span className="text-[8px] text-muted">
              {event.productArea} ·{' '}
              {event.actors.map((actor) => actor.name).join(' + ')}
            </span>
          </div>
          <b className="font-mono text-[10px]">{event.delta}</b>
          <ClassificationPill
            className="max-sm:col-span-2 max-sm:col-start-2 max-sm:justify-self-start"
            classification={event.classification}
          />
        </article>
      ))}
      {filtered.length === 0 ? (
        <p className="py-[22px] text-[10px] text-muted">
          No events match this filter.
        </p>
      ) : null}
    </Card>
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
      evidence: [
        'PR #821',
        'ADR-042',
        'Review by Ana',
        'No matching product decision'
      ],
      impact: 'Authentication · −6',
      people: 'Carlos implemented · Ana reviewed',
      title: 'Authentication redesign'
    }
  ]
  return (
    <div className="grid grid-cols-1 gap-2.5 min-[901px]:grid-cols-3">
      {decisions.map((decision) => (
        <Card
          as="article"
          className="flex min-h-[200px] flex-col gap-[9px] p-4"
          key={decision.title}
        >
          <GitBranch aria-hidden="true" size={17} />
          <Kicker>{decision.date}</Kicker>
          <h2 className="m-0 my-1 text-[17px] leading-tight font-medium">
            {decision.title}
          </h2>
          <p className="m-0 text-[9px] leading-snug text-muted">
            {decision.people}
          </p>
          <strong className="mt-auto text-[10px]">{decision.impact}</strong>
          <details className="mt-3 border-t border-hairline pt-2.5">
            <summary className="cursor-pointer text-[9px]">
              Why do we believe this?
            </summary>
            <ul className="mt-2 list-disc pl-4 text-[8px] leading-relaxed text-muted">
              {decision.evidence.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </details>
        </Card>
      ))}
    </div>
  )
}

function People() {
  const people = [
    [
      aiAvatars.ana,
      'Ana',
      'Product Director',
      '5 decisions · 3 approvals · owns Pricing'
    ],
    [
      aiAvatars.carlos,
      'Carlos',
      'Engineering Lead',
      '4 implementations · 2 reviews · owns Authentication'
    ],
    [aiAvatars.marina, 'Marina', 'CEO', '3 approvals · Vision owner'],
    [
      aiAvatars.lia,
      'Lia',
      'Design Lead',
      '3 proposals · owns product navigation'
    ]
  ]

  return (
    <Card className="px-3.5">
      {people.map(([src, name, role, detail]) => (
        <article
          className="grid min-h-[62px] items-center gap-2.5 border-b border-hairline py-2.5 last:border-b-0 max-sm:grid-cols-[32px_minmax(0,1fr)] sm:grid-cols-[32px_minmax(0,1fr)_auto]"
          key={name}
        >
          <span className="inline-flex h-7 w-7 overflow-hidden rounded-full bg-ink">
            <Image
              alt={name}
              className="block h-full w-full object-cover"
              height={28}
              src={src}
              unoptimized
              width={28}
            />
          </span>
          <div className="grid gap-0.5">
            <strong className="text-[10px]">{name}</strong>
            <span className="text-[8px] text-muted">{role}</span>
          </div>
          <small className="text-[8px] text-muted max-sm:col-start-2">
            {detail}
          </small>
        </article>
      ))}
    </Card>
  )
}

function Reports() {
  return (
    <div className="grid grid-cols-1 gap-2.5 min-[901px]:grid-cols-[2fr_1fr_1fr]">
      <Card className="min-h-60 p-5">
        <Kicker>Weekly executive digest</Kicker>
        <h2 className="my-3.5 max-w-[520px] text-[32px] leading-none font-medium tracking-[-0.04em] max-sm:text-[27px]">
          Product Vision moved from 79 to 73.
        </h2>
        <p className="max-w-[520px] text-[11px] leading-relaxed text-muted">
          Authentication was the largest unresolved contributor. Export behavior
          remains under review. Pricing movement is linked to an approved
          decision.
        </p>
      </Card>
      <Card className="flex min-h-60 flex-col items-start justify-end gap-[7px] p-[18px]">
        <CheckCircle
          aria-hidden="true"
          className="text-intentional"
          size={20}
        />
        <strong className="text-[26px] font-medium">14 points</strong>
        <span className="text-[9px] text-muted">intentional evolution</span>
      </Card>
      <Card className="flex min-h-60 flex-col items-start justify-end gap-[7px] p-[18px]">
        <WarningDiamond
          aria-hidden="true"
          className="text-unexplained"
          size={20}
        />
        <strong className="text-[26px] font-medium">4 points</strong>
        <span className="text-[9px] text-muted">unexplained drift</span>
      </Card>
    </div>
  )
}

function Evidence() {
  return (
    <Card className="overflow-x-auto max-sm:overflow-x-auto">
      <div className="border-b border-hairline px-3 py-3 text-[9px] text-muted">
        Evidence is a contextual drill-down, not a primary executive
        destination.
      </div>
      <table className="w-full min-w-[560px] border-collapse text-[9px]">
        <thead>
          <tr>
            <th className="border-b border-hairline px-3 py-2.5 text-left text-[8px] font-medium text-muted">
              Artifact
            </th>
            <th className="border-b border-hairline px-3 py-2.5 text-left text-[8px] font-medium text-muted">
              Observation
            </th>
            <th className="border-b border-hairline px-3 py-2.5 text-left text-[8px] font-medium text-muted">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {[
            ['PR #821', 'Authentication implementation changed', 'Linked'],
            ['ADR-042', 'Enterprise authentication strategy', 'Linked'],
            ['exports-roadmap.md', 'Export behavior changed', 'Under Review']
          ].map((row) => (
            <tr className="[&:last-child>td]:border-b-0" key={row[0]}>
              {row.map((cell) => (
                <td
                  className="border-b border-hairline px-3 py-2.5 text-left last:border-b-0"
                  key={cell}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

function Settings() {
  const [theme, setTheme] = useAtom(themeAtom)

  return (
    <Card className="px-3.5">
      <div className="flex min-h-[68px] items-center justify-between border-b border-hairline max-sm:flex-col max-sm:items-start max-sm:gap-2.5 max-sm:py-3">
        <span className="grid gap-[3px]">
          <strong className="text-[10px]">Appearance</strong>
          <small className="text-[8px] text-muted">
            Light and dark are first-class product themes.
          </small>
        </span>
        <ThemeToggle
          onToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          theme={theme}
        />
      </div>
      <div className="flex min-h-[68px] items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-2.5 max-sm:py-3">
        <span className="grid gap-[3px]">
          <strong className="text-[10px]">Executive Voice</strong>
          <small className="text-[8px] text-muted">
            Voice stays focused on structured product context.
          </small>
        </span>
      </div>
    </Card>
  )
}

function LegacyEvolution({
  classification
}: {
  classification?: EvolutionClassification
}) {
  const setClassification = useSetAtom(classificationAtom)
  if (classification) setClassification(classification)
  return <Evolution />
}

export function DashboardView({ section }: { section: DashboardSection }) {
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
      {section === 'drift-graph' ||
      section === 'drift-timeline' ||
      section === 'drift-events' ? (
        <Evolution />
      ) : null}
      {section === 'drift-by-team' || section === 'drift-by-product-area' ? (
        <Evolution />
      ) : null}
      {section === 'intentional-drift' ? (
        <LegacyEvolution classification="intentional" />
      ) : null}
      {section === 'unexplained-drift' ? (
        <LegacyEvolution classification="unexplained" />
      ) : null}
      {section === 'evidence' ? <Evidence /> : null}
    </>
  )
}
