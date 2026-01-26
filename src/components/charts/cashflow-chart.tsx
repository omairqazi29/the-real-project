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
import type { YearProjection } from '@/types/calculations'
import { formatCurrency } from '@/lib/format'
import { ChartContainer } from './chart-container'

interface CashFlowChartProps {
  projections: YearProjection[]
  showCumulative?: boolean
  className?: string
}

export function CashFlowChart({
  projections,
  showCumulative = true,
  className,
}: CashFlowChartProps) {
  const data = projections.map((p) => ({
    year: `Year ${p.year}`,
    'Annual Cash Flow': p.annualCashFlow,
    'Cumulative Cash Flow': p.cumulativeCashFlow,
    'Monthly Cash Flow': p.monthlyCashFlow,
  }))

  return (
    <ChartContainer
      title="Cash Flow Projection"
      description="Annual and cumulative cash flow over time"
      className={className}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
          <XAxis
            dataKey="year"
            stroke="#737373"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="#737373"
            fontSize={12}
            tickLine={false}
            tickFormatter={(value) => formatCurrency(value, { compact: true })}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#171717',
              border: '1px solid #404040',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#FAFAFA' }}
            formatter={(value) => formatCurrency(value as number)}
          />
          <Legend />
          <ReferenceLine y={0} stroke="#737373" strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="Annual Cash Flow"
            stroke="#22C55E"
            strokeWidth={2}
            dot={{ fill: '#22C55E', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
          {showCumulative && (
            <Line
              type="monotone"
              dataKey="Cumulative Cash Flow"
              stroke="#3B82F6"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#3B82F6', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
