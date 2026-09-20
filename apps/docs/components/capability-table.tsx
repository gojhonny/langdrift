import { integrationCapabilities } from '@langdrift/sdk/integrations'

type Integration = keyof typeof integrationCapabilities
type Capability = (typeof integrationCapabilities)[Integration]

const integrationNames: Record<Integration, string> = {
  github: 'GitHub',
  langdrift: 'LangDrift',
  linear: 'Linear',
  obsidian: 'Obsidian'
}

const capabilityDescriptions: Record<Capability, string> = {
  'deterministic-fixture-mapper': 'Deterministic merged pull request mapper',
  'injected-transport': 'Injected payload transport',
  'interface-only': 'Adapter interface only'
}

const entries = Object.entries(integrationCapabilities) as [
  Integration,
  Capability
][]

export function CapabilityTable() {
  return (
    <table className="ld-docs-capability-table">
      <caption>Current integration capabilities</caption>
      <thead>
        <tr>
          <th scope="col">Integration</th>
          <th scope="col">Current capability</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(([integration, capability]) => (
          <tr key={integration}>
            <th scope="row">{integrationNames[integration]}</th>
            <td>{capabilityDescriptions[capability]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
