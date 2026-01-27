'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/lib/cn'
import { formatCurrency, formatPercent } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts'
import { calculatePropertyCashFlow, calculatePropertyBRRR, calculateReturns } from '@/lib/calculations'
import type { Property } from '@/types/property'

interface ComparisonChartProps {
  properties: Property[]
  metric?: string
  className?: string
}

type MetricKey = 'cashflow' | 'coc_return' | 'cap_rate' | 'total_roi'

const METRIC_OPTIONS: { key: MetricKey; label: string }[] = [
  { key: 'cashflow', label: 'Cash Flow' },
  { key: 'coc_return', label: 'CoC Return' },
  { key: 'cap_rate', label: 'Cap Rate' },
  { key: 'total_roi', label: 'Total ROI' },
]

const COLORS = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444']

export function ComparisonChart({ properties, metric: initialMetric, className }: ComparisonChartProps) {
  const [activeMetric, setActiveMetric] = useState<MetricKey>(
    (initialMetric as MetricKey) || 'cashflow'
  )

  const chartData = useMemo(() => {
    return properties.map((p) => {
      const cashFlow = calculatePropertyCashFlow(p)
      const brrr = calculatePropertyBRRR(p)
      const noi = cashFlow.netOperatingIncome * 12
      const returns = calculateReturns({
        annualNOI: noi,
        propertyValue: p.purchase_price,
        annualCashFlow: cashFlow.annualCashFlow,
        totalCashInvested: brrr.totalCashInvested,
        annualGrossRent: (p.monthly_rent ?? 0) * 12,
        annualDebtService: cashFlow.debtService * 12,
      })

      return {
        name: p.name.length > 20 ? p.name.slice(0, 18) + '...' : p.name,
        cashflow: cashFlow.monthlyCashFlow,
        coc_return: returns.cashOnCashReturn,
        cap_rate: returns.capRate,
        total_roi: returns.totalROI,
      }
    })
  }, [properties])

  const isPercent = activeMetric !== 'cashflow'

  const formatValue = (value: number) => {
    if (activeMetric === 'cashflow') return formatCurrency(value)
    return formatPercent(value)
  }

  const tickFormatter = (value: number) => {
    if (activeMetric === 'cashflow') {
      return `$${(value / 1).toFixed(0)}`
    }
    return `${(value).toFixed(1)}%`
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle>Property Comparison</CardTitle>
          <div className="flex gap-1 rounded-lg bg-neutral-800 p-1">
            {METRIC_OPTIONS.map((option) => (
              <button
                key={option.key}
                onClick={() => setActiveMetric(option.key)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                  activeMetric === option.key
                    ? 'bg-brand-600 text-white'
                    : 'text-neutral-400 hover:text-neutral-200'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
              <XAxis
                dataKey="name"
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
                tickFormatter={tickFormatter}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#171717',
                  border: '1px solid #404040',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fafafa' }}
                formatter={(value) => [formatValue(value as number), METRIC_OPTIONS.find((o) => o.key === activeMetric)?.label]}
              />
              <Bar dataKey={activeMetric} radius={[4, 4, 0, 0]} maxBarSize={60}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
