'use client'

import { CaretDown } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'
import { useId, useState } from 'react'
import type { ReactNode } from 'react'

import './basic-accordion.css'

export interface AccordionItem {
  id: string | number
  title: ReactNode
  content: ReactNode
}

export interface BasicAccordionProps {
  items: readonly AccordionItem[]
  allowMultiple?: boolean
  defaultExpandedIds?: readonly (string | number)[]
  headingLevel?: 2 | 3 | 4 | 5 | 6
  layoutId?: string
  className?: string
}

/** SmoothUI Basic Accordion, adapted for heading order and unique ARIA IDs. */
export function BasicAccordion({
  items,
  allowMultiple = false,
  defaultExpandedIds = [],
  headingLevel = 5,
  layoutId,
  className = ''
}: BasicAccordionProps) {
  const generatedId = useId()
  const prefix = `${layoutId ?? 'smooth-accordion'}-${generatedId}`
  const reduceMotion = useReducedMotion()
  const [expandedIds, setExpandedIds] = useState<Array<string | number>>(() =>
    allowMultiple
      ? [...defaultExpandedIds]
      : [...defaultExpandedIds.slice(0, 1)]
  )
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

  function toggleItem(id: string | number) {
    setExpandedIds((current) =>
      current.includes(id)
        ? current.filter((expandedId) => expandedId !== id)
        : allowMultiple
          ? [...current, id]
          : [id]
    )
  }

  return (
    <div className={`smooth-basic-accordion ${className}`}>
      {items.map((item) => {
        const expanded = expandedIds.includes(item.id)
        const triggerId = `${prefix}-trigger-${item.id}`
        const regionId = `${prefix}-region-${item.id}`

        return (
          <div className="smooth-accordion-item" key={item.id}>
            <Heading className="smooth-accordion-heading">
              <button
                aria-controls={regionId}
                aria-expanded={expanded}
                className="smooth-accordion-trigger"
                id={triggerId}
                onClick={() => toggleItem(item.id)}
                type="button"
              >
                <span>{item.title}</span>
                <motion.span
                  animate={{ rotate: expanded ? 180 : 0 }}
                  aria-hidden="true"
                  className="smooth-accordion-chevron"
                  initial={false}
                  transition={{ duration: reduceMotion ? 0 : 0.2 }}
                >
                  <CaretDown size={16} />
                </motion.span>
              </button>
            </Heading>
            <motion.div
              animate={{
                height: expanded ? 'auto' : 0,
                opacity: expanded ? 1 : 0
              }}
              aria-hidden={!expanded}
              aria-labelledby={triggerId}
              className="smooth-accordion-region"
              id={regionId}
              inert={!expanded}
              initial={false}
              role="region"
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { height: { duration: 0.2 }, opacity: { duration: 0.15 } }
              }
            >
              <div className="smooth-accordion-content">{item.content}</div>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
