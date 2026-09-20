import { BasicAccordion } from '@repo/react/vendors/smoothui'
import type { WebsiteLocale } from '../i18n/routing'
import { conversionMessages } from '../messages/conversion'
import './conversion.css'

const faqIds = [
  'meaning',
  'expected',
  'connection',
  'tools',
  'trial',
  'free',
  'paid',
  'availability'
] as const

export function FaqSection({ locale }: { locale: WebsiteLocale }) {
  const copy = conversionMessages[locale].faq
  return (
    <section
      className="conversion-section faq-section"
      id="faq"
      aria-labelledby="faq-heading"
    >
      <div className="faq-introduction">
        <h2 id="faq-heading">{copy.title}</h2>
        <p className="conversion-introduction">{copy.description}</p>
        <p className="faq-offer">{copy.offer}</p>
      </div>
      <BasicAccordion
        className="website-faq"
        headingLevel={3}
        layoutId="website-faq"
        items={faqIds.map((id) => ({
          id,
          title: copy.items[id].question,
          content: <p>{copy.items[id].answer}</p>
        }))}
      />
    </section>
  )
}
