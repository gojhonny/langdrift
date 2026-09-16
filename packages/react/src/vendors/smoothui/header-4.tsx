'use client'

import { ArrowRight } from '@phosphor-icons/react'
import { ThemeToggle } from '../../ui/theme-toggle'
import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

import { Brand } from '../../ui/brand'
import { ChromaText } from './chroma-text'

export interface Header4Props {
  actions?: ReactNode
  eyebrow?: string
  onThemeToggle?: () => void
  theme?: 'dark' | 'light'
  visual?: ReactNode
}

export function Header4({
  actions,
  eyebrow = 'Visual-first for truth · Voice-first for inquiry',
  onThemeToggle,
  theme = 'light',
  visual
}: Header4Props) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="header-four">
      <header className="header-four-nav">
        <a aria-label="LangDrift home" href="#top">
          <Brand compact tone={theme === 'dark' ? 'dark' : 'light'} />
        </a>
        <nav aria-label="Primary navigation">
          <a href="#why">Product</a>
          <a href="#attribution">Attribution</a>
          <a href="#voice">Voice</a>
          <a href="#pricing">Plans</a>
        </nav>
        <div className="header-four-actions">
          {actions}
          {onThemeToggle ? <ThemeToggle onToggle={onThemeToggle} theme={theme} /> : null}
        </div>
      </header>
      <div aria-hidden="true" className="header-four-grid" />
      <div className="header-four-stage">
        <motion.div
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          className="header-four-copy"
          initial={{
            filter: reduceMotion ? 'blur(0px)' : 'blur(10px)',
            opacity: 0,
            y: reduceMotion ? 0 : 18
          }}
        >
          <span className="header-four-eyebrow">{eyebrow}</span>
          <h1>
            Why did your Product Vision fall from <ChromaText>91% to 73%?</ChromaText>
          </h1>
          <p>
            LangDrift shows how your product moved from the vision you intended —
            what changed, who moved it, why it happened, and whether the change was
            intentional.
          </p>
          <div className="header-four-cta">
            <a className="smooth-primary-button" href="#why">
              See what moved <ArrowRight aria-hidden="true" size={15} />
            </a>
            <a className="smooth-text-link" href="#attribution">
              How it works
            </a>
          </div>
        </motion.div>
        {visual ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="header-four-visual"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
            transition={{ delay: reduceMotion ? 0 : 0.12, duration: reduceMotion ? 0 : 0.42 }}
          >
            {visual}
          </motion.div>
        ) : null}
      </div>
    </section>
  )
}
