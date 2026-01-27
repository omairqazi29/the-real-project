'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/cn'
import { formatCurrency, formatPercent, formatNumber } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { calculatePropertyCashFlow } from '@/lib/calculations'
import { calculatePropertyBRRR } from '@/lib/calculations'
import { calculateReturns } from '@/lib/calculations'
import type { Property } from '@/types/property'

interface ComparisonTableProps {
  properties: Property[]
  className?: string
}

interface MetricRow {
  label: string
  values: (string | number)[]
  rawValues: number[]
  format: 'currency' | 'percent' | 'number' | 'text'
  higherIsBetter: boolean
}

function getHighlightClass(
  value: number,
  allValues: number[],
  higherIsBetter: boolean
): string {
  if (allValues.length < 2) return ''
  const validValues = allValues.filter((v) => v !== 0 && !isNaN(v))
  if (validValues.length < 2) return ''

  const best = higherIsBetter ? Math.max(...validValues) : Math.min(...validValues)
  const worst = higherIsBetter ? Math.min(...validValues) : Math.max(...validValues)

  if (value === best) return 'text-green-500 font-semibold'
  if (value === worst) return 'text-red-500'
  return ''
}

function formatMetricValue(value: string | number, format: string): string {
  if (typeof value === 'string') return value
  switch (format) {
    case 'currency':
      return formatCurrency(value)
    case 'percent':
      return formatPercent(value)
    case 'number':
      return formatNumber(value)
    default:
      return String(value)
  }
}

