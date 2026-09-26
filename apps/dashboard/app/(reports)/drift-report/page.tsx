import { Heading } from '@components/page-heading/page-heading'
import { DashboardPageGate } from '@components/route-state/dashboard-page-gate'
import { Reports } from '@views'

export default function DriftReportPage() {
  return (
    <DashboardPageGate section="drift-report">
      <Heading section="drift-report" />
      <Reports />
    </DashboardPageGate>
  )
}
