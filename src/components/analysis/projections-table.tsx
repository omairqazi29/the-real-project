'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import { formatCurrency, formatPercent } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown } from 'lucide-react'
import type { YearProjection } from '@/types/calculations'

interface ProjectionsTableProps {
  projections: YearProjection[]
  className?: string
  showExpanded?: boolean
}

type SortField = 'year' | 'propertyValue' | 'equityTotal' | 'annualCashFlow' | 'cocReturn' | 'totalROI'
type SortDirection = 'asc' | 'desc'

export function ProjectionsTable({ projections, className, showExpanded = false }: ProjectionsTableProps) {
  const [sortField, setSortField] = useState<SortField>('year')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [expanded, setExpanded] = useState(showExpanded)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedProjections = [...projections].sort((a, b) => {
    const aVal = a[sortField]
    const bVal = b[sortField]
    const modifier = sortDirection === 'asc' ? 1 : -1
    return (aVal - bVal) * modifier
  })

  const lastYear = projections[projections.length - 1]

  // Calculate summary stats
  const totalCashFlow = lastYear?.cumulativeCashFlow ?? 0
  const totalEquity = lastYear?.equityTotal ?? 0
  const avgCoCReturn = projections.reduce((sum, p) => sum + p.cocReturn, 0) / projections.length
  const finalROI = lastYear?.totalROI ?? 0

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-3 w-3 inline ml-1" />
    ) : (
      <ChevronDown className="h-3 w-3 inline ml-1" />
    )
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          10-Year Projections
          <span className="text-xs font-normal text-muted-foreground">
            Click headers to sort
          </span>
        </CardTitle>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          {expanded ? 'Collapse' : 'Expand'}
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-neutral-800/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Total Cash Flow</p>
            <p className={cn(
              'text-lg font-mono font-semibold',
              totalCashFlow >= 0 ? 'text-green-500' : 'text-red-500'
            )}>
              {formatCurrency(totalCashFlow)}
            </p>
            <p className="text-xs text-muted-foreground">over 10 years</p>
          </div>
          <div className="bg-neutral-800/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Total Equity</p>
            <p className="text-lg font-mono font-semibold text-brand-500">
              {formatCurrency(totalEquity)}
            </p>
            <p className="text-xs text-muted-foreground">at year 10</p>
          </div>
          <div className="bg-neutral-800/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Avg CoC Return</p>
            <p className={cn(
              'text-lg font-mono font-semibold',
              avgCoCReturn >= 0 ? 'text-green-500' : 'text-red-500'
            )}>
              {formatPercent(avgCoCReturn)}
            </p>
            <p className="text-xs text-muted-foreground">per year</p>
          </div>
          <div className="bg-neutral-800/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Total ROI</p>
            <p className={cn(
              'text-lg font-mono font-semibold',
              finalROI >= 0 ? 'text-green-500' : 'text-red-500'
            )}>
              {formatPercent(finalROI)}
            </p>
            <p className="text-xs text-muted-foreground">at year 10</p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-700">
                <th
                  className="text-left py-3 px-3 cursor-pointer hover:bg-neutral-800/50 transition-colors"
                  onClick={() => handleSort('year')}
                >
                  Year{renderSortIcon('year')}
                </th>
                <th
                  className="text-right py-3 px-3 cursor-pointer hover:bg-neutral-800/50 transition-colors"
                  onClick={() => handleSort('propertyValue')}
                >
                  Property Value{renderSortIcon('propertyValue')}
                </th>
                <th className="text-right py-3 px-3">Loan Balance</th>
                <th
                  className="text-right py-3 px-3 cursor-pointer hover:bg-neutral-800/50 transition-colors"
                  onClick={() => handleSort('equityTotal')}
                >
                  Total Equity{renderSortIcon('equityTotal')}
                </th>
                {expanded && (
                  <>
                    <th className="text-right py-3 px-3 text-brand-400">Forced</th>
                    <th className="text-right py-3 px-3 text-orange-400">Appreciation</th>
                    <th className="text-right py-3 px-3 text-yellow-400">Principal</th>
                  </>
                )}
                <th className="text-right py-3 px-3">Monthly Rent</th>
                <th
                  className="text-right py-3 px-3 cursor-pointer hover:bg-neutral-800/50 transition-colors"
                  onClick={() => handleSort('annualCashFlow')}
                >
                  Annual CF{renderSortIcon('annualCashFlow')}
                </th>
                <th className="text-right py-3 px-3">Cumulative CF</th>
                <th
                  className="text-right py-3 px-3 cursor-pointer hover:bg-neutral-800/50 transition-colors"
                  onClick={() => handleSort('cocReturn')}
                >
                  CoC Return{renderSortIcon('cocReturn')}
                </th>
                <th
                  className="text-right py-3 px-3 cursor-pointer hover:bg-neutral-800/50 transition-colors"
                  onClick={() => handleSort('totalROI')}
                >
                  Total ROI{renderSortIcon('totalROI')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedProjections.map((proj, index) => {
                const prevYear = index > 0 ? sortedProjections[index - 1] : null
                const cashFlowTrend = prevYear ? proj.annualCashFlow - prevYear.annualCashFlow : 0

                return (
                  <tr
                    key={proj.year}
                    className="border-b border-neutral-800 hover:bg-neutral-800/30 transition-colors"
                  >
                    <td className="py-3 px-3 font-medium">
                      Year {proj.year}
                    </td>
                    <td className="text-right py-3 px-3 font-mono">
                      {formatCurrency(proj.propertyValue)}
                    </td>
                    <td className="text-right py-3 px-3 font-mono text-muted-foreground">
                      {formatCurrency(proj.loanBalance)}
                    </td>
                    <td className="text-right py-3 px-3 font-mono font-medium text-brand-400">
                      {formatCurrency(proj.equityTotal)}
                    </td>
                    {expanded && (
                      <>
                        <td className="text-right py-3 px-3 font-mono text-brand-400/70">
                          {formatCurrency(proj.equityForced)}
                        </td>
                        <td className="text-right py-3 px-3 font-mono text-orange-400/70">
                          {formatCurrency(proj.equityAppreciation)}
                        </td>
                        <td className="text-right py-3 px-3 font-mono text-yellow-400/70">
                          {formatCurrency(proj.equityPrincipal)}
                        </td>
                      </>
                    )}
                    <td className="text-right py-3 px-3 font-mono text-muted-foreground">
                      {formatCurrency(proj.monthlyRent)}
                    </td>
                    <td className={cn(
                      'text-right py-3 px-3 font-mono',
                      proj.annualCashFlow >= 0 ? 'text-green-500' : 'text-red-500'
                    )}>
                      <span className="flex items-center justify-end gap-1">
                        {formatCurrency(proj.annualCashFlow)}
                        {cashFlowTrend > 0 && <TrendingUp className="h-3 w-3 text-green-500" />}
                        {cashFlowTrend < 0 && <TrendingDown className="h-3 w-3 text-red-500" />}
                      </span>
                    </td>
                    <td className={cn(
                      'text-right py-3 px-3 font-mono',
                      proj.cumulativeCashFlow >= 0 ? 'text-green-500/70' : 'text-red-500/70'
                    )}>
                      {formatCurrency(proj.cumulativeCashFlow)}
                    </td>
                    <td className={cn(
                      'text-right py-3 px-3 font-mono',
                      proj.cocReturn >= 0 ? 'text-green-500' : 'text-red-500'
                    )}>
                      {formatPercent(proj.cocReturn)}
                    </td>
                    <td className={cn(
                      'text-right py-3 px-3 font-mono font-medium',
                      proj.totalROI >= 0 ? 'text-green-500' : 'text-red-500'
                    )}>
                      {formatPercent(proj.totalROI)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-brand-500" />
            <span>Forced Equity (BRRR value-add)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-orange-500" />
            <span>Appreciation Equity</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-yellow-500" />
            <span>Principal Paydown</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
