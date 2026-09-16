'use client'

import { ArrowRight, Moon, Sun } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

import { Brand } from '../../ui/brand'
import { ChromaText } from './chroma-text'

const tiles = Array.from({ length: 400 }, (_, index) => `hero-tile-${index}`)

export interface Header4Props {
  actions?: ReactNode
  eyebrow?: string
  onThemeToggle?: () => void
  theme?: 'dark' | 'light'
}

export function Header4({
  actions,
  eyebrow = 'Visual intelligence for what changes',
  onThemeToggle,
  theme = 'light'
}: Header4Props) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="header-four">
      <header className="header-four-nav">
        <a aria-label="LangDrift home" href="#top">
          <Brand compact tone={theme === 'dark' ? 'dark' : 'light'} />
        </a>
        <nav aria-label="Primary navigation">
          <a href="#product">Product</a>
          <a href="#why">Why</a>
          <a href="#pricing">Plans</a>
        </nav>
        <div className="header-four-actions">
          <button
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="smooth-icon-button"
            onClick={onThemeToggle}
            type="button"
          >
            {theme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </button>
          {actions}
        </div>
      </header>
      <div aria-hidden="true" className="header-four-grid">
        {tiles.map((tile) => (
          <span key={tile} />
        ))}
      </div>
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
          Keep your product <ChromaText>aligned with vision</ChromaText> as it evolves.
        </h1>
        <p>
          LangDrift shows what changed, why it changed, who changed it, and whether
          evolution was intentional or unexplained.
        </p>
        <div className="header-four-cta">
          <a className="smooth-primary-button" href="#product">
            See what moved <ArrowRight aria-hidden="true" size={15} />
          </a>
          <a className="smooth-text-link" href="#why">
            How LangDrift explains change
          </a>
        </div>
      </motion.div>
    </section>
  )
}
