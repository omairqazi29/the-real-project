'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/cn'
import { formatCurrency } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts'
import type { SensitivityPoint } from '@/types/calculations'

interface SensitivityChartProps {
  data: SensitivityPoint[]
  className?: string
}

export function SensitivityChart({ data, className }: SensitivityChartProps) {
  const chartData = useMemo(() => {
    return data
      .map((point) => ({
        variable: point.variable,
        impact: point.cashFlow,
        change: point.change,
        positive: point.cashFlow >= 0,
      }))
      .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
  }, [data])

  if (!data.length) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-center text-muted-foreground">
          No sensitivity data available
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Sensitivity Analysis - Cash Flow Impact</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#404040" horizontal={false} />
              <XAxis
                type="number"
                stroke="#737373"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#404040' }}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />
              <YAxis
                type="category"
                dataKey="variable"
                stroke="#737373"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#404040' }}
                width={90}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#171717',
                  border: '1px solid #404040',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fafafa' }}
                formatter={(value) => [
                  formatCurrency(value as number),
                  'Cash Flow Impact',
                ]}
              />
              <ReferenceLine x={0} stroke="#737373" />
              <Bar dataKey="impact" radius={[0, 4, 4, 0]} maxBarSize={30}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.positive ? '#22C55E' : '#EF4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
