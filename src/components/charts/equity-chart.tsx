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
import { formatCurrency } from '@/lib/format'
import type { YearProjection } from '@/types/calculations'

interface EquityChartProps {
  projections: YearProjection[]
}

export function EquityChart({ projections }: EquityChartProps) {
  const data = projections.map((p) => ({
    year: `Year ${p.year}`,
    forcedEquity: p.equityForced,
    appreciation: p.equityAppreciation,
    principal: p.equityPrincipal,
    total: p.equityTotal,
  }))

  return (
    <div className="h-full w-full">
      <h3 className="text-sm font-medium text-neutral-400 mb-2">Equity Buildup Over Time</h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
              name === 'forcedEquity'
                ? 'Forced Equity'
                : name === 'appreciation'
                  ? 'Appreciation'
                  : name === 'principal'
                    ? 'Principal Paydown'
                    : 'Total',
            ]}
          />
          <Legend
            wrapperStyle={{ paddingTop: '10px' }}
            formatter={(value) =>
              value === 'forcedEquity'
                ? 'Forced Equity'
                : value === 'appreciation'
                  ? 'Appreciation'
                  : value === 'principal'
                    ? 'Principal Paydown'
                    : value
            }
          />
          <Area
            type="monotone"
            dataKey="forcedEquity"
            stackId="1"
            stroke="#DC2626"
            fill="#DC2626"
            fillOpacity={0.8}
          />
          <Area
            type="monotone"
            dataKey="appreciation"
            stackId="1"
            stroke="#F97316"
            fill="#F97316"
            fillOpacity={0.8}
          />
          <Area
            type="monotone"
            dataKey="principal"
            stackId="1"
            stroke="#EAB308"
            fill="#EAB308"
            fillOpacity={0.8}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
