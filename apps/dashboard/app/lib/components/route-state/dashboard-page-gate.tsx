'use client'

import type { DashboardSection } from '@domain'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { DashboardPageSkeleton } from './dashboard-page-skeleton'

function TimedPageGate({
  children,
  section
}: {
  children: ReactNode
  section: DashboardSection
}) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 1000)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div aria-busy={!ready}>
      {ready ? children : <DashboardPageSkeleton section={section} />}
    </div>
  )
}

export function DashboardPageGate({
  children,
  section
}: {
  children: ReactNode
  section: DashboardSection
}) {
  const pathname = usePathname()

  return (
    <TimedPageGate key={pathname} section={section}>
      {children}
    </TimedPageGate>
  )
}
