import { Heading } from '@components/page-heading/page-heading'
import { DashboardPageGate } from '@components/route-state/dashboard-page-gate'
import { Evolution } from '@views'

export default function DriftEventsPage() {
  return (
    <DashboardPageGate section="drift-events">
      <Heading section="drift-events" />
      <Evolution />
    </DashboardPageGate>
  )
}
