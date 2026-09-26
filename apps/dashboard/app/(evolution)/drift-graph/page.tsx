import { Heading } from '@components/page-heading/page-heading'
import { DashboardPageGate } from '@components/route-state/dashboard-page-gate'
import { Evolution } from '@views'

export default function DriftGraphPage() {
  return (
    <DashboardPageGate section="drift-graph">
      <Heading section="drift-graph" />
      <Evolution />
    </DashboardPageGate>
  )
}
