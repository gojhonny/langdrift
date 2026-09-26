import { Heading } from '@components/page-heading/page-heading'
import { DashboardPageGate } from '@components/route-state/dashboard-page-gate'
import { Evolution } from '@views'

export default function IntentionalDriftPage() {
  return (
    <DashboardPageGate section="evolution">
      <Heading section="evolution" />
      <Evolution />
    </DashboardPageGate>
  )
}
