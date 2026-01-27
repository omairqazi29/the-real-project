import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ComparisonTable } from '../comparison-table'
import type { Property } from '@/types/property'

const baseProperty: Property = {
  id: '1',
  user_id: 'user1',
  name: 'Property A',
  property_type: 'SFH',
  status: 'analyzing',
  purchase_price: 200000,
  closing_cost_percent: 3,
  closing_cost_fixed: 0,
  earnest_money: 0,
  financing_type: 'conventional',
  down_payment_percent: 25,
  interest_rate: 7,
  loan_term_years: 30,
  points: 0,
  pmi_monthly: 0,
  rehab_budget_total: 30000,
  rehab_budget_itemized: {
    kitchen: 0, bathrooms: 0, flooring: 0, paint_interior: 0,
    paint_exterior: 0, roof: 0, hvac: 0, electrical: 0,
    plumbing: 0, windows: 0, doors: 0, landscaping: 0,
    foundation: 0, permits: 0, contingency: 0, other: 0,
  },
  rehab_timeline_months: 3,
  holding_costs_monthly: 500,
  monthly_rent: 1800,
  rent_comps: [],
  vacancy_percent: 5,
  maintenance_percent: 5,
  capex_percent: 8,
  management_percent: 0,
  insurance_monthly: 100,
  property_tax_annual: 2400,
  hoa_monthly: 0,
  utilities_monthly: 0,
  other_expenses_monthly: 0,
  arv: 280000,
  arv_comps: [],
  refi_ltv_percent: 75,
  refi_interest_rate: 7,
  refi_loan_term_years: 30,
  refi_closing_cost_percent: 2,
  refi_closing_cost_fixed: 0,
  appreciation_rate: 3,
  appreciation_low: 1,
  appreciation_high: 5,
  rent_growth_rate: 2,
  expense_growth_rate: 2,
  data_sources: {},
  photo_urls: [],
  calculated_monthly_cashflow: 312,
  calculated_cap_rate: 6.5,
  calculated_coc_return: 12.3,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
}

describe('ComparisonTable', () => {
  const properties: Property[] = [
    baseProperty,
    { ...baseProperty, id: '2', name: 'Property B', purchase_price: 250000, monthly_rent: 2200 },
  ]

  it('renders property names as headers', () => {
    render(<ComparisonTable properties={properties} />)
    expect(screen.getByText('Property A')).toBeDefined()
    expect(screen.getByText('Property B')).toBeDefined()
  })

  it('renders comparison metrics', () => {
    render(<ComparisonTable properties={properties} />)
    expect(screen.getByText('Purchase Price')).toBeDefined()
    expect(screen.getByText('Monthly Rent')).toBeDefined()
  })

  it('renders with single property', () => {
    const { container } = render(<ComparisonTable properties={[baseProperty]} />)
    expect(container.firstChild).toBeDefined()
  })

  it('renders with empty array', () => {
    const { container } = render(<ComparisonTable properties={[]} />)
    expect(container.firstChild).toBeDefined()
  })
})
