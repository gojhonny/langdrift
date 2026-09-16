'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

export interface ContextBreakdownItem {
  label: string
  value: number
}

export interface AIContextMeterProps {
  breakdown?: ContextBreakdownItem[]
  label?: string
  limit: number
  used: number
}

export function AIContextMeter({
  breakdown = [],
  label = 'Evidence context',
  limit,
  used
}: AIContextMeterProps) {
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const fraction = limit > 0 ? Math.min(1, Math.max(0, used / limit)) : 0
  const percent = Math.round(fraction * 100)
  const circumference = 2 * Math.PI * 13
  const offset = circumference * (1 - fraction)

  return (
    <span className="context-meter">
      <button
        aria-expanded={open}
        className="context-meter-trigger"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <svg aria-hidden="true" viewBox="0 0 32 32">
          <circle className="context-meter-track" cx="16" cy="16" r="13" />
          <motion.circle
            animate={{ strokeDashoffset: offset }}
            className="context-meter-value"
            cx="16"
            cy="16"
            initial={false}
            r="13"
            strokeDasharray={circumference}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
          />
        </svg>
        <span>{percent}%</span>
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="context-meter-popover"
            exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.98, y: 3 }}
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.98, y: 3 }}
          >
            <strong>{label}</strong>
            <span>
              {used} of {limit} signals loaded
            </span>
            {breakdown.map((item) => (
              <div className="context-breakdown" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </span>
  )
}