export function ComparisonTable({ properties, className }: ComparisonTableProps) {
  const analysis = useMemo(() => {
    return properties.map((p) => {
      const cashFlow = calculatePropertyCashFlow(p)
      const brrr = calculatePropertyBRRR(p)
      const totalInvestment = brrr.totalCashInvested
      const noi = cashFlow.netOperatingIncome * 12
      const returns = calculateReturns({
        annualNOI: noi,
        propertyValue: p.purchase_price,
        annualCashFlow: cashFlow.annualCashFlow,
        totalCashInvested: totalInvestment,
        annualGrossRent: (p.monthly_rent ?? 0) * 12,
        annualDebtService: cashFlow.debtService * 12,
      })

      return { property: p, cashFlow, brrr, returns, totalInvestment }
    })
  }, [properties])

  const sections: { title: string; metrics: MetricRow[] }[] = useMemo(() => {
    const vals = (fn: (a: (typeof analysis)[number]) => number) =>
      analysis.map((a) => fn(a))

    return [
      {
        title: 'Purchase',
        metrics: [
          {
            label: 'Purchase Price',
            values: analysis.map((a) => formatCurrency(a.property.purchase_price)),
            rawValues: vals((a) => a.property.purchase_price),
            format: 'currency',
            higherIsBetter: false,
          },
          {
            label: 'Down Payment',
            values: analysis.map((a) => formatPercent(a.property.down_payment_percent)),
            rawValues: vals((a) => a.property.down_payment_percent),
            format: 'percent',
            higherIsBetter: false,
          },
          {
            label: 'Total Investment',
            values: analysis.map((a) => formatCurrency(a.totalInvestment)),
            rawValues: vals((a) => a.totalInvestment),
            format: 'currency',
            higherIsBetter: false,
          },
        ],
      },
      {
        title: 'Financing',
        metrics: [
          {
            label: 'Interest Rate',
            values: analysis.map((a) => formatPercent(a.property.interest_rate)),
            rawValues: vals((a) => a.property.interest_rate),
            format: 'percent',
            higherIsBetter: false,
          },
          {
            label: 'Loan Term',
            values: analysis.map((a) => `${a.property.loan_term_years} yrs`),
            rawValues: vals((a) => a.property.loan_term_years),
            format: 'text',
            higherIsBetter: true,
          },
          {
            label: 'Monthly P&I',
            values: analysis.map((a) => formatCurrency(a.cashFlow.debtService)),
            rawValues: vals((a) => a.cashFlow.debtService),
            format: 'currency',
            higherIsBetter: false,
          },
        ],
      },
      {
        title: 'Cash Flow',
        metrics: [
          {
            label: 'Monthly Rent',
            values: analysis.map((a) => formatCurrency(a.property.monthly_rent ?? 0)),
            rawValues: vals((a) => a.property.monthly_rent ?? 0),
            format: 'currency',
            higherIsBetter: true,
          },
          {
            label: 'Monthly Expenses',
            values: analysis.map((a) => formatCurrency(a.cashFlow.operatingExpenses.total + a.cashFlow.debtService)),
            rawValues: vals((a) => a.cashFlow.operatingExpenses.total + a.cashFlow.debtService),
            format: 'currency',
            higherIsBetter: false,
          },
          {
            label: 'Monthly Cash Flow',
            values: analysis.map((a) => formatCurrency(a.cashFlow.monthlyCashFlow)),
            rawValues: vals((a) => a.cashFlow.monthlyCashFlow),
            format: 'currency',
            higherIsBetter: true,
          },
          {
            label: 'Annual Cash Flow',
            values: analysis.map((a) => formatCurrency(a.cashFlow.annualCashFlow)),
            rawValues: vals((a) => a.cashFlow.annualCashFlow),
            format: 'currency',
            higherIsBetter: true,
          },
        ],
      },
      {
        title: 'Returns',
        metrics: [
          {
            label: 'Cap Rate',
            values: analysis.map((a) => formatPercent(a.returns.capRate)),
            rawValues: vals((a) => a.returns.capRate),
            format: 'percent',
            higherIsBetter: true,
          },
          {
            label: 'Cash-on-Cash Return',
            values: analysis.map((a) => formatPercent(a.returns.cashOnCashReturn)),
            rawValues: vals((a) => a.returns.cashOnCashReturn),
            format: 'percent',
            higherIsBetter: true,
          },
          {
            label: 'GRM',
            values: analysis.map((a) => formatNumber(a.returns.grossRentMultiplier, { decimals: 1 })),
            rawValues: vals((a) => a.returns.grossRentMultiplier),
            format: 'number',
            higherIsBetter: false,
          },
          {
            label: 'DSCR',
            values: analysis.map((a) => formatNumber(a.returns.debtServiceCoverageRatio, { decimals: 2 })),
            rawValues: vals((a) => a.returns.debtServiceCoverageRatio),
            format: 'number',
            higherIsBetter: true,
          },
        ],
      },
      {
        title: 'BRRR',
        metrics: [
          {
            label: 'ARV',
            values: analysis.map((a) => formatCurrency(a.brrr.arv)),
            rawValues: vals((a) => a.brrr.arv),
            format: 'currency',
            higherIsBetter: true,
          },
          {
            label: 'Cash Left in Deal',
            values: analysis.map((a) => formatCurrency(a.brrr.cashLeftInDeal)),
            rawValues: vals((a) => a.brrr.cashLeftInDeal),
            format: 'currency',
            higherIsBetter: false,
          },
          {
            label: 'Post-Refi Cash Flow',
            values: analysis.map((a) => formatCurrency(a.brrr.postRefiCashFlow)),
            rawValues: vals((a) => a.brrr.postRefiCashFlow),
            format: 'currency',
            higherIsBetter: true,
          },
          {
            label: 'Infinite Return',
            values: analysis.map((a) => a.brrr.infiniteReturn ? 'Yes' : 'No'),
            rawValues: vals((a) => a.brrr.infiniteReturn ? 1 : 0),
            format: 'text',
            higherIsBetter: true,
          },
        ],
      },
    ]
  }, [analysis])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Side-by-Side Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-700">
                <th className="text-left py-3 px-3 text-neutral-400 font-medium w-48">Metric</th>
                {properties.map((p) => (
                  <th key={p.id} className="text-right py-3 px-3 font-medium text-neutral-100">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => (
                <>
                  <tr key={section.title}>
                    <td
                      colSpan={properties.length + 1}
                      className="py-2 px-3 text-xs font-semibold uppercase tracking-wider text-brand-400 bg-neutral-800/50 border-b border-neutral-700"
                    >
                      {section.title}
                    </td>
                  </tr>
                  {section.metrics.map((metric) => (
                    <tr key={metric.label} className="border-b border-neutral-800 hover:bg-neutral-800/30">
                      <td className="py-2 px-3 text-neutral-400">{metric.label}</td>
                      {metric.values.map((value, i) => (
                        <td
                          key={i}
                          className={cn(
                            'text-right py-2 px-3 font-mono text-sm',
                            getHighlightClass(metric.rawValues[i], metric.rawValues, metric.higherIsBetter)
                          )}
                        >
                          {typeof value === 'string' ? value : formatMetricValue(value, metric.format)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
