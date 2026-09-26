'use client'

import { BaselineProvenance } from '@components/baseline-provenance/baseline-provenance'
import { EvolutionControls } from '@components/evolution-controls/evolution-controls'
import { GroupedEvolution } from '@components/grouped-evolution/grouped-evolution'
import { VisionPanel } from '@components/vision-panel/vision-panel'

export function Evolution() {
  return (
    <>
      <EvolutionControls />
      <VisionPanel />
      <GroupedEvolution />
      <BaselineProvenance />
    </>
  )
}
