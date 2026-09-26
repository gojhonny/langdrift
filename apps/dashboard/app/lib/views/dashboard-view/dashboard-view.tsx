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
import { classificationText } from '@repo/react/ui/classification-text'
import { ThemeToggle } from '@repo/react/ui/theme-toggle'
import { AnimatedAvatarGroup, FigmaComment } from '@repo/react/vendors/smoothui'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import Image from 'next/image'
import Link from 'next/link'
import { useFormatter, useTranslations } from 'next-intl'

import {
  classificationAtom,
  groupByAtom,
  rangeAtom,
  selectedPointAtom,
  selectedProductAtom,
  themeAtom
} from '@atoms'
import type {
  DashboardSection,
  EvolutionClassification,
  EvolutionGroup
} from '@domain'
import { DashboardPageGate } from '@components/route-state/dashboard-page-gate'
import { DashboardLanguageSettings } from '@i18n/language-settings'
import { Card, cx, Kicker } from '@template/ui'

function useVisionPoints(): VisionPoint[] {
  const t = useTranslations('view')
  return [
    {
      label: t('months.apr'),
      value: 91,
      event: {
        actors: [
          {
            initials: 'MR',
            name: 'Marina Reis',
            src: aiAvatars.marina,
            team: t('teams.leadership')
          }
        ],
        classification: 'baseline',
        date: t('dates.baseline'),
        decision: t('events.baseline.decision'),
        delta: 0,
        id: 'baseline',
        productArea: t('areas.vision'),
        reason: t('events.baseline.reason'),
        title: t('events.baseline.title')
      }
    },
    { label: t('months.may'), value: 88 },
    {
      label: t('months.jun'),
      value: 84,
      event: {
        actors: [
          {
            initials: 'AN',
            name: 'Ana',
            src: aiAvatars.ana,
            team: t('teams.product')
          },
          {
            initials: 'CA',
            name: 'Carlos',
            src: aiAvatars.carlos,
            team: t('teams.platform')
          }
        ],
        classification: 'intentional',
        date: t('dates.pricing'),
        decision: t('events.pricing.decision'),
        delta: -9,
        id: 'pricing',
        productArea: t('areas.pricing'),
        reason: t('events.pricing.reason'),
        title: t('events.pricing.title')
      }
    },
    {
      label: t('months.jul'),
      value: 79,
      event: {
        actors: [
          {
            initials: 'CA',
            name: 'Carlos',
            src: aiAvatars.carlos,
            team: t('teams.platform')
          }
        ],
        classification: 'unexplained',
        date: t('dates.authentication'),
        decision: t('events.authentication.decision'),
        delta: -6,
        id: 'authentication',
        productArea: t('areas.authentication'),
        reason: t('events.authentication.reason'),
        title: t('events.authentication.title')
      }
    },
    {
      label: t('months.aug'),
      value: 73,
      event: {
        actors: [
          {
            initials: 'AN',
            name: 'Ana',
            src: aiAvatars.ana,
            team: t('teams.product')
          }
        ],
        classification: 'review',
        date: t('dates.exports'),
        decision: t('events.exports.decision'),
        delta: -3,
        id: 'exports',
        productArea: t('areas.exports'),
        reason: t('events.exports.reason'),
        title: t('events.exports.title')
      }
    }
  ]
}

function Heading({ section }: { section: DashboardSection }) {
  const t = useTranslations('view')
  const title = t(`sections.${section}.title`)
  const description = t(`sections.${section}.description`)
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
  const t = useTranslations('view')
  return (
    <span
      className={cx(
        'rounded-full border border-hairline px-1.5 py-1 text-[8px]',
        className,
        classificationText[classification]
      )}
    >
      {t(`classifications.${classification}`)}
    </span>
  )
}

