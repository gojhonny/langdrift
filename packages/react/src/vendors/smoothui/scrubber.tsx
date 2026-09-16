'use client'

export interface ScrubberProps {
  label: string
  max: number
  min?: number
  onChange: (value: number) => void
  value: number
}

export function Scrubber({
  label,
  max,
  min = 0,
  onChange,
  value
}: ScrubberProps) {
  const span = Math.max(1, max - min)
  const progress = ((value - min) / span) * 100

  return (
    <label className="smooth-scrubber">
      <span>{label}</span>
      <span className="smooth-scrubber-track">
        <span style={{ width: `${progress}%` }} />
        <input
          aria-label={label}
          max={max}
          min={min}
          onChange={(event) => onChange(Number(event.currentTarget.value))}
          type="range"
          value={value}
        />
      </span>
      <strong>{value + 1}</strong>
    </label>
  )
}
