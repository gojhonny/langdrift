'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { aiAvatars } from '@repo/react/ui/ai-avatars'
import { Card } from '@repo/react/ui/primitives'

export function People() {
  const t = useTranslations('view')
  const people = [
    [aiAvatars.ana, 'Ana', t('people.anaRole'), t('people.anaDetail')],
    [
      aiAvatars.carlos,
      'Carlos',
      t('people.carlosRole'),
      t('people.carlosDetail')
    ],
    [aiAvatars.marina, 'Marina', 'CEO', t('people.marinaDetail')],
    [aiAvatars.lia, 'Lia', t('people.liaRole'), t('people.liaDetail')]
  ]

  return (
    <Card className="px-3.5">
      {people.map(([src, name, role, detail]) => (
        <article
          className="grid min-h-[62px] items-center gap-2.5 border-b border-hairline py-2.5 last:border-b-0 max-sm:grid-cols-[32px_minmax(0,1fr)] sm:grid-cols-[32px_minmax(0,1fr)_auto]"
          key={name}
        >
          <span className="inline-flex h-7 w-7 overflow-hidden rounded-full bg-ink">
            <Image
              alt={name}
              className="block h-full w-full object-cover"
              height={28}
              src={src}
              unoptimized
              width={28}
            />
          </span>
          <div className="grid gap-0.5">
            <strong className="text-[10px]">{name}</strong>
            <span className="text-[8px] text-muted">{role}</span>
          </div>
          <small className="text-[8px] text-muted max-sm:col-start-2">
            {detail}
          </small>
        </article>
      ))}
    </Card>
  )
}
