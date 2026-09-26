'use client'

import { useTranslations } from 'next-intl'

import { Fact } from '@components/baseline-provenance/fact'
import { Card, Kicker } from '@repo/react/ui/primitives'

export function BaselineProvenance() {
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
        <span className="rounded-full border border-aligned px-[7px] py-1 text-[8px] text-aligned-text">
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
