export interface Market {
  id: string
  zip: string
  city: string
  county?: string | null
  state: string
  metro_area?: string | null

  // Market Metrics
  median_home_price?: number | null
  median_rent?: number | null
  rent_price_ratio?: number | null
  price_per_sqft?: number | null
  rent_per_sqft?: number | null

  // Historical Performance
  appreciation_1yr?: number | null
  appreciation_3yr_cagr?: number | null
  appreciation_5yr_cagr?: number | null
  appreciation_10yr_cagr?: number | null

  // Economic Indicators
  population?: number | null
  population_growth_1yr?: number | null
  population_growth_5yr?: number | null
  median_household_income?: number | null
  income_growth_1yr?: number | null
  unemployment_rate?: number | null
  job_growth_1yr?: number | null

  // Supply Metrics
  months_of_inventory?: number | null
  days_on_market_avg?: number | null
  new_listings_yoy_change?: number | null
  building_permits_yoy_change?: number | null

  // Scores
  overall_grade?: MarketGrade | null
  cashflow_score?: number | null
  appreciation_score?: number | null
  stability_score?: number | null

  // Meta
  data_date?: string | null
  sources?: Record<string, string>
  created_at: string
  updated_at: string
}

export type MarketGrade = 'A' | 'B' | 'C' | 'D' | 'F'

export interface MarketScoreWeights {
  cashflow: number
  appreciation: number
  stability: number
}

export const DEFAULT_SCORE_WEIGHTS: MarketScoreWeights = {
  cashflow: 40,
  appreciation: 35,
  stability: 25,
}
