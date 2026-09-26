'use client'

import { DashboardRouteError } from '@components/route-state/dashboard-route-error'

export default function RouteError({ retry }: { retry: () => void }) {
  return <DashboardRouteError retry={retry} />
}
