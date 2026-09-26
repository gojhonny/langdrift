'use client'

import { useTranslations } from 'next-intl'

import { Card } from '@repo/react/ui/primitives'

export function Evidence() {
  const t = useTranslations('view')

  return (
    <Card className="overflow-x-auto max-sm:overflow-x-auto">
      <div className="border-b border-hairline px-3 py-3 text-[9px] text-muted">
        {t('evidence.context')}
      </div>
      <table className="w-full min-w-[560px] border-collapse text-[9px]">
        <thead>
          <tr>
            <th className="border-b border-hairline px-3 py-2.5 text-left text-[8px] font-medium text-muted">
              {t('evidence.artifact')}
            </th>
            <th className="border-b border-hairline px-3 py-2.5 text-left text-[8px] font-medium text-muted">
              {t('evidence.observation')}
            </th>
            <th className="border-b border-hairline px-3 py-2.5 text-left text-[8px] font-medium text-muted">
              {t('evidence.status')}
            </th>
          </tr>
        </thead>
        <tbody>
          {[
            ['PR #821', t('evidence.authentication'), t('evidence.linked')],
            ['ADR-042', t('evidence.strategy'), t('evidence.linked')],
            [
              'exports-roadmap.md',
              t('events.exports.title'),
              t('classifications.review')
            ]
          ].map((row) => (
            <tr className="[&:last-child>td]:border-b-0" key={row[0]}>
              {row.map((cell) => (
                <td
                  className="border-b border-hairline px-3 py-2.5 text-left last:border-b-0"
                  key={cell}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
