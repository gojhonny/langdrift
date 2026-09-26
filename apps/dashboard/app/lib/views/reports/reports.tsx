'use client'

import { useTranslations } from 'next-intl'

import { CheckCircle, WarningDiamond } from '@repo/react/ui/icons'
import { Card, Kicker } from '@repo/react/ui/primitives'

export function Reports() {
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
