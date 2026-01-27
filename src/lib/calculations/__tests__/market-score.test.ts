import { describe, it, expect } from 'vitest'
import {
  calculateCashflowScore,
  calculateAppreciationScore,
  calculateStabilityScore,
  calculateMarketGrade,
  scoreMarket,
} from '../market-score'
import type { Market } from '@/types/market'

function createMarket(overrides: Partial<Market> = {}): Market {
  return {
    id: '1',
    zip: '30301',
    city: 'Atlanta',
    state: 'GA',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    median_home_price: 300000,
    median_rent: 2000,
    rent_price_ratio: 8,
    appreciation_1yr: 5,
    appreciation_3yr_cagr: 4,
    appreciation_5yr_cagr: 3.5,
    population: 500000,
    population_growth_1yr: 1.5,
    unemployment_rate: 3.5,
    job_growth_1yr: 2.5,
    income_growth_1yr: 3,
    months_of_inventory: 4,
    days_on_market_avg: 30,
    ...overrides,
  }
}

describe('calculateCashflowScore', () => {
  it('returns higher score for higher rent-price ratio', () => {
    const highRatio = createMarket({ rent_price_ratio: 12 })
    const lowRatio = createMarket({ rent_price_ratio: 5 })

    expect(calculateCashflowScore(highRatio)).toBeGreaterThan(
      calculateCashflowScore(lowRatio)
    )
  })

  it('returns 50 when no data is available', () => {
    const empty = createMarket({
      rent_price_ratio: null,
      median_rent: null,
      median_home_price: null,
      days_on_market_avg: null,
    })
    expect(calculateCashflowScore(empty)).toBe(50)
  })

  it('returns score between 0 and 100', () => {
    const score = calculateCashflowScore(createMarket())
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })
})

describe('calculateAppreciationScore', () => {
  it('returns higher score for higher appreciation', () => {
    const high = createMarket({ appreciation_1yr: 10, appreciation_3yr_cagr: 8, appreciation_5yr_cagr: 7 })
    const low = createMarket({ appreciation_1yr: 1, appreciation_3yr_cagr: 0, appreciation_5yr_cagr: 0 })

    expect(calculateAppreciationScore(high)).toBeGreaterThan(
      calculateAppreciationScore(low)
    )
  })

  it('returns 50 when no data is available', () => {
    const empty = createMarket({
      appreciation_1yr: null,
      appreciation_3yr_cagr: null,
      appreciation_5yr_cagr: null,
      population_growth_1yr: null,
    })
    expect(calculateAppreciationScore(empty)).toBe(50)
  })

  it('returns score between 0 and 100', () => {
    const score = calculateAppreciationScore(createMarket())
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })
})

describe('calculateStabilityScore', () => {
  it('returns higher score for low unemployment', () => {
    const low = createMarket({ unemployment_rate: 2 })
    const high = createMarket({ unemployment_rate: 8 })

    expect(calculateStabilityScore(low)).toBeGreaterThan(
      calculateStabilityScore(high)
    )
  })

  it('scores balanced inventory (3-6 months) higher', () => {
    const balanced = createMarket({ months_of_inventory: 4 })
    const tight = createMarket({ months_of_inventory: 1 })
    const oversupplied = createMarket({ months_of_inventory: 10 })

    expect(calculateStabilityScore(balanced)).toBeGreaterThan(
      calculateStabilityScore(tight)
    )
    expect(calculateStabilityScore(balanced)).toBeGreaterThan(
      calculateStabilityScore(oversupplied)
    )
  })

  it('returns 50 when no data is available', () => {
    const empty = createMarket({
      unemployment_rate: null,
      job_growth_1yr: null,
      income_growth_1yr: null,
      months_of_inventory: null,
      population: null,
    })
    expect(calculateStabilityScore(empty)).toBe(50)
  })
})

describe('calculateMarketGrade', () => {
  it('returns A for scores >= 80', () => {
    expect(calculateMarketGrade(90, 85, 80)).toBe('A')
  })

  it('returns B for scores 65-79', () => {
    expect(calculateMarketGrade(70, 70, 70)).toBe('B')
  })

  it('returns C for scores 50-64', () => {
    expect(calculateMarketGrade(55, 55, 55)).toBe('C')
  })

  it('returns D for scores 35-49', () => {
    expect(calculateMarketGrade(40, 40, 40)).toBe('D')
  })

  it('returns F for scores < 35', () => {
    expect(calculateMarketGrade(20, 20, 20)).toBe('F')
  })

  it('applies custom weights', () => {
    // High cashflow score with heavy cashflow weight should push grade up
    const grade = calculateMarketGrade(95, 30, 30, { cashflow: 80, appreciation: 10, stability: 10 })
    expect(grade).toBe('A')
  })
})

describe('scoreMarket', () => {
  it('returns all scores and grade', () => {
    const result = scoreMarket(createMarket())

    expect(result.cashflowScore).toBeGreaterThanOrEqual(0)
    expect(result.cashflowScore).toBeLessThanOrEqual(100)
    expect(result.appreciationScore).toBeGreaterThanOrEqual(0)
    expect(result.appreciationScore).toBeLessThanOrEqual(100)
    expect(result.stabilityScore).toBeGreaterThanOrEqual(0)
    expect(result.stabilityScore).toBeLessThanOrEqual(100)
    expect(['A', 'B', 'C', 'D', 'F']).toContain(result.overallGrade)
    expect(result.weightedScore).toBeGreaterThanOrEqual(0)
    expect(result.weightedScore).toBeLessThanOrEqual(100)
  })

  it('accepts custom weights', () => {
    const result = scoreMarket(createMarket(), { cashflow: 100, appreciation: 0, stability: 0 })
    expect(result.weightedScore).toBe(result.cashflowScore)
  })
})
