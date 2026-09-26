'use client'

import { useTranslations } from 'next-intl'

import { aiAvatars } from '@repo/react/ui/ai-avatars'
import type { VisionPoint } from '@repo/react/ui/product-vision-curve'

// Illustrative frontend fixtures, not the Product Vision scoring contract.
export function useVisionPoints(): VisionPoint[] {
  const t = useTranslations('view')

  return [
    {
      label: t('months.apr'),
      value: 91,
      event: {
        actors: [
          {
            initials: 'MR',
            name: 'Marina Reis',
            src: aiAvatars.marina,
            team: t('teams.leadership')
          }
        ],
        classification: 'baseline',
        date: t('dates.baseline'),
        decision: t('events.baseline.decision'),
        delta: 0,
        id: 'baseline',
        productArea: t('areas.vision'),
        reason: t('events.baseline.reason'),
        title: t('events.baseline.title')
      }
    },
    { label: t('months.may'), value: 88 },
    {
      label: t('months.jun'),
      value: 84,
      event: {
        actors: [
          {
            initials: 'AN',
            name: 'Ana',
            src: aiAvatars.ana,
            team: t('teams.product')
          },
          {
            initials: 'CA',
            name: 'Carlos',
            src: aiAvatars.carlos,
            team: t('teams.platform')
          }
        ],
        classification: 'intentional',
        date: t('dates.pricing'),
        decision: t('events.pricing.decision'),
        delta: -9,
        id: 'pricing',
        productArea: t('areas.pricing'),
        reason: t('events.pricing.reason'),
        title: t('events.pricing.title')
      }
    },
    {
      label: t('months.jul'),
      value: 79,
      event: {
        actors: [
          {
            initials: 'CA',
            name: 'Carlos',
            src: aiAvatars.carlos,
            team: t('teams.platform')
          }
        ],
        classification: 'unexplained',
        date: t('dates.authentication'),
        decision: t('events.authentication.decision'),
        delta: -6,
        id: 'authentication',
        productArea: t('areas.authentication'),
        reason: t('events.authentication.reason'),
        title: t('events.authentication.title')
      }
    },
    {
      label: t('months.aug'),
      value: 73,
      event: {
        actors: [
          {
            initials: 'AN',
            name: 'Ana',
            src: aiAvatars.ana,
            team: t('teams.product')
          }
        ],
        classification: 'review',
        date: t('dates.exports'),
        decision: t('events.exports.decision'),
        delta: -3,
        id: 'exports',
        productArea: t('areas.exports'),
        reason: t('events.exports.reason'),
        title: t('events.exports.title')
      }
    }
  ]
}
