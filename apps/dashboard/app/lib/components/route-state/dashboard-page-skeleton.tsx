'use client'

import { useTranslations } from 'next-intl'

import { SkeletonContent } from '@components/route-state/skeleton/skeleton-content'
import type { DashboardSection } from '@domain'
import { SkeletonLoader } from '@repo/react/vendors/smoothui/skeleton-loader'

interface DashboardPageSkeletonProps {
  section: DashboardSection
}

export function DashboardPageSkeleton(props: DashboardPageSkeletonProps) {
  const { section } = props

  const t = useTranslations('routeState')
  const label = t('loading', { section: t(`sections.${section}`) })

  return (
    // biome-ignore lint/a11y/useSemanticElements: This loading status contains page-level blocks, not a calculated form output.
    <div aria-label={label} role="status">
      <h1 className="sr-only">{label}</h1>
      <div aria-hidden="true">
        <div className="mb-[22px] grid gap-[3px]">
          <SkeletonLoader className="h-2 w-16" />
          <SkeletonLoader className="h-8 w-40" />
          <SkeletonLoader className="mt-0.5 h-3 w-80 max-w-full" />
        </div>
        <SkeletonContent section={section} />
      </div>
    </div>
  )
}
