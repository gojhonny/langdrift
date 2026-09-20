import { LogoMark } from '@repo/react/ui/brand'

export function SiteBrand() {
  return (
    <span className="ld-docs-brand">
      <LogoMark size={23} />
      <span className="ld-docs-brand__wordmark">LangDrift</span>
      <small className="ld-docs-brand__label">Docs</small>
    </span>
  )
}
