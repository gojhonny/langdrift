import { ArrowUpRight } from '@phosphor-icons/react'

import { Brand } from '../../ui/brand'

export function SmoothFooter() {
  return (
    <footer className="smooth-footer">
      <div className="smooth-footer-main">
        <Brand compact />
        <p>From vision to reality, and everything in between.</p>
        <a href="mailto:hello@langdrift.com">
          hello@langdrift.com <ArrowUpRight aria-hidden="true" size={14} />
        </a>
      </div>
      <div className="smooth-footer-bottom">
        <span>© 2026 LangDrift</span>
        <span>Visual-first for truth. Voice-first for inquiry.</span>
      </div>
    </footer>
  )
}
