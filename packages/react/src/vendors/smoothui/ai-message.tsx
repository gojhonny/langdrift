'use client'

import { Sparkle } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

export interface AIMessageProps {
  children: ReactNode
  label?: string
  role?: 'assistant' | 'user'
}

export function AIMessage({
  children,
  label = 'LangDrift',
  role = 'assistant'
}: AIMessageProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={`ai-message ai-message-${role}`}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
      transition={{ duration: reduceMotion ? 0 : 0.22 }}
    >
      <span className="ai-message-label">
        {role === 'assistant' ? <Sparkle aria-hidden="true" size={13} /> : null}
        {role === 'assistant' ? label : 'You'}
      </span>
      <div>{children}</div>
    </motion.div>
  )
}
