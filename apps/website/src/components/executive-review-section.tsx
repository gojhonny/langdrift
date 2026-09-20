import type { WebsiteLocale } from '../i18n/routing'
import { executiveReviewMessages } from '../messages/executive-review'
import { ExecutiveReviewDemo } from './executive-review-demo'
import './executive-review.css'

export function ExecutiveReviewSection({ locale }: { locale: WebsiteLocale }) {
  const copy = executiveReviewMessages[locale]
  return (
    <section
      id="executive-review"
      className="executive-review-section"
      aria-labelledby="executive-review-heading"
    >
      <div className="executive-review-intro">
        <span className="section-kicker">{copy.eyebrow}</span>
        <h2 id="executive-review-heading">{copy.title}</h2>
        <p>{copy.description}</p>
      </div>
      <ExecutiveReviewDemo copy={copy} locale={locale} />
    </section>
  )
}
