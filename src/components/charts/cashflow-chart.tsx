'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts'
import { formatCurrency } from '@/lib/format'
import type { YearProjection } from '@/types/calculations'

interface CashFlowChartProps {
  projections: YearProjection[]
}

export function CashFlowChart({ projections }: CashFlowChartProps) {
  const data = projections.map((p) => ({
    year: `Year ${p.year}`,
    annual: p.annualCashFlow,
    cumulative: p.cumulativeCashFlow,
  }))

  return (
    <div className="h-full w-full">
      <h3 className="text-sm font-medium text-neutral-400 mb-2">Cash Flow Projections</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
          <XAxis
            dataKey="year"
            stroke="#737373"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#404040' }}
          />
          <YAxis
            stroke="#737373"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#404040' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#171717',
              border: '1px solid #404040',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#fafafa' }}
            formatter={(value, name) => [
              formatCurrency((value as number) ?? 0),
              name === 'annual' ? 'Annual Cash Flow' : 'Cumulative Cash Flow',
            ]}
          />
          <Legend
            wrapperStyle={{ paddingTop: '10px' }}
            formatter={(value) =>
              value === 'annual' ? 'Annual Cash Flow' : 'Cumulative Cash Flow'
            }
          />
          <ReferenceLine y={0} stroke="#737373" strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="annual"
            stroke="#22C55E"
            strokeWidth={2}
            dot={{ fill: '#22C55E', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="cumulative"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: '#3B82F6', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
