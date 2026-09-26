'use client'

import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'

import { classificationAtom, groupByAtom } from '@atoms'
import { ClassificationPill } from '@components/classification-pill/classification-pill'
import { useVisionPoints } from '@components/vision-panel/use-vision-points.hook'
import { Card } from '@repo/react/ui/primitives'

export function GroupedEvolution() {
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
