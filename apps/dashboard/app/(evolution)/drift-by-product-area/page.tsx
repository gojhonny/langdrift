import { Heading } from '@components/page-heading/page-heading'
import { DashboardPageGate } from '@components/route-state/dashboard-page-gate'
import { Evolution } from '@views'

export default function DriftByProductAreaPage() {
  return (
    <DashboardPageGate section="drift-by-product-area">
      <Heading section="drift-by-product-area" />
      <Evolution />
    </DashboardPageGate>
  )
}
