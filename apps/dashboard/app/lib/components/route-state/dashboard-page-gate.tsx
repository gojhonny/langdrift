'use client'

import { usePathname } from 'next/navigation'
import { type ReactNode } from 'react'

import type { DashboardSection } from '@domain'

import { TimedPageGate } from './timed-page-gate'

interface DashboardPageGateProps {
  children: ReactNode
  section: DashboardSection
}

export function DashboardPageGate(props: DashboardPageGateProps) {
  const { children, section } = props

  const pathname = usePathname()

  return (
    <TimedPageGate key={pathname} section={section}>
      {children}
    </TimedPageGate>
  )
}
