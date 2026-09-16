'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

export interface AvatarPerson {
  initials: string
  name: string
  role?: string
}

export interface AnimatedAvatarGroupProps {
  people: AvatarPerson[]
  size?: number
}

export function AnimatedAvatarGroup({
  people,
  size = 28
}: AnimatedAvatarGroupProps) {
  const [expanded, setExpanded] = useState(false)
  const reduceMotion = useReducedMotion()

  return (
    <fieldset
      aria-label={people.map((person) => person.name).join(', ')}
      className="avatar-group"
      onBlur={() => setExpanded(false)}
      onFocus={() => setExpanded(true)}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{ border: 0, margin: 0, minInlineSize: 0, padding: 0 }}
    >
      {people.map((person, index) => (
        <motion.span
          animate={{ marginLeft: index === 0 || expanded ? 0 : -size * 0.28 }}
          className="avatar-chip"
          key={person.name}
          style={{ height: size, width: size, zIndex: people.length - index }}
          title={`${person.name}${person.role ? ` · ${person.role}` : ''}`}
          transition={{ duration: reduceMotion ? 0 : 0.18 }}
        >
          {person.initials}
        </motion.span>
      ))}
    </fieldset>
  )
}
