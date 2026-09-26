// AGENT: for root level absolute imports we should have just one folder level, e.g. from '@components'
// import { DashboardPageSkeleton } from '@components'
import { DashboardPageSkeleton } from '@components/route-state/dashboard-page-skeleton'

export default function Loading() {
  return <DashboardPageSkeleton section="overview" />
}
