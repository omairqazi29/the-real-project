'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts'
import { formatCurrency } from '@/lib/format'
import type { BRRRResult } from '@/types/calculations'

interface WaterfallChartProps {
  brrr: BRRRResult
}

export function WaterfallChart({ brrr }: WaterfallChartProps) {
  // Calculate running total for waterfall effect
  const downPayment = brrr.downPayment || 0
  const closingCosts = brrr.closingCosts || 0
  const rehabBudget = brrr.rehabBudget || 0
  const holdingCosts = brrr.holdingCosts || 0
  const cashOut = brrr.netCashOut || 0
  const cashLeft = brrr.cashLeftInDeal || 0

  const startingCash = downPayment + closingCosts + rehabBudget + holdingCosts

  const data = [
    {
      name: 'Down Payment',
      value: -downPayment,
      fill: '#EF4444',
      running: startingCash - downPayment,
    },
    {
      name: 'Closing Costs',
      value: -closingCosts,
      fill: '#EF4444',
      running: startingCash - downPayment - closingCosts,
    },
    {
      name: 'Rehab',
      value: -rehabBudget,
      fill: '#EF4444',
      running: startingCash - downPayment - closingCosts - rehabBudget,
    },
    {
      name: 'Holding Costs',
      value: -holdingCosts,
      fill: '#EF4444',
      running: 0,
    },
    {
      name: 'Cash Out (Refi)',
      value: cashOut,
      fill: '#22C55E',
      running: cashOut,
    },
    {
      name: 'Cash Left',
      value: cashLeft,
      fill: cashLeft <= 0 ? '#22C55E' : '#EAB308',
      running: cashLeft,
    },
  ]

  return (
    <div className="h-full w-full">
      <h3 className="text-sm font-medium text-neutral-400 mb-2">BRRR Capital Flow</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
          <XAxis
            dataKey="name"
            stroke="#737373"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#404040' }}
            angle={-15}
            textAnchor="end"
            height={60}
          />
          <YAxis
            stroke="#737373"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#404040' }}
            tickFormatter={(value) => `$${(Math.abs(value) / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#171717',
              border: '1px solid #404040',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#fafafa' }}
            formatter={(value) => [formatCurrency(Math.abs((value as number) ?? 0)), 'Amount']}
          />
          <ReferenceLine y={0} stroke="#737373" />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
