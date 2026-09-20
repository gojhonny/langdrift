import type { WebsiteLocale } from '../i18n/routing'
import { visionLoopMessages } from '../messages/vision-loop'
import { VisionLoopEvidenceDemo } from './vision-loop-evidence-demo'
import './vision-loop-evidence.css'

export function VisionLoopEvidenceSection({
  locale
}: {
  locale: WebsiteLocale
}) {
  const copy = visionLoopMessages[locale]

  return (
    <section
      className="vision-loop-section"
      id="why"
      aria-labelledby="vision-loop-heading"
    >
      <div className="vision-loop-intro">
        <h2 id="vision-loop-heading">{copy.heading}</h2>
        <p>{copy.introduction}</p>
      </div>
      <VisionLoopEvidenceDemo
        labels={copy.labels}
        scenarios={copy.scenarios}
        selectorLabel={copy.selectorLabel}
      />
      <div className="vision-loop-outro">
        <p>{copy.driftExplanation}</p>
        <a className="smooth-text-link" href="#attribution">
          {copy.continueToAttribution}
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  )
}
