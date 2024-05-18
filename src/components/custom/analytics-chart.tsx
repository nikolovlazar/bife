'use client'

import { Area, AreaChart } from 'recharts'

import { analyticsChartData } from '@/lib/fake-data'

export default function AnalyticsChart() {
  return (
    <AreaChart
      className="max-w-full flex-1 gradient-mask-b-60"
      width={1200}
      height={150}
      data={analyticsChartData}
      margin={{ bottom: -50, top: 0, left: 0, right: 0 }}
    >
      <Area
        type="monotone"
        dataKey="y"
        dot={false}
        stroke="hsl(var(--primary))"
        fill="hsl(var(--primary))"
      />
    </AreaChart>
  )
}
