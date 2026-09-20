'use client'

import { ProductVisionCurve } from '@repo/react/ui/product-vision-curve'
import { useAtom } from 'jotai'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { getHeroPoints } from '../lib/hero-demo-data'
import { selectedPointAtom } from '../state'

export function useHeroPoints() {
  const t = useTranslations('demo')
  const locale = useLocale()
  return useMemo(() => getHeroPoints(t, locale), [locale, t])
}

export function HeroChart() {
  const t = useTranslations('demo')
  const locale = useLocale()
  const points = useHeroPoints()
  const [selectedPoint, setSelectedPoint] = useAtom(selectedPointAtom)
  const selectedEventId = (points[selectedPoint]?.event ?? points.at(-1)?.event)
    ?.id
  const percent = new Intl.NumberFormat(locale, { style: 'percent' })
  const number = new Intl.NumberFormat(locale)
  const delta = new Intl.NumberFormat(locale, { signDisplay: 'exceptZero' })

  return (
    <div className="hero-chart-card">
      <div className="hero-chart-heading">
        <div className="hero-chart-score">
          <span>{t('chart.title')}</span>
          <strong>{percent.format(0.73)}</strong>
        </div>
        <div className="hero-chart-movement">
          <span>{t('chart.movement')}</span>
          <strong>
            {t('chart.movementDetail', { baseline: percent.format(0.91) })}
          </strong>
        </div>
      </div>
      <ProductVisionCurve
        data={points}
        formatNumber={number.format}
        labels={{
          classifications: {
            baseline: t('classifications.baseline'),
            intentional: t('classifications.intentional'),
            review: t('classifications.review'),
            unexplained: t('classifications.unexplained')
          },
          describeEvent: (event) =>
            t('chart.event', {
              title: event.title,
              delta: delta.format(event.delta),
              classification: t(`classifications.${event.classification}`),
              date: event.date
            }),
          product: t('chart.product'),
          summary: t('chart.summary', {
            from: percent.format(0.91),
            to: percent.format(0.73)
          }),
          why: t('chart.why')
        }}
        onSelectEvent={(event) => {
          const index = points.findIndex(
            (point) => point.event?.id === event.id
          )
          if (index >= 0) setSelectedPoint(index)
        }}
        pointPadding={16}
        selectedEventId={selectedEventId}
      />
    </div>
  )
}
