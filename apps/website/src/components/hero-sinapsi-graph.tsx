'use client'

import type {} from 'sinapsi/react-types'
import { useAtomValue } from 'jotai'
import { useTranslations } from 'next-intl'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { SinapsiElement } from 'sinapsi'
import { getHeroGraph } from '../lib/hero-demo-data'
import { themeAtom } from '../state'

export function HeroSinapsiGraph() {
  const t = useTranslations('demo')
  const theme = useAtomValue(themeAtom)
  const elementRef = useRef<SinapsiElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>(
    'loading'
  )
  const descriptionId = useId()
  const headingId = useId()
  const graph = useMemo(() => getHeroGraph(t), [t])

  useEffect(() => {
    let cancelled = false
    const timeout = window.setTimeout(() => {
      if (!cancelled) setStatus('failed')
    }, 15000)

    async function mountGraph() {
      try {
        // Browser registration is idempotent, including remounts and HMR.
        if (!customElements.get('sinaps-i')) await import('sinapsi/browser')
        await customElements.whenDefined('sinaps-i')
        if (cancelled || !elementRef.current) return
        elementRef.current.nodes = graph
        setStatus('ready')
      } catch {
        if (!cancelled) setStatus('failed')
      } finally {
        window.clearTimeout(timeout)
      }
    }

    void mountGraph()
    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [graph])

  return (
    <section
      aria-describedby={descriptionId}
      aria-labelledby={headingId}
      className="hero-graph-region"
    >
      <div className="hero-graph-heading">
        <h2 id={headingId}>{t('graph.title')}</h2>
        <p>{t('graph.description')}</p>
      </div>
      <p className="ld-visually-hidden" id={descriptionId}>
        {t('graph.instructions')} {t('graph.summary')}
      </p>
      <div className="hero-graph-stage" data-status={status}>
        <sinaps-i
          className="hero-sinapsi"
          color-muted={theme === 'dark' ? '#A1A1AA' : '#6B6B75'}
          color-primary="#F97316"
          color-text="#212121"
          move="idle"
          ref={elementRef}
        />
        {status !== 'ready' ? (
          <output className="hero-graph-fallback">
            {t(status === 'failed' ? 'graph.fallback' : 'graph.loading')}
          </output>
        ) : null}
      </div>
    </section>
  )
}