function VisionPanel() {
  const t = useTranslations('view')
  const format = useFormatter()
  const visionPoints = useVisionPoints()
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
          <Kicker>{t('vision.product')}</Kicker>
          <strong className="text-[28px] font-medium tracking-[-0.045em]">
            73%
          </strong>
          <small className="text-[8px] text-muted">{t('vision.delta')}</small>
        </div>
        <fieldset
          aria-label={t('vision.timeRange')}
          className="m-0 inline-flex min-w-0 rounded-md border-0 bg-subtle p-0.5"
        >
          {(['30d', '90d', '1y', 'all'] as const).map((item) => (
            <button
              aria-pressed={range === item}
              className={cx(
                'min-h-6 cursor-pointer rounded-[5px] border-0 bg-transparent px-2 text-[8px] text-muted',
                range === item &&
                  'bg-surface text-ink shadow-[0_1px_4px_rgba(0,0,0,.08)]'
              )}
              key={item}
              onClick={() => setRange(item)}
              type="button"
            >
              {t(`range.${item}`)}
            </button>
          ))}
        </fieldset>
      </div>
      <ProductVisionCurve
        data={visionPoints}
        formatNumber={(value) => format.number(value)}
        labels={{
          classifications: {
            baseline: t('classifications.baseline'),
            intentional: t('classifications.intentional'),
            review: t('classifications.review'),
            unexplained: t('classifications.unexplained')
          },
          describeEvent: (event) =>
            t('vision.describeEvent', {
              title: event.title,
              date: event.date,
              delta: format.number(event.delta),
              classification: t(`classifications.${event.classification}`)
            }),
          loading: t('vision.loading'),
          product: t('teams.product'),
          summary: t('vision.summary'),
          why: t('vision.why')
        }}
        onSelectEvent={selectEvent}
        selectedEventId={selectedEventId}
      />
      <div className="absolute top-12 right-3.5 max-sm:static max-sm:mt-2.5">
        <FigmaComment
          author="Ana"
          initials="AN"
          label={t('vision.commentLabel', { author: 'Ana' })}
          message={t('vision.comment')}
          src={aiAvatars.ana}
          timestamp={t('dates.exports')}
        />
      </div>
    </Card>
  )
}

