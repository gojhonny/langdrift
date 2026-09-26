import { Heading } from '@components/page-heading/page-heading'
import { DashboardPageGate } from '@components/route-state/dashboard-page-gate'
import { Settings } from '@views'

export default function SettingsPage() {
  return (
    <DashboardPageGate section="settings">
      <Heading section="settings" />
      <Settings />
    </DashboardPageGate>
  )
}
