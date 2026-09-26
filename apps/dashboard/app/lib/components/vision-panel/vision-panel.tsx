'use client'

import { useAtom } from 'jotai'
import { useFormatter, useTranslations } from 'next-intl'

import { rangeAtom, selectedPointAtom } from '@atoms'
import { useVisionPoints } from '@components/vision-panel/use-vision-points.hook'
import { aiAvatars } from '@repo/react/ui/ai-avatars'
import { Card, Kicker } from '@repo/react/ui/primitives'
import {
  ProductVisionCurve,
  type VisionDriftEvent
} from '@repo/react/ui/product-vision-curve'
import { FigmaComment } from '@repo/react/vendors/smoothui'
import { cn } from '@template/formatters/cn.fmt'

export function VisionPanel() {
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
              className={cn(
                'min-h-6 cursor-pointer rounded-[5px] border-0 bg-transparent px-2 text-[8px] text-muted',
                range === item && 'shadow-[0_1px_4px_rgba(0,0,0,.08)]'
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
