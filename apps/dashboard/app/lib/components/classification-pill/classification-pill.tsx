'use client'

import { useTranslations } from 'next-intl'

import { classificationText } from '@repo/react/ui/classification-text'
import { type VisionDriftEvent } from '@repo/react/ui/product-vision-curve'
import { cn } from '@template/formatters/cn.fmt'

interface ClassificationPillProps {
  className?: string
  classification: VisionDriftEvent['classification']
}

export function ClassificationPill(props: ClassificationPillProps) {
  const { className, classification } = props

  const t = useTranslations('view')

  return (
    <span
      className={cn(
        'rounded-full border border-hairline px-1.5 py-1 text-[8px]',
        className,
        classificationText[classification]
      )}
    >
      {t(`classifications.${classification}`)}
    </span>
  )
}
