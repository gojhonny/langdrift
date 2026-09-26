'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { ShieldCheck, WarningDiamond } from '@repo/react/ui/icons'
import { Card, Kicker } from '@repo/react/ui/primitives'

export function Attention() {
  const t = useTranslations('view')

  return (
    <section className="grid grid-cols-1 gap-2.5 min-[881px]:grid-cols-2">
      <Card as="article" className="grid min-h-[170px] gap-[7px] p-4">
        <WarningDiamond
          aria-hidden="true"
          className="text-unexplained"
          size={18}
        />
        <Kicker>{t('attention.heading')}</Kicker>
        <strong className="text-sm leading-snug font-medium">
          {t('attention.authentication')}
        </strong>
        <p className="m-0 text-[9px] leading-snug text-muted">
          {t('attention.classification')}
        </p>
        <Link className="self-end text-[9px] no-underline" href="/decisions">
          {t('attention.reviewDecision')} →
        </Link>
      </Card>
      <Card as="article" className="grid min-h-[170px] gap-[7px] p-4">
        <ShieldCheck aria-hidden="true" className="text-review" size={18} />
        <Kicker>{t('classifications.review')}</Kicker>
        <strong className="text-sm leading-snug font-medium">
          {t('attention.exports')}
        </strong>
        <p className="m-0 text-[9px] leading-snug text-muted">
          {t('events.exports.reason')}
        </p>
        <Link className="self-end text-[9px] no-underline" href="/evolution">
          {t('attention.inspectEvolution')} →
        </Link>
      </Card>
    </section>
  )
}
