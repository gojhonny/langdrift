'use client'

import '@neongate-ai/orbz/react-types'
import '@neongate-ai/orbz/browser'

import {
  normalizeOrbzSize,
  type OrbzReducedMotion,
  type OrbzSize,
  type OrbzState
} from '@neongate-ai/orbz'

import { LANGDRIFT_ORB_CONFIG, type LangDriftOrbColors } from './orb-config'

export interface AgentOrbProps {
  colors?: Partial<LangDriftOrbColors>
  paused?: boolean
  reducedMotion?: OrbzReducedMotion
  size?: OrbzSize
  speed?: number
  state?: OrbzState
}

export function AgentOrb({
  colors,
  paused = false,
  reducedMotion = LANGDRIFT_ORB_CONFIG.reducedMotion,
  size = '160px',
  speed = LANGDRIFT_ORB_CONFIG.speed,
  state = 'idle'
}: AgentOrbProps) {
  const palette = { ...LANGDRIFT_ORB_CONFIG.colors, ...colors }

  return (
    // The Orbz host is decorative. Interaction belongs to the surrounding control.
    // biome-ignore lint/a11y/noAriaHiddenOnFocusable: custom elements are conservatively treated as focusable.
    <orb-z
      aria-hidden="true"
      color-accent={palette.accent}
      color-background={palette.background}
      color-highlight={palette.highlight}
      color-primary={palette.primary}
      color-secondary={palette.secondary}
      paused={paused}
      reduced-motion={reducedMotion}
      size={normalizeOrbzSize(size)}
      speed={speed}
      state={state}
    />
  )
}
