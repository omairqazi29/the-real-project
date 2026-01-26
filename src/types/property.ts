import type { DataSources } from './transparency'
import type { PropertyStatus, PropertyType, FinancingType } from '@/lib/constants'

export interface RehabBudget {
  kitchen: number
  bathrooms: number
  flooring: number
  paint_interior: number
  paint_exterior: number
  roof: number
  hvac: number
  electrical: number
  plumbing: number
  windows: number
  doors: number
  landscaping: number
  foundation: number
  permits: number
  contingency: number
  other: number
}

export interface ARVComp {
  id?: string
  address: string
  sold_price: number
  beds: number
  baths: number
  sqft: number
  price_per_sqft: number
  sold_date: string
  distance_miles: number
  source: string
  adjustments?: {
    sqft?: number
    condition?: number
    garage?: number
    pool?: number
    lot_size?: number
    other?: number
  }
  adjusted_price?: number
  notes?: string
}

export interface RentComp {
  id?: string
  address: string
  rent: number
  beds: number
  baths: number
  sqft: number
  distance_miles: number
  source: string
  date: string
  notes?: string
}

export interface Property {
  id: string
  user_id: string
  name: string
  address?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  county?: string | null
  property_type: PropertyType
  beds?: number | null
  baths?: number | null
  sqft?: number | null
  lot_sqft?: number | null
  year_built?: number | null
  photo_urls: string[]
  notes?: string | null
  status: PropertyStatus

  // Buy Phase
  purchase_price: number
  closing_cost_percent: number
  closing_cost_fixed: number
  earnest_money: number
  financing_type: FinancingType
  down_payment_percent: number
  down_payment_amount?: number | null
  interest_rate: number
  loan_term_years: number
  points: number
  pmi_monthly: number

  // Rehab Phase
  rehab_budget_total: number
  rehab_budget_itemized: RehabBudget
  rehab_timeline_months: number
  holding_costs_monthly: number

  // Rent Phase
  monthly_rent?: number | null
  rent_comps: RentComp[]
  vacancy_percent: number
  maintenance_percent: number
  capex_percent: number
  management_percent: number
  insurance_monthly: number
  property_tax_annual?: number | null
  property_tax_rate?: number | null
  hoa_monthly: number
  utilities_monthly: number
  other_expenses_monthly: number

  // Refinance Phase
  arv?: number | null
  arv_comps: ARVComp[]
  refi_ltv_percent: number
  refi_interest_rate: number
  refi_loan_term_years: number
  refi_closing_cost_percent: number
  refi_closing_cost_fixed: number

  // Appreciation & Growth
  appreciation_rate: number
  appreciation_low: number
  appreciation_high: number
  rent_growth_rate: number
  expense_growth_rate: number

  // Data Sources
  data_sources: DataSources

  // Calculated Fields
  calculated_monthly_cashflow?: number | null
  calculated_cap_rate?: number | null
  calculated_coc_return?: number | null
  calculated_total_investment?: number | null
  calculated_cash_left_in_deal?: number | null

  // Timestamps
  created_at: string
  updated_at: string
  analyzed_at?: string | null
}

export type PropertyFormData = Omit<Property, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'analyzed_at' | 'calculated_monthly_cashflow' | 'calculated_cap_rate' | 'calculated_coc_return' | 'calculated_total_investment' | 'calculated_cash_left_in_deal'>

export const DEFAULT_REHAB_BUDGET: RehabBudget = {
  kitchen: 0,
  bathrooms: 0,
  flooring: 0,
  paint_interior: 0,
  paint_exterior: 0,
  roof: 0,
  hvac: 0,
  electrical: 0,
  plumbing: 0,
  windows: 0,
  doors: 0,
  landscaping: 0,
  foundation: 0,
  permits: 0,
  contingency: 0,
  other: 0,
}
