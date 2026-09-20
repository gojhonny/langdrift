import { LogoMark } from '@repo/react/ui/brand'
import { BasicAccordion } from '@repo/react/vendors/smoothui'
import Image from 'next/image'

import type { WebsiteLocale } from '../i18n/routing'
import {
  type IntegrationId,
  integrationsMessages
} from '../messages/integrations'

import './integrations-section.css'

const tools: readonly IntegrationId[] = ['github', 'obsidian', 'linear']

const integrationLogos: Record<
  IntegrationId,
  { light: string; dark?: string; width: number }
> = {
  github: { light: 'github-black.svg', dark: 'github-white.svg', width: 39 },
  obsidian: { light: 'obsidian.svg', width: 38 },
  linear: { light: 'linear-dark.svg', dark: 'linear-light.svg', width: 38 }
}

function IntegrationLogo({ id }: { id: IntegrationId }) {
  const { light, dark, width } = integrationLogos[id]

  if (!dark) {
    return (
      <Image alt="" height={38} src={`/integrations/${light}`} width={width} />
    )
  }

  return (
    <>
      <Image
        alt=""
        className="integration-logo-light"
        height={38}
        src={`/integrations/${light}`}
        width={width}
      />
      <Image
        alt=""
        className="integration-logo-dark"
        height={38}
        src={`/integrations/${dark}`}
        width={width}
      />
    </>
  )
}

function IntegrationBranches() {
  return (
    <div aria-hidden="true" className="integration-branches">
      <svg
        aria-hidden="true"
        className="integration-branch-spine"
        focusable="false"
        preserveAspectRatio="none"
        viewBox="0 0 2 100"
      >
        <path d="M1 0v100" />
      </svg>
      {tools.map((id, index) => (
        <svg
          aria-hidden="true"
          focusable="false"
          key={id}
          preserveAspectRatio="none"
          viewBox="0 0 100 12"
        >
          {/* the middle branch runs straight out of the spine */}
          <path d={index === 1 ? 'M0 6h100' : 'M50 6h50'} />
        </svg>
      ))}
    </div>
  )
}

export function IntegrationsSection({ locale }: { locale: WebsiteLocale }) {
  const copy = integrationsMessages[locale]

  return (
    <section
      aria-labelledby="integrations-heading"
      className="integrations-section"
      id="integrations"
    >
      <div className="integrations-intro">
        <span className="section-kicker">{copy.eyebrow}</span>
        <h2 id="integrations-heading">{copy.title}</h2>
        <p>{copy.description}</p>
      </div>

      <div className="integrations-map">
        <article className="integration-project integration-surface">
          <svg
            aria-hidden="true"
            className="integration-project-icon"
            fill="none"
            focusable="false"
            height="32"
            viewBox="0 0 32 32"
            width="32"
          >
            <path d="M4 9h9l3-4h12v22H4V9Z" />
            <path d="m13 14-4 4 4 4m6-8 4 4-4 4" />
          </svg>
          <h3>{copy.project.title}</h3>
          <span className="integration-sdk-label">{copy.project.label}</span>
          <p>{copy.project.description}</p>
        </article>

        <div className="integration-main-connection">
          <span>{copy.project.connectionLabel}</span>
          <svg
            aria-hidden="true"
            focusable="false"
            preserveAspectRatio="none"
            viewBox="0 0 100 12"
          >
            <path d="M0 6h100" />
          </svg>
        </div>

        <article className="integration-core integration-surface">
          <div className="integration-core-heading">
            <LogoMark size={31} />
            <h3>{copy.core.title}</h3>
          </div>
          <span className="integration-requirement">{copy.core.badge}</span>
          <p>{copy.core.description}</p>
          <p className="integration-core-supporting">{copy.core.supporting}</p>
        </article>

        <IntegrationBranches />

        <ul className="integration-tools">
          {tools.map((id) => {
            const tool = copy.tools[id]
            return (
              <li key={id}>
                <article className="integration-tool integration-surface">
                  <div className="integration-tool-heading">
                    <span aria-hidden="true" className="integration-logo">
                      <IntegrationLogo id={id} />
                    </span>
                    <h3>{tool.title}</h3>
                  </div>
                  <span className="integration-requirement">{tool.badge}</span>
                  <p>{tool.description}</p>
                  <div className="integration-example">
                    <span>{tool.exampleLabel}</span>
                    <p>{tool.example}</p>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>

      <BasicAccordion
        className="integrations-technical"
        headingLevel={3}
        items={[
          {
            id: 'integrations-sdk-mcp',
            title: copy.technical.title,
            content: (
              <>
                <p>{copy.technical.platform}</p>
                <p>{copy.technical.connectors}</p>
              </>
            )
          }
        ]}
      />
      <div className="integrations-outro">
        <p>{copy.closing.description}</p>
        <a className="smooth-text-link" href="#early-access">
          {copy.closing.cta}
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  )
}
