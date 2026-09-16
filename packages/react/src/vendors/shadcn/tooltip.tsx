import type { ReactNode } from 'react'

import './tooltip.css'

export interface TooltipProps {
  children: ReactNode
  content: ReactNode
}

export function Tooltip({ children, content }: TooltipProps) {
  return (
    <span className="shadcn-tooltip">
      <span className="shadcn-tooltip-trigger">{children}</span>
      <span className="shadcn-tooltip-content" role="tooltip">
        {content}
      </span>
    </span>
  )
}
