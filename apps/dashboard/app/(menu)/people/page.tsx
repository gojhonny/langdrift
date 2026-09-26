import { Heading } from '@components/page-heading/page-heading'
import { DashboardPageGate } from '@components/route-state/dashboard-page-gate'
import { People } from '@views'

export default function PeoplePage() {
  return (
    <DashboardPageGate section="people">
      <Heading section="people" />
      <People />
    </DashboardPageGate>
  )
}
