'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { YearProjection } from '@/types/calculations'
import { formatCurrency } from '@/lib/format'
import { ChartContainer } from './chart-container'

interface EquityChartProps {
  projections: YearProjection[]
  className?: string
}

export function EquityChart({ projections, className }: EquityChartProps) {
  const data = projections.map((p) => ({
    year: `Year ${p.year}`,
    'Forced Equity': p.equityForced,
    'Appreciation': p.equityAppreciation,
    'Principal Paydown': p.equityPrincipal,
    total: p.equityTotal,
  }))

  return (
    <ChartContainer
      title="Equity Buildup"
      description="10-year projection of equity growth by source"
      className={className}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
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
          <Area
            type="monotone"
            dataKey="Forced Equity"
            stackId="1"
            stroke="#DC2626"
            fill="#DC2626"
            fillOpacity={0.8}
          />
          <Area
            type="monotone"
            dataKey="Appreciation"
            stackId="1"
            stroke="#F97316"
            fill="#F97316"
            fillOpacity={0.8}
          />
          <Area
            type="monotone"
            dataKey="Principal Paydown"
            stackId="1"
            stroke="#EAB308"
            fill="#EAB308"
            fillOpacity={0.8}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
