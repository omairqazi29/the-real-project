'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/cn'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { MarketGradeBadge } from './market-grade-badge'
import { formatCurrency, formatPercent, formatNumber } from '@/lib/format'
import type { Market } from '@/types/market'

interface MarketComparisonProps {
  markets: Market[]
}

type MetricDef = {
  label: string
  key: string
  format: (v: number) => string
  higherIsBetter: boolean
}

const metrics: MetricDef[] = [
  { label: 'Median Price', key: 'median_home_price', format: formatCurrency, higherIsBetter: false },
  { label: 'Median Rent', key: 'median_rent', format: formatCurrency, higherIsBetter: true },
  { label: 'Rent/Price Ratio', key: 'rent_price_ratio', format: formatPercent, higherIsBetter: true },
  { label: 'Appreciation 1yr', key: 'appreciation_1yr', format: formatPercent, higherIsBetter: true },
  { label: 'Appreciation 3yr CAGR', key: 'appreciation_3yr_cagr', format: formatPercent, higherIsBetter: true },
  { label: 'Population Growth', key: 'population_growth_1yr', format: formatPercent, higherIsBetter: true },
  { label: 'Median Income', key: 'median_household_income', format: formatCurrency, higherIsBetter: true },
  { label: 'Unemployment', key: 'unemployment_rate', format: formatPercent, higherIsBetter: false },
  { label: 'Job Growth', key: 'job_growth_1yr', format: formatPercent, higherIsBetter: true },
  { label: 'Days on Market', key: 'days_on_market_avg', format: formatNumber, higherIsBetter: false },
  { label: 'Cashflow Score', key: 'cashflow_score', format: (v) => String(Math.round(v)), higherIsBetter: true },
  { label: 'Appreciation Score', key: 'appreciation_score', format: (v) => String(Math.round(v)), higherIsBetter: true },
  { label: 'Stability Score', key: 'stability_score', format: (v) => String(Math.round(v)), higherIsBetter: true },
]

function getMetricValue(market: Market, key: string): number | null {
  const val = (market as unknown as Record<string, unknown>)[key]
  return typeof val === 'number' ? val : null
}

export function MarketComparison({ markets }: MarketComparisonProps) {
  const highlights = useMemo(() => {
    const result: Record<string, { best: number | null; worst: number | null }> = {}

    for (const metric of metrics) {
      const values = markets
        .map((m) => getMetricValue(m, metric.key))
        .filter((v): v is number => v !== null)

      if (values.length === 0) {
        result[metric.key] = { best: null, worst: null }
        continue
      }

      const best = metric.higherIsBetter ? Math.max(...values) : Math.min(...values)
      const worst = metric.higherIsBetter ? Math.min(...values) : Math.max(...values)
      result[metric.key] = { best, worst }
    }

    return result
  }, [markets])

  if (markets.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-neutral-400">
          Select markets to compare
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="py-3 pr-4 text-left font-medium text-neutral-400">
                  Metric
                </th>
                {markets.map((m) => (
                  <th
                    key={m.id}
                    className="px-4 py-3 text-left font-medium text-neutral-100"
                  >
                    <div className="flex items-center gap-2">
                      <span>
                        {m.city}, {m.state}
                      </span>
                      {m.overall_grade && (
                        <MarketGradeBadge grade={m.overall_grade} size="sm" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric) => (
                <tr
                  key={metric.key}
                  className="border-b border-neutral-800/50"
                >
                  <td className="py-2.5 pr-4 text-neutral-400">
                    {metric.label}
                  </td>
                  {markets.map((m) => {
                    const val = getMetricValue(m, metric.key)
                    const highlight = highlights[metric.key]
                    const isBest = val !== null && highlight?.best === val
                    const isWorst =
                      val !== null &&
                      highlight?.worst === val &&
                      markets.length > 1

                    return (
                      <td
                        key={m.id}
                        className={cn(
                          'px-4 py-2.5',
                          isBest && 'text-green-400 font-medium',
                          isWorst && !isBest && 'text-red-400'
                        )}
                      >
                        {val !== null ? metric.format(val) : '--'}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
