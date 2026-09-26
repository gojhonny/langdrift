'use client'

import { useTranslations } from 'next-intl'

import { ClassificationPill } from '@components/classification-pill/classification-pill'
import { useVisionPoints } from '@components/vision-panel/use-vision-points.hook'
import { Card, Kicker } from '@repo/react/ui/primitives'
import { AnimatedAvatarGroup } from '@repo/react/vendors/smoothui'

export function MovementList() {
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
