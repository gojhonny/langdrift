'use client'

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

export interface DriftChartPoint {
  intentional?: number
  label: string
  unexplained?: number
  value: number
}

export interface CompactDriftChartProps {
  activeIndex?: number
  data: DriftChartPoint[]
  height?: number
}

export function CompactDriftChart({
  activeIndex = -1,
  data,
  height = 148
}: CompactDriftChartProps) {
  return (
    <div className="compact-chart" style={{ height }}>
      <ResponsiveContainer height="100%" width="100%">
        <LineChart data={data} margin={{ bottom: 0, left: -24, right: 8, top: 8 }}>
          <CartesianGrid stroke="var(--ld-chart-grid, #e8e8e8)" vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="label"
            fontSize={10}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            domain={[70, 100]}
            fontSize={10}
            tickCount={4}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--ld-chart-tooltip, #fff)',
              border: '1px solid var(--ld-chart-grid, #e8e8e8)',
              borderRadius: 8,
              boxShadow: '0 8px 28px rgba(0,0,0,.08)',
              fontSize: 11
            }}
            formatter={(value) => [`${String(value)}%`, 'Product Vision']}
          />
          <Line
            activeDot={{ r: 4 }}
            dataKey="value"
            dot={(props) => {
              const { cx = 0, cy = 0, index = 0 } = props
              const selected = index === activeIndex
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  fill={selected ? '#f97316' : 'var(--ld-chart-point, #111)'}
                  key={`dot-${String(index)}`}
                  r={selected ? 4.5 : 3}
                  stroke="var(--ld-chart-surface, #fff)"
                  strokeWidth={2}
                />
              )
            }}
            isAnimationActive
            stroke="var(--ld-chart-line, #111)"
            strokeWidth={2}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
