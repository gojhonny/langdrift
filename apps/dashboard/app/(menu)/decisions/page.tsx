import { Heading } from '@components/page-heading/page-heading'
import { DashboardPageGate } from '@components/route-state/dashboard-page-gate'
import { Decisions } from '@views'

export default function DecisionsPage() {
  return (
    <DashboardPageGate section="decisions">
      <Heading section="decisions" />
      <Decisions />
    </DashboardPageGate>
  )
}
