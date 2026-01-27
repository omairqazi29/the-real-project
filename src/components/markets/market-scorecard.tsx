'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/cn'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { MarketGradeBadge } from './market-grade-badge'
import { formatCurrency, formatPercent, formatNumber } from '@/lib/format'
import { scoreMarket, calculateCashflowScore, calculateAppreciationScore, calculateStabilityScore } from '@/lib/calculations/market-score'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import type { Market } from '@/types/market'

interface MarketScorecardProps {
  market: Market
}

function MetricRow({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={cn('flex justify-between', className)}>
      <span className="text-muted-foreground">{label}</span>
      <span className="text-neutral-100">{value}</span>
    </div>
  )
}

function ScoreProgress({
  label,
  score,
  color,
}: {
  label: string
  score: number
  color: string
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-neutral-300">{label}</span>
        <span className="font-medium text-neutral-100">{Math.round(score)}/100</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
        <div
          className={cn('h-full transition-all duration-300 ease-out', color)}
          style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
        />
      </div>
    </div>
  )
}

export function MarketScorecard({ market }: MarketScorecardProps) {
  const scores = useMemo(() => {
    const cashflow = market.cashflow_score ?? calculateCashflowScore(market)
    const appreciation = market.appreciation_score ?? calculateAppreciationScore(market)
    const stability = market.stability_score ?? calculateStabilityScore(market)
    const { weightedScore } = scoreMarket(market)

    return { cashflow, appreciation, stability, overall: weightedScore }
  }, [market])

  const radarData = [
    { metric: 'Cashflow', score: scores.cashflow },
    { metric: 'Appreciation', score: scores.appreciation },
    { metric: 'Stability', score: scores.stability },
  ]

  const barData = [
    { name: 'Cashflow', score: scores.cashflow },
    { name: 'Appreciation', score: scores.appreciation },
    { name: 'Stability', score: scores.stability },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-100">
            {market.city}, {market.state} {market.zip}
          </h2>
          {market.metro_area && (
            <p className="text-sm text-neutral-400">{market.metro_area} Metro Area</p>
          )}
        </div>
        {market.overall_grade && (
          <MarketGradeBadge
            grade={market.overall_grade}
            score={scores.overall}
            size="lg"
          />
        )}
      </div>

      {/* Score Chart & Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScoreProgress label="Cashflow" score={scores.cashflow} color="bg-green-500" />
            <ScoreProgress label="Appreciation" score={scores.appreciation} color="bg-blue-500" />
            <ScoreProgress label="Stability" score={scores.stability} color="bg-yellow-500" />
            <div className="border-t border-neutral-800 pt-4">
              <ScoreProgress label="Overall" score={scores.overall} color="bg-brand-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Score Radar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#404040" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#a3a3a3', fontSize: 12 }} />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: '#a3a3a3', fontSize: 10 }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#dc2626"
                    fill="#dc2626"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <MetricRow
              label="Median Home Price"
              value={market.median_home_price ? formatCurrency(market.median_home_price) : '--'}
            />
            <MetricRow
              label="Median Rent"
              value={market.median_rent ? formatCurrency(market.median_rent) : '--'}
            />
            <MetricRow
              label="Rent-to-Price Ratio"
              value={market.rent_price_ratio ? formatPercent(market.rent_price_ratio) : '--'}
            />
            <MetricRow
              label="Price per Sqft"
              value={market.price_per_sqft ? formatCurrency(market.price_per_sqft) : '--'}
            />
            <MetricRow
              label="Rent per Sqft"
              value={market.rent_per_sqft ? formatCurrency(market.rent_per_sqft) : '--'}
            />
          </CardContent>
        </Card>

        {/* Cash Flow */}
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <MetricRow
              label="Median Rent"
              value={market.median_rent ? formatCurrency(market.median_rent) : '--'}
            />
            <MetricRow
              label="Rent-to-Price Ratio"
              value={market.rent_price_ratio ? formatPercent(market.rent_price_ratio) : '--'}
            />
            <MetricRow
              label="Months of Inventory"
              value={market.months_of_inventory != null ? formatNumber(market.months_of_inventory) : '--'}
            />
            <MetricRow
              label="Days on Market"
              value={market.days_on_market_avg != null ? formatNumber(market.days_on_market_avg) : '--'}
            />
          </CardContent>
        </Card>

        {/* Appreciation */}
        <Card>
          <CardHeader>
            <CardTitle>Appreciation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <MetricRow
              label="1-Year"
              value={market.appreciation_1yr != null ? formatPercent(market.appreciation_1yr) : '--'}
            />
            <MetricRow
              label="3-Year CAGR"
              value={market.appreciation_3yr_cagr != null ? formatPercent(market.appreciation_3yr_cagr) : '--'}
            />
            <MetricRow
              label="5-Year CAGR"
              value={market.appreciation_5yr_cagr != null ? formatPercent(market.appreciation_5yr_cagr) : '--'}
            />
            <MetricRow
              label="10-Year CAGR"
              value={market.appreciation_10yr_cagr != null ? formatPercent(market.appreciation_10yr_cagr) : '--'}
            />
          </CardContent>
        </Card>

        {/* Stability / Economic */}
        <Card>
          <CardHeader>
            <CardTitle>Stability &amp; Economic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <MetricRow
              label="Population"
              value={market.population ? formatNumber(market.population) : '--'}
            />
            <MetricRow
              label="Population Growth (1yr)"
              value={market.population_growth_1yr != null ? formatPercent(market.population_growth_1yr) : '--'}
            />
            <MetricRow
              label="Median Income"
              value={market.median_household_income ? formatCurrency(market.median_household_income) : '--'}
            />
            <MetricRow
              label="Unemployment Rate"
              value={market.unemployment_rate != null ? formatPercent(market.unemployment_rate) : '--'}
            />
            <MetricRow
              label="Job Growth (1yr)"
              value={market.job_growth_1yr != null ? formatPercent(market.job_growth_1yr) : '--'}
            />
            <MetricRow
              label="Income Growth (1yr)"
              value={market.income_growth_1yr != null ? formatPercent(market.income_growth_1yr) : '--'}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
