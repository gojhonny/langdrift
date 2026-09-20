'use client'

import { AnimatedTabs, BasicAccordion } from '@repo/react/vendors/smoothui'
import { useId, useState } from 'react'

import {
  type EvidenceCopy,
  type ScenarioId,
  type VisionLoopMessages,
  visionLoopScenarios
} from '../lib/vision-loop-content'

type DemoProps = Pick<
  VisionLoopMessages,
  'labels' | 'scenarios' | 'selectorLabel'
>

function PillarIcon({ type }: { type: 'vision' | 'loop' | 'evidence' }) {
  return (
    <svg
      aria-hidden="true"
      className="vle-pillar-icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {type === 'vision' ? (
        <>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3m0 14v3M2 12h3m14 0h3" />
        </>
      ) : type === 'loop' ? (
        <path d="M19.4 8A8 8 0 0 0 5 5L3 8m0-5v5h5M4.6 16A8 8 0 0 0 19 19l2-3m0 5v-5h-5" />
      ) : (
        <path d="M7 3h7l4 4v14H6V3h1m7 0v5h4M9 12h6m-6 4h6" />
      )}
    </svg>
  )
}

function EvidenceRecord({
  copy,
  id,
  sourceLabel
}: {
  copy: EvidenceCopy
  id: string
  sourceLabel: string
}) {
  return (
    <li className="vle-evidence-record">
      <span className="vle-record-kind">{copy.kindLabel}</span>
      <h4>{copy.title}</h4>
      <p>{copy.summary}</p>
      <BasicAccordion
        className="vle-source-context"
        headingLevel={5}
        items={[
          {
            id,
            title: (
              <>
                {sourceLabel}
                <span className="website-sr-only">: {copy.title}</span>
              </>
            ),
            content: <p>{copy.sourceContext}</p>
          }
        ]}
      />
    </li>
  )
}

export function VisionLoopEvidenceDemo({
  labels,
  scenarios,
  selectorLabel
}: DemoProps) {
  const instanceId = useId()
  const [scenarioId, setScenarioId] = useState<ScenarioId>('priority-shift')
  const tabs = visionLoopScenarios.map(({ id }) => ({
    id,
    label: scenarios[id].tabLabel
  }))

  return (
    <div className="vision-loop-demo">
      <span className="vle-selector-label">{selectorLabel}</span>
      <AnimatedTabs
        tabs={tabs}
        activeTab={scenarioId}
        onChange={(id) => {
          const nextScenario = visionLoopScenarios.find(
            (scenario) => scenario.id === id
          )
          if (nextScenario) setScenarioId(nextScenario.id)
        }}
        variant="underline"
        layoutId={instanceId}
        ariaLabel={selectorLabel}
        className="vle-scenario-tabs"
      />
      {visionLoopScenarios.map((scenario) => {
        const copy = scenarios[scenario.id]
        const active = scenario.id === scenarioId
        return (
          <div
            key={scenario.id}
            role="tabpanel"
            id={`${instanceId}-panel-${scenario.id}`}
            aria-labelledby={`${instanceId}-tab-${scenario.id}`}
            tabIndex={active ? 0 : -1}
            hidden={!active}
            className="vle-panel"
          >
            {active ? (
              <div className="vle-scenario-content" data-scenario={scenario.id}>
                <p className="vle-scenario-context">{copy.context}</p>
                <div className="vle-surface">
                  <div className="vle-pillars">
                    <div className="vle-pillar vle-vision">
                      <div className="vle-pillar-heading">
                        <PillarIcon type="vision" />
                        <h3>{labels.vision}</h3>
                        <span className="vle-connector" aria-hidden="true">
                          →
                        </span>
                      </div>
                      <dl className="vle-vision-target">
                        <div>
                          <dt>{labels.target}</dt>
                          <dd>{copy.vision.target}</dd>
                        </div>
                        <div>
                          <dt>{labels.audience}</dt>
                          <dd>{copy.vision.audience}</dd>
                        </div>
                        <div>
                          <dt>{labels.successCriterion}</dt>
                          <dd>{copy.vision.successCriterion}</dd>
                        </div>
                      </dl>
                    </div>
                    <div className="vle-pillar vle-loop">
                      <div className="vle-pillar-heading">
                        <PillarIcon type="loop" />
                        <h3>{labels.loop}</h3>
                        <span className="vle-connector" aria-hidden="true">
                          →
                        </span>
                      </div>
                      <ol className="vle-loop-records">
                        {scenario.loop.map((id) => (
                          <li key={id}>
                            <h4>{copy.loop[id].label}</h4>
                            <p>{copy.loop[id].description}</p>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div className="vle-pillar vle-evidence">
                      <div className="vle-pillar-heading">
                        <PillarIcon type="evidence" />
                        <h3>{labels.evidence}</h3>
                      </div>
                      <p className="vle-records-label">
                        {labels.supportingRecords}
                      </p>
                      <ul className="vle-evidence-records">
                        {scenario.evidence.map((id) => (
                          <EvidenceRecord
                            key={id}
                            id={`${instanceId}-${scenario.id}-${id}`}
                            copy={copy.evidence[id]}
                            sourceLabel={labels.sourceContext}
                          />
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="vle-interpretation">
                    <div>
                      <span className="vle-label">{labels.interpretation}</span>
                      <h3>{copy.interpretation.title}</h3>
                    </div>
                    <div className="vle-interpretation-copy">
                      <p>{copy.interpretation.description}</p>
                      <div className="vle-open-question">
                        <span className="vle-label">{labels.openQuestion}</span>
                        <p>{copy.interpretation.openQuestion}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
