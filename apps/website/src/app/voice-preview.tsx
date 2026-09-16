'use client'

import { AgentOrb, type AgentOrbState } from '@repo/react/ui/agent-orb'
import { useEffect, useRef, useState } from 'react'

import './voice-preview.css'

const scriptedStates: AgentOrbState[] = ['listening', 'thinking', 'speaking', 'idle']

export function VoicePreview() {
  const [state, setState] = useState<AgentOrbState>('idle')
  const [showAnswer, setShowAnswer] = useState(false)
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([])

  useEffect(() => {
    return () => {
      for (const timer of timers.current) clearTimeout(timer)
    }
  }, [])

  function runPreview() {
    for (const timer of timers.current) clearTimeout(timer)
    timers.current = []
    setShowAnswer(false)

    scriptedStates.forEach((nextState, index) => {
      const timer = setTimeout(() => {
        setState(nextState)
        if (nextState === 'speaking') setShowAnswer(true)
      }, index * 850)
      timers.current.push(timer)
    })
  }

  return (
    <div className="voice-preview">
      <div className="voice-orb-wrap" aria-hidden="true">
        <AgentOrb size="190px" speed={0.82} state={state} />
      </div>
      <div className="voice-copy">
        <span className="section-kicker section-kicker-dark">Executive voice</span>
        <h2>Ask the same model you can see.</h2>
        <p>
          Voice sits on top of structured Product Vision, Drift, attribution, and
          evidence — not a separate chat history.
        </p>
        <div className="voice-question">
          <span>“Why did Product Vision move this week?”</span>
          <button type="button" onClick={runPreview}>
            Run preview
          </button>
        </div>
        <div aria-live="polite" className={`voice-answer ${showAnswer ? 'voice-answer-visible' : ''}`}>
          <div className="voice-answer-stat">
            <strong>−9 pts</strong>
            <span>largest move</span>
          </div>
          <div>
            <strong>Pricing direction changed.</strong>
            <p>
              Proposed by Product, approved in the Q3 review, classified as
              Intentional Evolution with linked evidence.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
