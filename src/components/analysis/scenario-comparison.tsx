'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/cn'
import { formatCurrency, formatPercent } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { ScenarioResult } from '@/types/calculations'

interface ScenarioComparisonProps {
  scenarios: ScenarioResult[]
  className?: string
}

const SCENARIO_COLORS = {
  Conservative: '#EF4444', // red
  Base: '#22C55E',         // green
  Optimistic: '#3B82F6',   // blue
}

export function ScenarioComparison({ scenarios, className }: ScenarioComparisonProps) {
  // Prepare chart data
  const chartData = useMemo(() => {
    if (!scenarios.length || !scenarios[0]?.projections?.length) return []

    const years = scenarios[0].projections.length
    const data = []

    for (let i = 0; i < years; i++) {
      const yearData: Record<string, number | string> = {
        year: `Year ${i + 1}`,
      }

      scenarios.forEach((scenario) => {
        const proj = scenario.projections[i]
        if (proj) {
          yearData[`${scenario.name}_equity`] = proj.equityTotal
          yearData[`${scenario.name}_cashflow`] = proj.cumulativeCashFlow
        }
      })

      data.push(yearData)
    }

    return data
  }, [scenarios])

  if (!scenarios.length) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-center text-muted-foreground">
          No scenarios to compare
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Summary Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((scenario) => {
          const color = SCENARIO_COLORS[scenario.name as keyof typeof SCENARIO_COLORS] || '#737373'

          return (
            <Card key={scenario.name} className="relative overflow-hidden">
              <div
                className="absolute top-0 left-0 w-1 h-full"
                style={{ backgroundColor: color }}
              />
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  {scenario.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">10-Year Cash Flow</span>
                  <span className={cn(
                    'font-mono font-medium',
                    scenario.summary.totalCashFlow10yr >= 0 ? 'text-green-500' : 'text-red-500'
                  )}>
                    {formatCurrency(scenario.summary.totalCashFlow10yr)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">10-Year Equity</span>
                  <span className="font-mono font-medium text-brand-400">
                    {formatCurrency(scenario.summary.totalEquity10yr)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total ROI</span>
                  <span className={cn(
                    'font-mono font-medium',
                    scenario.summary.totalROI10yr >= 0 ? 'text-green-500' : 'text-red-500'
                  )}>
                    {formatPercent(scenario.summary.totalROI10yr)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Avg CoC Return</span>
                  <span className={cn(
                    'font-mono font-medium',
                    scenario.summary.averageCoCReturn >= 0 ? 'text-green-500' : 'text-red-500'
                  )}>
                    {formatPercent(scenario.summary.averageCoCReturn)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-neutral-700 pt-2">
                  <span className="text-sm text-muted-foreground">IRR</span>
                  <span className={cn(
                    'font-mono font-semibold',
                    scenario.summary.irr >= 0 ? 'text-green-500' : 'text-red-500'
                  )}>
                    {formatPercent(scenario.summary.irr)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Equity Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Equity Growth Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                  formatter={(value, name) => {
                    const label = String(name).replace('_equity', '')
                    return [formatCurrency(value as number), label]
                  }}
                />
                <Legend
                  formatter={(value) => String(value).replace('_equity', '')}
                />
                {scenarios.map((scenario) => (
                  <Line
                    key={scenario.name}
                    type="monotone"
                    dataKey={`${scenario.name}_equity`}
                    stroke={SCENARIO_COLORS[scenario.name as keyof typeof SCENARIO_COLORS] || '#737373'}
                    strokeWidth={2}
                    dot={{ fill: SCENARIO_COLORS[scenario.name as keyof typeof SCENARIO_COLORS] || '#737373' }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Cash Flow Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cumulative Cash Flow Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                  formatter={(value, name) => {
                    const label = String(name).replace('_cashflow', '')
                    return [formatCurrency(value as number), label]
                  }}
                />
                <Legend
                  formatter={(value) => String(value).replace('_cashflow', '')}
                />
                {scenarios.map((scenario) => (
                  <Line
                    key={scenario.name}
                    type="monotone"
                    dataKey={`${scenario.name}_cashflow`}
                    stroke={SCENARIO_COLORS[scenario.name as keyof typeof SCENARIO_COLORS] || '#737373'}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: SCENARIO_COLORS[scenario.name as keyof typeof SCENARIO_COLORS] || '#737373' }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Year-by-Year Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-3 px-3">Year</th>
                  {scenarios.map((scenario) => (
                    <th
                      key={scenario.name}
                      colSpan={3}
                      className="text-center py-3 px-3"
                      style={{
                        color: SCENARIO_COLORS[scenario.name as keyof typeof SCENARIO_COLORS] || '#737373'
                      }}
                    >
                      {scenario.name}
                    </th>
                  ))}
                </tr>
                <tr className="border-b border-neutral-700 text-xs text-muted-foreground">
                  <th className="py-2 px-3"></th>
                  {scenarios.map((scenario) => (
                    <>
                      <th key={`${scenario.name}-equity`} className="text-right py-2 px-2">Equity</th>
                      <th key={`${scenario.name}-cf`} className="text-right py-2 px-2">Cash Flow</th>
                      <th key={`${scenario.name}-roi`} className="text-right py-2 px-2">ROI</th>
                    </>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scenarios[0]?.projections?.map((_, yearIndex) => (
                  <tr key={yearIndex} className="border-b border-neutral-800 hover:bg-neutral-800/30">
                    <td className="py-2 px-3 font-medium">Year {yearIndex + 1}</td>
                    {scenarios.map((scenario) => {
                      const proj = scenario.projections[yearIndex]
                      return (
                        <>
                          <td key={`${scenario.name}-${yearIndex}-equity`} className="text-right py-2 px-2 font-mono text-xs">
                            {formatCurrency(proj?.equityTotal ?? 0, { compact: true })}
                          </td>
                          <td
                            key={`${scenario.name}-${yearIndex}-cf`}
                            className={cn(
                              'text-right py-2 px-2 font-mono text-xs',
                              (proj?.annualCashFlow ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'
                            )}
                          >
                            {formatCurrency(proj?.annualCashFlow ?? 0, { compact: true })}
                          </td>
                          <td
                            key={`${scenario.name}-${yearIndex}-roi`}
                            className={cn(
                              'text-right py-2 px-2 font-mono text-xs',
                              (proj?.totalROI ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'
                            )}
                          >
                            {formatPercent(proj?.totalROI ?? 0, { decimals: 0 })}
                          </td>
                        </>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
