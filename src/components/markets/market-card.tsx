'use client'

import Link from 'next/link'
import { cn } from '@/lib/cn'
import { Card, CardContent } from '@/components/ui'
import { MarketGradeBadge } from './market-grade-badge'
import { formatCurrency, formatPercent, formatNumber } from '@/lib/format'
import type { Market } from '@/types/market'

interface MarketCardProps {
  market: Market
  className?: string
}

function ScoreBar({ label, value }: { label: string; value: number | null | undefined }) {
  const score = value ?? 0

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-neutral-400">{label}</span>
        <span className="text-neutral-300">{Math.round(score)}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
        <div
          className="h-full bg-brand-600 transition-all duration-300 ease-out"
          style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
        />
      </div>
    </div>
  )
}

export function MarketCard({ market, className }: MarketCardProps) {
  return (
    <Link href={`/markets/${market.zip}`}>
      <Card
        className={cn(
          'cursor-pointer transition-colors hover:border-neutral-700',
          className
        )}
      >
        <CardContent className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-neutral-100">
                {market.city}, {market.state}
              </h3>
              <p className="text-sm text-neutral-400">{market.zip}</p>
            </div>
            {market.overall_grade && (
              <MarketGradeBadge grade={market.overall_grade} size="sm" />
            )}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-neutral-400">Median Price</span>
              <p className="font-medium text-neutral-100">
                {market.median_home_price
                  ? formatCurrency(market.median_home_price)
                  : '--'}
              </p>
            </div>
            <div>
              <span className="text-neutral-400">Median Rent</span>
              <p className="font-medium text-neutral-100">
                {market.median_rent
                  ? formatCurrency(market.median_rent)
                  : '--'}
              </p>
            </div>
            <div>
              <span className="text-neutral-400">Rent/Price</span>
              <p className="font-medium text-neutral-100">
                {market.rent_price_ratio
                  ? formatPercent(market.rent_price_ratio)
                  : '--'}
              </p>
            </div>
            <div>
              <span className="text-neutral-400">Appreciation 1yr</span>
              <p className="font-medium text-neutral-100">
                {market.appreciation_1yr != null
                  ? formatPercent(market.appreciation_1yr)
                  : '--'}
              </p>
            </div>
          </div>

          {/* Score Bars */}
          <div className="space-y-2 pt-1">
            <ScoreBar label="Cashflow" value={market.cashflow_score} />
            <ScoreBar label="Appreciation" value={market.appreciation_score} />
            <ScoreBar label="Stability" value={market.stability_score} />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
