'use client'

interface FactProps {
  label: string
  value: string
}

export function Fact(props: FactProps) {
  const { label, value } = props

  return (
    <div className="grid min-h-[66px] gap-1 border-t border-hairline py-2.5 pr-3">
      <dt className="font-mono text-[7px] text-muted uppercase">{label}</dt>
      <dd className="m-0 text-[9px]">{value}</dd>
    </div>
  )
}