function MovementList() {
  const t = useTranslations('view')
  const rows = useVisionPoints()
    .flatMap((point) => (point.event ? [point.event] : []))
    .filter((event) => event.classification !== 'baseline')
  return (
    <Card className="mb-2.5 p-4">
      <div className="mb-3 flex items-end justify-between gap-4 max-sm:flex-wrap max-sm:items-start max-sm:gap-2.5">
        <div className="grid min-w-0 gap-[5px]">
          <Kicker>{t('movement.why')}</Kicker>
          <h2 className="m-0 text-[17px] font-medium">
            {t('movement.summary')}
          </h2>
        </div>
        <span className="font-mono text-[8px] text-muted">
          {t('movement.totals')}
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
  const t = useTranslations('view')
  return (
    <section className="grid grid-cols-1 gap-2.5 min-[881px]:grid-cols-2">
      <Card as="article" className="grid min-h-[170px] gap-[7px] p-4">
        <WarningDiamond
          aria-hidden="true"
          className="text-unexplained"
          size={18}
        />
        <Kicker>{t('attention.heading')}</Kicker>
        <strong className="text-sm leading-snug font-medium">
          {t('attention.authentication')}
        </strong>
        <p className="m-0 text-[9px] leading-snug text-muted">
          {t('attention.classification')}
        </p>
        <Link className="self-end text-[9px] no-underline" href="/decisions">
          {t('attention.reviewDecision')} →
        </Link>
      </Card>
      <Card as="article" className="grid min-h-[170px] gap-[7px] p-4">
        <ShieldCheck aria-hidden="true" className="text-review" size={18} />
        <Kicker>{t('classifications.review')}</Kicker>
        <strong className="text-sm leading-snug font-medium">
          {t('attention.exports')}
        </strong>
        <p className="m-0 text-[9px] leading-snug text-muted">
          {t('events.exports.reason')}
        </p>
        <Link className="self-end text-[9px] no-underline" href="/evolution">
          {t('attention.inspectEvolution')} →
        </Link>
      </Card>
    </section>
  )
}

function Overview() {
  const t = useTranslations('view')
  const product = useAtomValue(selectedProductAtom)
  const range = useAtomValue(rangeAtom)
  return (
    <>
      <section className="mb-2.5 grid grid-cols-1 gap-2.5 min-[621px]:grid-cols-2 min-[881px]:grid-cols-[minmax(0,2fr)_minmax(170px,1fr)_minmax(170px,1fr)]">
        <Card
          as="article"
          className="grid min-h-[132px] gap-[5px] p-4 min-[621px]:col-span-2 min-[881px]:col-span-1"
        >
          <Kicker>{t('vision.product')}</Kicker>
          <strong className="text-5xl leading-none font-medium tracking-[-0.055em]">
            73%
          </strong>
          <p className="m-0 text-[10px] text-muted">
            {t('vision.baselineDelta')}
          </p>
          <div className="mt-auto flex items-center gap-2">
            {[
              product,
              t(`range.${range}`).toUpperCase(),
              t('vision.baselineTag')
            ].map((item) => (
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
          <span className="text-[9px] text-muted">
            {t('classifications.intentional')}
          </span>
          <strong className="text-[30px] font-medium text-intentional">
            14
          </strong>
          <small className="text-[8px] leading-snug text-muted">
            {t('overview.intentionalPoints')}
          </small>
        </Card>
        <Card
          as="article"
          className="grid min-h-[132px] content-end gap-[5px] p-4"
        >
          <span className="text-[9px] text-muted">
            {t('classifications.unexplained')}
          </span>
          <strong className="text-[30px] font-medium text-unexplained">
            4
          </strong>
          <small className="text-[8px] leading-snug text-muted">
            {t('overview.unexplainedPoints')}
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
  const t = useTranslations('view')
  const facts = [
    [t('baseline.approvedAt'), t('dates.baseline')],
    [t('baseline.approvedBy'), 'Marina Reis · CEO'],
    [t('baseline.sources'), t('baseline.sourceValue')],
    [t('baseline.scope'), t('baseline.scopeValue')],
    [t('baseline.areas'), t('baseline.areasValue')],
    [t('baseline.supersedes'), t('baseline.supersedesValue')],
    [t('baseline.reason'), t('baseline.reasonValue')]
  ]
  return (
    <Card className="mt-2.5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <Kicker>{t('baseline.reference')}</Kicker>
          <h2 className="m-0 mt-1 text-lg font-medium">
            {t('baseline.title')}
          </h2>
        </div>
        <span className="rounded-full border border-aligned px-[7px] py-1 text-[8px] text-green-700 dark:text-green-400">
          {t('baseline.current')}
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
  const t = useTranslations('view')
  const [classification, setClassification] = useAtom(classificationAtom)
  const [groupBy, setGroupBy] = useAtom(groupByAtom)

  const classifications: Array<[EvolutionClassification, string]> = [
    ['all', t('filters.all')],
    ['intentional', t('filters.intentional')],
    ['unexplained', t('filters.unexplained')],
    ['review', t('classifications.review')]
  ]
  const groups: Array<[EvolutionGroup, string]> = [
    ['event', t('groups.event')],
    ['product-area', t('groups.productArea')],
    ['team', t('groups.team')]
  ]

  return (
    <div className="mb-2.5 flex items-end justify-between gap-3 max-[880px]:flex-col max-[880px]:items-stretch">
      <fieldset className="m-0 flex min-w-0 flex-wrap items-center gap-[3px] rounded-lg border border-hairline bg-surface p-1">
        <legend className="px-1 text-[7px] text-muted uppercase">
          {t('filters.classification')}
        </legend>
        {classifications.map(([value, label]) => (
          <button
            aria-pressed={classification === value}
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
          {t('groups.label')}
        </legend>
        {groups.map(([value, label]) => (
          <button
            aria-pressed={groupBy === value}
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
  const t = useTranslations('view')
  const driftEvents = useVisionPoints().flatMap((point) =>
    point.event ? [point.event] : []
  )
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
      [
        t('teams.product'),
        t('teamGroups.productAreas'),
        t('teamGroups.productDetail')
      ],
      [
        t('teams.platform'),
        t('teamGroups.platformAreas'),
        t('teamGroups.platformDetail')
      ],
      [
        t('teams.leadership'),
        t('teamGroups.leadershipAreas'),
        t('teamGroups.leadershipDetail')
      ]
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
        <p className="py-[22px] text-[10px] text-muted">{t('filters.empty')}</p>
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
  const t = useTranslations('view')
  const decisions = [
    {
      date: t('dates.pricing'),
      evidence: ['PRD-014', t('decisions.note'), t('decisions.reviewMarina')],
      impact: `${t('areas.pricing')} · −9`,
      people: t('decisions.pricingPeople'),
      title: t('decisions.pricingTitle')
    },
    {
      date: t('dates.authentication'),
      evidence: [
        'PR #821',
        'ADR-042',
        t('decisions.reviewAna'),
        t('decisions.noDecision')
      ],
      impact: `${t('areas.authentication')} · −6`,
      people: t('decisions.authenticationPeople'),
      title: t('decisions.authenticationTitle')
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
              {t('decisions.why')}
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
  const t = useTranslations('view')
  const people = [
    [aiAvatars.ana, 'Ana', t('people.anaRole'), t('people.anaDetail')],
    [
      aiAvatars.carlos,
      'Carlos',
      t('people.carlosRole'),
      t('people.carlosDetail')
    ],
    [aiAvatars.marina, 'Marina', 'CEO', t('people.marinaDetail')],
    [aiAvatars.lia, 'Lia', t('people.liaRole'), t('people.liaDetail')]
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
  const t = useTranslations('view')
  return (
    <div className="grid grid-cols-1 gap-2.5 min-[901px]:grid-cols-[2fr_1fr_1fr]">
      <Card className="min-h-60 p-5">
        <Kicker>{t('reports.digest')}</Kicker>
        <h2 className="my-3.5 max-w-[520px] text-[32px] leading-none font-medium tracking-[-0.04em] max-sm:text-[27px]">
          {t('reports.title')}
        </h2>
        <p className="max-w-[520px] text-[11px] leading-relaxed text-muted">
          {t('reports.summary')}
        </p>
      </Card>
      <Card className="flex min-h-60 flex-col items-start justify-end gap-[7px] p-[18px]">
        <CheckCircle
          aria-hidden="true"
          className="text-intentional"
          size={20}
        />
        <strong className="text-[26px] font-medium">
          {t('reports.points', { count: 14 })}
        </strong>
        <span className="text-[9px] text-muted">
          {t('classifications.intentional')}
        </span>
      </Card>
      <Card className="flex min-h-60 flex-col items-start justify-end gap-[7px] p-[18px]">
        <WarningDiamond
          aria-hidden="true"
          className="text-unexplained"
          size={20}
        />
        <strong className="text-[26px] font-medium">
          {t('reports.points', { count: 4 })}
        </strong>
        <span className="text-[9px] text-muted">
          {t('classifications.unexplained')}
        </span>
      </Card>
    </div>
  )
}

function Evidence() {
  const t = useTranslations('view')
  return (
    <Card className="overflow-x-auto max-sm:overflow-x-auto">
      <div className="border-b border-hairline px-3 py-3 text-[9px] text-muted">
        {t('evidence.context')}
      </div>
      <table className="w-full min-w-[560px] border-collapse text-[9px]">
        <thead>
          <tr>
            <th className="border-b border-hairline px-3 py-2.5 text-left text-[8px] font-medium text-muted">
              {t('evidence.artifact')}
            </th>
            <th className="border-b border-hairline px-3 py-2.5 text-left text-[8px] font-medium text-muted">
              {t('evidence.observation')}
            </th>
            <th className="border-b border-hairline px-3 py-2.5 text-left text-[8px] font-medium text-muted">
              {t('evidence.status')}
            </th>
          </tr>
        </thead>
        <tbody>
          {[
            ['PR #821', t('evidence.authentication'), t('evidence.linked')],
            ['ADR-042', t('evidence.strategy'), t('evidence.linked')],
            [
              'exports-roadmap.md',
              t('events.exports.title'),
              t('classifications.review')
            ]
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
  const t = useTranslations('view')
  const [theme, setTheme] = useAtom(themeAtom)

  return (
    <Card className="px-3.5">
      <div className="flex min-h-[68px] items-center justify-between border-b border-hairline max-sm:flex-col max-sm:items-start max-sm:gap-2.5 max-sm:py-3">
        <span className="grid gap-[3px]">
          <strong className="text-[10px]">{t('settings.appearance')}</strong>
          <small className="text-[8px] text-muted">
            {t('settings.appearanceDescription')}
          </small>
        </span>
        <ThemeToggle
          label={t(
            theme === 'light' ? 'settings.switchDark' : 'settings.switchLight'
          )}
          onToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          theme={theme}
        />
      </div>
      <div className="border-b border-hairline py-3">
        <DashboardLanguageSettings />
      </div>
      <div className="flex min-h-[68px] items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-2.5 max-sm:py-3">
        <span className="grid gap-[3px]">
          <strong className="text-[10px]">{t('settings.voice')}</strong>
          <small className="text-[8px] text-muted">
            {t('settings.voiceDescription')}
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
    <DashboardPageGate section={section}>
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
    </DashboardPageGate>
  )
}
