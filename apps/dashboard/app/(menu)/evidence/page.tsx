import { Heading } from '@components/page-heading/page-heading'
import { DashboardPageGate } from '@components/route-state/dashboard-page-gate'
import { Evidence } from '@views'

export default function EvidencePage() {
  return (
    <DashboardPageGate section="evidence">
      <Heading section="evidence" />
      <Evidence />
    </DashboardPageGate>
  )
}
