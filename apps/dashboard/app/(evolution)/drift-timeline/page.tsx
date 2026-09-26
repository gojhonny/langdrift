import { Heading } from '@components/page-heading/page-heading'
import { DashboardPageGate } from '@components/route-state/dashboard-page-gate'
import { Evolution } from '@views'

export default function DriftTimelinePage() {
  return (
    <DashboardPageGate section="drift-timeline">
      <Heading section="drift-timeline" />
      <Evolution />
    </DashboardPageGate>
  )
}
