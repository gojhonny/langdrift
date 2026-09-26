'use client'

import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'

import { rangeAtom, selectedProductAtom } from '@atoms'
import { Attention } from '@components/attention/attention'
import { MovementList } from '@components/movement-list/movement-list'
import { VisionPanel } from '@components/vision-panel/vision-panel'
import { Card, Kicker } from '@repo/react/ui/primitives'

export function Overview() {
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
