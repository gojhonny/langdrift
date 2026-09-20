import { GitHubIcon } from 'nextra/icons'

import { siteConfig } from '../site.config'

export function GitHubStar() {
  return (
    <a
      aria-label="View LangDrift on GitHub (opens in a new tab)"
      className="ld-docs-github"
      href={siteConfig.github}
      rel="noopener noreferrer"
      target="_blank"
    >
      <GitHubIcon aria-hidden="true" height="16" />
      <span className="ld-docs-github__label">GitHub</span>
      <span aria-hidden="true" className="ld-docs-github__star">
        ☆
      </span>
    </a>
  )
}
