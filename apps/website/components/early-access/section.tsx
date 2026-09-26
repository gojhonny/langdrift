import type { WebsiteLocale } from '@i18n/routing'
import { earlyAccessMessages } from '@messages/early-access'

import { EarlyAccessForm } from './form'
import './early-access.css'

interface EarlyAccessSectionProps {
  locale: WebsiteLocale
  source: 'landing' | 'pricing'
  compact?: boolean
}

export function EarlyAccessSection(props: EarlyAccessSectionProps) {
  const { locale, source, compact = false } = props

  const copy = earlyAccessMessages[locale]
  const headingId = `early-access-${source}-heading`
  const helperId = `early-access-${source}-helper`

  return (
    <section
      id="early-access"
      className={`early-access-section${compact ? ' early-access-compact' : ''}`}
      aria-labelledby={headingId}
    >
      <div className="early-access-surface">
        <div className="early-access-intro">
          <h2 id={headingId}>
            {source === 'pricing' ? copy.pricingHeading : copy.homeHeading}
          </h2>
          <p>{copy.description}</p>
          <p id={helperId} className="early-access-trial-note">
            {copy.helper}
          </p>
        </div>
        <EarlyAccessForm
          copy={copy}
          helperId={helperId}
          locale={locale}
          source={source}
        />
      </div>
    </section>
  )
}
