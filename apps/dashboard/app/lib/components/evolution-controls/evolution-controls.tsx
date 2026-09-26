'use client'

import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'

import { classificationAtom, groupByAtom } from '@atoms'
import type { EvolutionClassification, EvolutionGroup } from '@domain'
import { cn } from '@template/formatters/cn.fmt'

export function EvolutionControls() {
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
            className={cn(
              'min-h-[26px] cursor-pointer rounded-[5px] border-0 bg-transparent px-2 text-[8px] text-muted',
              classification === value && 'font-semibold'
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
            className={cn(
              'min-h-[26px] cursor-pointer rounded-[5px] border-0 bg-transparent px-2 text-[8px] text-muted',
              groupBy === value && 'font-semibold'
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
