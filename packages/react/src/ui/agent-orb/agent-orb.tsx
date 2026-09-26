'use client'

import '@neongate-ai/orbz/react-types'

import type {
  OrbzPresetName,
  OrbzReducedMotion,
  OrbzSize,
  OrbzState
} from '@neongate-ai/orbz'
import { afterPaint } from '@repo/react/utilities'
import { useEffect } from 'react'

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
  useEffect(
    () =>
      afterPaint(() => {
        // A failed decorative runtime leaves the size-preserving static orb available.
        void import('@neongate-ai/orbz/browser').catch(() => {})
      }),
    []
  )

  // Match Orbz's size contract without eagerly importing its browser/runtime graph.
  const rawSize = String(size).trim()
  const numericSize = Number(rawSize)
  const dimension =
    !rawSize ||
    (typeof size === 'number' && !Number.isFinite(size)) ||
    (Number.isFinite(numericSize) && numericSize <= 0)
      ? '16rem'
      : Number.isFinite(numericSize)
        ? `${numericSize}px`
        : rawSize

  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 overflow-hidden rounded-full bg-[radial-gradient(circle_at_35%_30%,#fed7aa,#fb923c_50%,#c2410c)]"
      style={{
        height: dimension,
        width: dimension
      }}
    >
      {/* Interaction belongs to the surrounding control, not the decorative host. */}
      <orb-z
        paused={paused}
        preset={preset}
        reduced-motion={reducedMotion}
        size={dimension}
        speed={speed}
        state={state}
      />
    </span>
  )
}
