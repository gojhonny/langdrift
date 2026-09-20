import { aiAvatars } from '@repo/react/ui/ai-avatars'
import type { VisionPoint } from '@repo/react/ui/product-vision-curve'
import type { SinapsiGraphDocument } from 'sinapsi'

type DemoTranslator = (key: string) => string

// The existing illustrative scenario is preserved; these values do not define
// the Product Vision formula. Locale changes only affect its presentation.
export function getHeroPoints(
  t: DemoTranslator,
  locale: string
): VisionPoint[] {
  const month = new Intl.DateTimeFormat(locale, {
    month: 'short',
    timeZone: 'UTC'
  })
  const date = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC'
  })
  const at = (monthIndex: number, day = 1) =>
    new Date(Date.UTC(2026, monthIndex, day))
  const ana = {
    initials: 'AN',
    name: 'Ana',
    src: aiAvatars.ana,
    team: t('teams.product')
  }
  const carlos = {
    initials: 'CA',
    name: 'Carlos',
    src: aiAvatars.carlos,
    team: t('teams.platform')
  }

  return [
    {
      label: month.format(at(3)),
      value: 91,
      event: {
        actionHref: '#why',
        actionLabel: t('events.baseline.action'),
        actors: [
          {
            initials: 'MR',
            name: 'Marina Reis',
            src: aiAvatars.marina,
            team: t('teams.leadership')
          }
        ],
        classification: 'baseline',
        date: date.format(at(3, 2)),
        decision: t('events.baseline.decision'),
        delta: 0,
        id: 'baseline',
        productArea: t('areas.vision'),
        reason: t('events.baseline.reason'),
        title: t('events.baseline.title')
      }
    },
    { label: month.format(at(4)), value: 88 },
    {
      label: month.format(at(5)),
      value: 84,
      event: {
        actionHref: '#why',
        actionLabel: t('events.pricing.action'),
        actors: [ana, carlos],
        classification: 'intentional',
        date: date.format(at(5, 28)),
        decision: t('events.pricing.decision'),
        delta: -9,
        id: 'pricing',
        productArea: t('areas.pricing'),
        reason: t('events.pricing.reason'),
        title: t('events.pricing.title')
      }
    },
    {
      label: month.format(at(6)),
      value: 79,
      event: {
        actionHref: '#why',
        actionLabel: t('events.authentication.action'),
        actors: [carlos],
        classification: 'unexplained',
        date: date.format(at(6, 22)),
        decision: t('events.authentication.decision'),
        delta: -6,
        id: 'authentication',
        productArea: t('areas.authentication'),
        reason: t('events.authentication.reason'),
        title: t('events.authentication.title')
      }
    },
    {
      label: month.format(at(7)),
      value: 73,
      event: {
        actionHref: '#why',
        actionLabel: t('events.exports.action'),
        actors: [ana],
        classification: 'review',
        date: date.format(at(7, 20)),
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

// Stable semantic IDs and explicit edges; labels alone vary by language.
const graphRelations = [
  ['vision', ['target', 'loop', 'strategy', 'baseline']],
  ['target', ['scope', 'experience', 'quality']],
  ['loop', ['decision', 'delivery', 'feedback']],
  ['strategy', ['pricing', 'onboarding']],
  ['baseline', ['evidence', 'review']],
  ['scope', ['exports', 'decision']],
  ['experience', ['onboarding', 'accessibility']],
  ['quality', ['tests', 'reliability']],
  ['decision', ['context', 'intent']],
  ['delivery', ['release', 'tests']],
  ['feedback', ['research', 'review']],
  ['pricing', ['context', 'research']],
  ['onboarding', ['authentication']],
  ['evidence', ['tests', 'release', 'research']],
  ['review', ['intent', 'context']],
  ['exports', ['release']],
  ['accessibility', ['research']],
  ['tests', ['reliability']],
  ['reliability', []],
  ['context', []],
  ['intent', []],
  ['release', ['authentication']],
  ['research', []],
  ['authentication', ['quality']]
] as const

export function getHeroGraph(t: DemoTranslator): SinapsiGraphDocument {
  return {
    graph: graphRelations.map(([id, links]) => ({
      id,
      name: t(`nodes.${id}`),
      payload: { kind: id },
      links: links.map((target) => ({ id: target, name: t(`nodes.${target}`) }))
    }))
  }
}
