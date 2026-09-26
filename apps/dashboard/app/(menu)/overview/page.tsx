import { Heading } from '@components/page-heading/page-heading'
import { DashboardPageGate } from '@components/route-state/dashboard-page-gate'
import { Overview } from '@views'

export default function OverviewPage() {
  return (
    <DashboardPageGate section="overview">
      <Heading section="overview" />
      <Overview />
    </DashboardPageGate>
  )
}
