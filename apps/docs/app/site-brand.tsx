import { LogoMark } from '@repo/react/ui/brand'

export function SiteBrand({ label }: { label: string }) {
  return (
    <span className="ld-docs-brand">
      <LogoMark size={23} />
      <span className="ld-docs-brand__wordmark">LangDrift</span>
      <small className="ld-docs-brand__label">{label}</small>
    </span>
  )
}
