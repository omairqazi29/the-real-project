import type { Market, MarketGrade, MarketScoreWeights } from '@/types/market'
import { clamp, roundTo } from '@/lib/utils'

/**
 * Calculate cashflow score (0-100) based on rent-price ratio and related metrics.
 * Higher rent-price ratio = better for cash flow investors.
 */
export function calculateCashflowScore(market: Market): number {
  let score = 0
  let factors = 0

  // Rent-price ratio (most important for cashflow)
  // Excellent: >= 1% monthly (12% annual), Poor: <= 0.4% (4.8% annual)
  if (market.rent_price_ratio != null) {
    const ratio = market.rent_price_ratio
    score += clamp((ratio - 4) / (12 - 4) * 100, 0, 100) * 2
    factors += 2
  }

  // Median rent relative to median home price
  if (market.median_rent != null && market.median_home_price != null && market.median_home_price > 0) {
    const monthlyRatio = (market.median_rent * 12) / market.median_home_price * 100
    score += clamp((monthlyRatio - 4) / (12 - 4) * 100, 0, 100)
    factors += 1
  }

  // Days on market (more days = less competition = easier to find deals)
  if (market.days_on_market_avg != null) {
    score += clamp(market.days_on_market_avg / 60 * 50, 10, 80)
    factors += 1
  }

  if (factors === 0) return 50
  return roundTo(clamp(score / factors, 0, 100), 0)
}

/**
 * Calculate appreciation score (0-100) based on historical and projected appreciation.
 */
export function calculateAppreciationScore(market: Market): number {
  let score = 0
  let factors = 0

  // 1yr appreciation (weight: 1)
  if (market.appreciation_1yr != null) {
    score += clamp((market.appreciation_1yr + 5) / 20 * 100, 0, 100)
    factors += 1
  }

  // 3yr CAGR (weight: 1.5)
  if (market.appreciation_3yr_cagr != null) {
    score += clamp((market.appreciation_3yr_cagr + 2) / 12 * 100, 0, 100) * 1.5
    factors += 1.5
  }

  // 5yr CAGR (weight: 2)
  if (market.appreciation_5yr_cagr != null) {
    score += clamp((market.appreciation_5yr_cagr + 1) / 10 * 100, 0, 100) * 2
    factors += 2
  }

  // Population growth (appreciation driver)
  if (market.population_growth_1yr != null) {
    score += clamp((market.population_growth_1yr + 1) / 4 * 100, 0, 100)
    factors += 1
  }

  if (factors === 0) return 50
  return roundTo(clamp(score / factors, 0, 100), 0)
}

/**
 * Calculate stability score (0-100) based on economic fundamentals.
 */
export function calculateStabilityScore(market: Market): number {
  let score = 0
  let factors = 0

  // Low unemployment = stable
  if (market.unemployment_rate != null) {
    score += clamp((10 - market.unemployment_rate) / 8 * 100, 0, 100)
    factors += 1
  }

  // Job growth = stable
  if (market.job_growth_1yr != null) {
    score += clamp((market.job_growth_1yr + 2) / 8 * 100, 0, 100)
    factors += 1
  }

  // Income growth = stable
  if (market.income_growth_1yr != null) {
    score += clamp((market.income_growth_1yr + 1) / 8 * 100, 0, 100)
    factors += 1
  }

  // Months of inventory (3-6 months = balanced market)
  if (market.months_of_inventory != null) {
    const moi = market.months_of_inventory
    // Balanced market (4-5 months) scores highest
    if (moi >= 3 && moi <= 6) {
      score += 80
    } else if (moi < 3) {
      score += clamp(moi / 3 * 60, 20, 60)
    } else {
      score += clamp((12 - moi) / 6 * 60, 10, 60)
    }
    factors += 1
  }

  // Population (larger = more stable)
  if (market.population != null) {
    if (market.population > 1000000) score += 90
    else if (market.population > 500000) score += 75
    else if (market.population > 100000) score += 60
    else if (market.population > 50000) score += 45
    else score += 30
    factors += 1
  }

  if (factors === 0) return 50
  return roundTo(clamp(score / factors, 0, 100), 0)
}

/**
 * Calculate overall market grade based on weighted scores.
 */
export function calculateMarketGrade(
  cashflowScore: number,
  appreciationScore: number,
  stabilityScore: number,
  weights: MarketScoreWeights = { cashflow: 40, appreciation: 35, stability: 25 }
): MarketGrade {
  const totalWeight = weights.cashflow + weights.appreciation + weights.stability
  const weighted =
    (cashflowScore * weights.cashflow +
      appreciationScore * weights.appreciation +
      stabilityScore * weights.stability) /
    totalWeight

  if (weighted >= 80) return 'A'
  if (weighted >= 65) return 'B'
  if (weighted >= 50) return 'C'
  if (weighted >= 35) return 'D'
  return 'F'
}

/**
 * Calculate all scores for a market.
 */
export function scoreMarket(
  market: Market,
  weights?: MarketScoreWeights
): {
  cashflowScore: number
  appreciationScore: number
  stabilityScore: number
  overallGrade: MarketGrade
  weightedScore: number
} {
  const cashflowScore = calculateCashflowScore(market)
  const appreciationScore = calculateAppreciationScore(market)
  const stabilityScore = calculateStabilityScore(market)
  const overallGrade = calculateMarketGrade(cashflowScore, appreciationScore, stabilityScore, weights)

  const w = weights ?? { cashflow: 40, appreciation: 35, stability: 25 }
  const totalWeight = w.cashflow + w.appreciation + w.stability
  const weightedScore = roundTo(
    (cashflowScore * w.cashflow + appreciationScore * w.appreciation + stabilityScore * w.stability) / totalWeight,
    1
  )

  return { cashflowScore, appreciationScore, stabilityScore, overallGrade, weightedScore }
}
