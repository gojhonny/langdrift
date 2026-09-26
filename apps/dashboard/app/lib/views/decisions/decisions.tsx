'use client'

import { useTranslations } from 'next-intl'

import { GitBranch } from '@repo/react/ui/icons'
import { Card, Kicker } from '@repo/react/ui/primitives'

export function Decisions() {
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
