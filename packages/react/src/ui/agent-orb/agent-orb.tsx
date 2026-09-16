'use client'

import '@neongate-ai/orbz/react-types'
import '@neongate-ai/orbz/browser'

import {
  normalizeOrbzSize,
  type OrbzPresetName,
  type OrbzReducedMotion,
  type OrbzSize,
  type OrbzState
} from '@neongate-ai/orbz'

export interface AgentOrbProps {
  paused?: boolean
  preset?: OrbzPresetName
  reducedMotion?: OrbzReducedMotion
  size?: OrbzSize
  speed?: number
  state?: OrbzState
}

export function AgentOrb({
  paused = false,
  preset = 'peach',
  reducedMotion = 'system',
  size = '160px',
  speed = 0.9,
  state = 'idle'
}: AgentOrbProps) {
  return (
    // The Orbz host is decorative. Interaction belongs to the surrounding control.
    // biome-ignore lint/a11y/noAriaHiddenOnFocusable: custom elements are conservatively treated as focusable.
    <orb-z
      aria-hidden="true"
      paused={paused}
      preset={preset}
      reduced-motion={reducedMotion}
      size={normalizeOrbzSize(size)}
      speed={speed}
      state={state}
    />
  )
}
