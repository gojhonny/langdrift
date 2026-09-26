'use client'

import { DashboardRouteError } from '@components/route-state/dashboard-route-error'

interface RouteErrorProps {
  retry: () => void
}

export default function RouteError(props: RouteErrorProps) {
  const { retry } = props

  return <DashboardRouteError retry={retry} />
}
