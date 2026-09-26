import { Heading } from '@components/page-heading/page-heading'
import { DashboardPageGate } from '@components/route-state/dashboard-page-gate'
import { Reports } from '@views'

export default function ReportsPage() {
  return (
    <DashboardPageGate section="reports">
      <Heading section="reports" />
      <Reports />
    </DashboardPageGate>
  )
}
