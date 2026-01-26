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
import type { BRRRResult } from '@/types/calculations'
import { formatCurrency } from '@/lib/format'
import { ChartContainer } from './chart-container'

interface WaterfallChartProps {
  brrr: BRRRResult
  className?: string
}

export function WaterfallChart({ brrr, className }: WaterfallChartProps) {
  // Calculate running total for waterfall effect
  const data = [
    {
      name: 'Starting Cash',
      value: brrr.totalCashInvested,
      isTotal: true,
      color: '#DC2626',
    },
    {
      name: 'Down Payment',
      value: -brrr.downPayment,
      isTotal: false,
      color: '#EF4444',
    },
    {
      name: 'Closing Costs',
      value: -brrr.closingCosts,
      isTotal: false,
      color: '#EF4444',
    },
    {
      name: 'Rehab',
      value: -brrr.rehabBudget,
      isTotal: false,
      color: '#EF4444',
    },
    {
      name: 'Holding Costs',
      value: -brrr.holdingCosts,
      isTotal: false,
      color: '#EF4444',
    },
    {
      name: 'Refi Proceeds',
      value: brrr.netCashOut,
      isTotal: false,
      color: '#22C55E',
    },
    {
      name: 'Cash Left',
      value: brrr.cashLeftInDeal,
      isTotal: true,
      color: brrr.infiniteReturn ? '#22C55E' : '#EAB308',
    },
  ]

  // Calculate start/end positions for waterfall bars
  let runningTotal = 0
  const chartData = data.map((item, index) => {
    if (item.isTotal && index === 0) {
      return {
        ...item,
        start: 0,
        end: item.value,
        displayValue: item.value,
      }
    }
    if (item.isTotal) {
      return {
        ...item,
        start: 0,
        end: runningTotal,
        displayValue: runningTotal,
      }
    }

    const start = runningTotal
    runningTotal += item.value
    return {
      ...item,
      start: item.value >= 0 ? start : runningTotal,
      end: item.value >= 0 ? runningTotal : start,
      displayValue: Math.abs(item.value),
    }
  })

  return (
    <ChartContainer
      title="BRRR Capital Flow"
      description="How your cash flows through the deal"
      className={className}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
          <XAxis
            dataKey="name"
            stroke="#737373"
            fontSize={11}
            tickLine={false}
            angle={-45}
            textAnchor="end"
            height={80}
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
            formatter={(_value, _name, props) => [
              formatCurrency((props as { payload: { value: number } }).payload.value),
              '',
            ]}
          />
          <ReferenceLine y={0} stroke="#737373" />
          <Bar dataKey="end" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
