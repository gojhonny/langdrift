import { AgentOrb } from '@repo/react/ui/agent-orb'
import { LogoMark } from '@repo/react/ui/brand'
import { GithubLogo, LinkedinLogo } from '@repo/react/ui/icons/server'
import { docsUrlForLocale } from '../app/app-links'
import { Link } from '../i18n/navigation'
import type { WebsiteLocale } from '../i18n/routing'
import { homeMessages } from '../messages/home'
import { headerMessages } from '../messages/header'

import './website-footer.css'

const labels = {
  en: {
    navigation: 'Footer navigation',
    faq: 'Questions & answers',
    social: 'Follow LangDrift'
  },
  'pt-BR': {
    navigation: 'Navegação do rodapé',
    faq: 'Perguntas frequentes',
    social: 'Acompanhe o LangDrift'
  },
  'zh-Hant': {
    navigation: '頁尾導覽',
    faq: '常見問題',
    social: '追蹤 LangDrift'
  },
  ja: {
    navigation: 'フッターナビゲーション',
    faq: 'よくある質問',
    social: 'LangDriftをフォロー'
  }
}

export function WebsiteFooter({
  locale,
  compact = false
}: {
  locale: WebsiteLocale
  compact?: boolean
}) {
  const copy = labels[locale]
  return (
    <footer
      className="smooth-footer website-footer"
      data-compact={compact || undefined}
    >
      <div className="website-footer-top">
        {!compact ? (
          <div className="website-footer-intro">
            <Link className="website-footer-brand" href="/" locale={locale}>
              <LogoMark size={23} />
              LangDrift
            </Link>
            <p>{homeMessages[locale].footer.description}</p>
          </div>
        ) : null}
        <nav aria-label={copy.navigation} className="website-footer-links">
          {/* External, environment-configured origin: plain anchor, not the
              locale-aware Link. */}
          <a href={docsUrlForLocale(locale)}>{headerMessages[locale].docs}</a>
          <Link href="/pricing" locale={locale}>
            {headerMessages[locale].plans}
          </Link>
          <Link href="/#faq" locale={locale}>
            {copy.faq}
          </Link>
          <a href="mailto:dev.neongate@gmail.com">dev.neongate@gmail.com</a>
        </nav>
      </div>
      <div className="website-footer-bottom">
        <div className="website-footer-credit">
          <span className="website-footer-orb">
            <AgentOrb preset="neongate" size="28px" speed={0.35} />
          </span>
          <span>Neongate AI</span>
          <span>© 2026 LangDrift made in Brazil</span>
        </div>
        <nav aria-label={copy.social} className="website-footer-social">
          <a
            href="https://www.linkedin.com/company/langdrift/"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <LinkedinLogo aria-hidden="true" size={22} weight="fill" />
          </a>
          <a
            href="https://github.com/gojhonny/langdrift"
            aria-label="GitHub"
            title="GitHub"
          >
            <GithubLogo aria-hidden="true" size={22} weight="fill" />
          </a>
        </nav>
      </div>
    </footer>
  )
}
