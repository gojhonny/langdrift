'use client'

import { type ReactNode, useEffect, useState } from 'react'

import type { DashboardSection } from '@domain'

import { DashboardPageSkeleton } from './dashboard-page-skeleton'

interface TimedPageGateProps {
  children: ReactNode
  section: DashboardSection
}

export function TimedPageGate(props: TimedPageGateProps) {
  const { children, section } = props

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
