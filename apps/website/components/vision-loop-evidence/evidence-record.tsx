'use client'

import { type EvidenceCopy } from '@lib/vision-loop-content'
import { BasicAccordion } from '@repo/react/vendors/smoothui'

interface EvidenceRecordProps {
  copy: EvidenceCopy
  id: string
  sourceLabel: string
}

export function EvidenceRecord(props: EvidenceRecordProps) {
  const { copy, id, sourceLabel } = props

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
