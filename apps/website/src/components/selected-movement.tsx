'use client'

import { AnimatedAvatarGroup } from '@repo/react/vendors/smoothui'
import { useAtomValue } from 'jotai'
import { useFormatter, useTranslations } from 'next-intl'

import { selectedPointAtom } from '../state'
import { useHeroPoints } from './hero-chart'

export function SelectedMovement() {
  const t = useTranslations('home.why')
  const demo = useTranslations('demo')
  const format = useFormatter()
  const points = useHeroPoints()
  const selectedPoint = useAtomValue(selectedPointAtom)
  const activeEvent = points[selectedPoint]?.event ?? points.at(-1)?.event
  if (!activeEvent) return null

  return (
    <article className="reason-card" aria-live="polite" aria-atomic="true">
      <div className="reason-summary">
        <div>
          <span>{t('selected')}</span>
          <h3>{activeEvent.title}</h3>
          <p>
            {activeEvent.date} · {activeEvent.productArea ?? t('product')}
          </p>
        </div>
        <div className="reason-impact">
          <strong>
            {format.number(activeEvent.delta, { signDisplay: 'exceptZero' })}
          </strong>
          <span data-classification={activeEvent.classification}>
            {demo(`classifications.${activeEvent.classification}`)}
          </span>
        </div>
      </div>
      <div className="reason-details">
        <div>
          <span>{t('reason')}</span>
          <p>{activeEvent.reason}</p>
        </div>
        <div>
          <span>{t('decision')}</span>
          <strong>{activeEvent.decision}</strong>
        </div>
        <div>
          <span>{t('people')}</span>
          <AnimatedAvatarGroup
            people={activeEvent.actors.map((actor) => ({
              initials: actor.initials,
              name: actor.name,
              role: actor.team,
              src: actor.src
            }))}
            size={32}
          />
          <small>
            {activeEvent.actors.map((actor) => actor.name).join(' + ')}
          </small>
        </div>
      </div>
    </article>
  )
}
