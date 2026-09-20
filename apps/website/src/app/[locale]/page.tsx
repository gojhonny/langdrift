import { LogoMark } from '@repo/react/ui/brand'
import { AnimatedAvatarGroup, ChromaText } from '@repo/react/vendors/smoothui'
import { hasLocale } from 'next-intl'
import {
  getFormatter,
  getTranslations,
  setRequestLocale
} from 'next-intl/server'
import { notFound } from 'next/navigation'

import { HeroChart } from '../../components/hero-chart'
import { HeroSinapsiGraph } from '../../components/hero-sinapsi-graph'
import { SelectedMovement } from '../../components/selected-movement'
import { WebsiteHeader } from '../../components/website-header'
import { routing } from '../../i18n/routing'
import { getHeroPoints } from '../../lib/hero-demo-data'
import { StateLogger } from '../state-logger'
import { VoicePreview } from '../voice-preview'

export default async function WebsitePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations('home')
  const demo = await getTranslations('demo')
  const format = await getFormatter()
  const attribution = getHeroPoints(demo, locale)
    .flatMap((point) => (point.event ? [point.event] : []))
    .filter((event) => event.classification !== 'baseline')

  return (
    <>
      <StateLogger />
      <a className="skip-link" href="#why">
        {t('skip')}
      </a>
      <WebsiteHeader />
      <main id="top">
        <section aria-labelledby="hero-heading" className="website-hero">
          <div className="website-hero-intro">
            <h1 id="hero-heading">
              {t.rich('hero.title', {
                movement: (chunks) => <ChromaText>{chunks}</ChromaText>
              })}
            </h1>
            <p>{t('hero.description')}</p>
            <div className="website-hero-actions">
              <a className="smooth-primary-button" href="#why">
                {t('hero.seeMovement')}
                <svg
                  aria-hidden="true"
                  fill="none"
                  height="16"
                  viewBox="0 0 24 24"
                  width="16"
                >
                  <path
                    d="M4 12h16m-6-6 6 6-6 6"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </a>
              <a className="smooth-text-link" href="#attribution">
                {t('hero.howItWorks')}
              </a>
            </div>
          </div>
          <div
            className="website-hero-demo"
            aria-describedby="hero-demo-caption hero-demo-summary"
          >
            <div className="website-demo-grid">
              <HeroChart />
              <HeroSinapsiGraph />
            </div>
            <p className="website-demo-caption" id="hero-demo-caption">
              {t('hero.caption')}
            </p>
            <p className="website-sr-only" id="hero-demo-summary">
              {t('hero.summary')}
            </p>
          </div>
        </section>

        <section className="why-section" id="why">
          <div className="why-title">
            <span className="section-kicker">{t('why.kicker')}</span>
            <h2>{t('why.title')}</h2>
            <p>{t('why.description')}</p>
          </div>
          <SelectedMovement />
        </section>

        <section className="attribution-section" id="attribution">
          <div className="features-heading">
            <span className="section-kicker">{t('attribution.kicker')}</span>
            <h2>{t('attribution.title')}</h2>
            <p>{t('attribution.description')}</p>
          </div>
          <div className="attribution-grid">
            {attribution.map((event) => (
              <article key={event.id}>
                <div className="attribution-meta">
                  <span>{event.date}</span>
                  <span>{event.productArea}</span>
                </div>
                <h3>{event.title}</h3>
                <div className="attribution-bottom">
                  <AnimatedAvatarGroup
                    people={event.actors.map((actor) => ({
                      initials: actor.initials,
                      name: actor.name,
                      role: actor.team,
                      src: actor.src
                    }))}
                  />
                  <strong>
                    {format.number(event.delta, { signDisplay: 'exceptZero' })}
                  </strong>
                  <span>{demo(`classifications.${event.classification}`)}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="intent-section" id="intent">
          <div>
            <span className="section-kicker">{t('intent.kicker')}</span>
            <h2>{t('intent.title')}</h2>
          </div>
          <div className="intent-grid">
            <article>
              <span>{demo('classifications.intentional')}</span>
              <strong>{t('intent.points', { count: 14 })}</strong>
              <p>{t('intent.intentional')}</p>
            </article>
            <article>
              <span>{demo('classifications.unexplained')}</span>
              <strong>{t('intent.points', { count: 4 })}</strong>
              <p>{t('intent.unexplained')}</p>
            </article>
            <article>
              <span>{demo('classifications.review')}</span>
              <strong>{t('intent.events', { count: 1 })}</strong>
              <p>{t('intent.review')}</p>
            </article>
          </div>
        </section>

        <section className="voice-band" id="voice">
          <VoicePreview />
        </section>

        <section className="report-section" id="report">
          <div className="report-copy">
            <span className="section-kicker">{t('report.kicker')}</span>
            <h2>{t('report.title')}</h2>
          </div>
          <article className="report-preview">
            <div className="report-preview-head">
              <span>{t('report.weekly')}</span>
              <strong>
                {t('report.vision', {
                  from: format.number(81),
                  to: format.number(76)
                })}
              </strong>
            </div>
            <dl>
              <div>
                <dt>{t('report.largest')}</dt>
                <dd>{t('report.movement', { delta: format.number(-3) })}</dd>
              </div>
              <div>
                <dt>{t('report.why')}</dt>
                <dd>{t('report.rationale')}</dd>
              </div>
              <div>
                <dt>{t('report.who')}</dt>
                <dd>{t('report.actor')}</dd>
              </div>
              <div>
                <dt>{t('report.status')}</dt>
                <dd>{demo('classifications.unexplained')}</dd>
              </div>
              <div>
                <dt>{t('report.attention')}</dt>
                <dd>{t('report.action')}</dd>
              </div>
            </dl>
          </article>
        </section>

        <section className="packaging-section" id="pricing">
          <span className="section-kicker">{t('pricing.kicker')}</span>
          <h2>{t('pricing.title')}</h2>
          <p>{t('pricing.description')}</p>
          <a className="smooth-primary-button" href="#early-access">
            {t('pricing.cta')}
          </a>
          <div className="website-early-access" id="early-access">
            <h3>{t('earlyAccess.title')}</h3>
            <p>{t('earlyAccess.description')}</p>
          </div>
        </section>
      </main>
      <footer className="smooth-footer website-footer">
        <div className="smooth-footer-main">
          <span className="website-footer-brand">
            <LogoMark size={23} />
            LangDrift
          </span>
          <p>{t('footer.description')}</p>
          <a href="mailto:hello@langdrift.com">
            hello@langdrift.com <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="smooth-footer-bottom">
          <span>© 2026 LangDrift</span>
          <span>{t('footer.tagline')}</span>
        </div>
      </footer>
    </>
  )
}
