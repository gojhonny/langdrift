import { BaselineProvenance } from '@components/baseline-provenance/baseline-provenance'
import { Heading } from '@components/page-heading/page-heading'
import { DashboardPageGate } from '@components/route-state/dashboard-page-gate'

export default function VisionBaselinePage() {
  return (
    <DashboardPageGate section="vision-baseline">
      <Heading section="vision-baseline" />
      <BaselineProvenance />
    </DashboardPageGate>
  )
}
