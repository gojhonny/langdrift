'use client'

import { motion } from 'motion/react'
import type { MouseEvent, ReactNode } from 'react'

export interface GlowHoverCardProps {
  children: ReactNode
  className?: string
  selected?: boolean
}

export function GlowHoverCard({
  children,
  className = '',
  selected = false
}: GlowHoverCardProps) {
  function move(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--glow-x', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--glow-y', `${event.clientY - rect.top}px`)
  }

  return (
    <motion.div
      className={`glow-card ${selected ? 'glow-card-selected' : ''} ${className}`}
      onMouseMove={move}
    >
      {children}
    </motion.div>
  )
}
