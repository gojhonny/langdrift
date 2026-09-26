import { Heading } from '@components/page-heading/page-heading'
import { DashboardPageGate } from '@components/route-state/dashboard-page-gate'
import { Evolution } from '@views'

export default function DriftByTeamPage() {
  return (
    <DashboardPageGate section="drift-by-team">
      <Heading section="drift-by-team" />
      <Evolution />
    </DashboardPageGate>
  )
}
