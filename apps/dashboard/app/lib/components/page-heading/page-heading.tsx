'use client'

import { useTranslations } from 'next-intl'

import type { DashboardSection } from '@domain'
import { Kicker } from '@repo/react/ui/primitives'

interface HeadingProps {
  section: DashboardSection
}

export function Heading(props: HeadingProps) {
  const { section } = props

  const t = useTranslations('view')
  const title = t(`sections.${section}.title`)
  const description = t(`sections.${section}.description`)

  return (
    <div className="mb-[22px] flex items-end justify-between max-sm:flex-col max-sm:items-start max-sm:gap-2">
      <div className="grid min-w-0 gap-[3px]">
        <Kicker>{title}</Kicker>
        <h1 className="m-0 text-[27px] font-medium tracking-[-0.035em] max-sm:text-[27px]">
          {title}
        </h1>
        <p className="m-0 mt-0.5 text-[11px] text-muted">{description}</p>
      </div>
    </div>
  )
}
