import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusPipeline } from '../status-pipeline'
import type { Property } from '@/types/property'

const createProperty = (overrides: Partial<Property>): Property => ({
  id: '1',
  user_id: 'user1',
  name: 'Test Property',
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
  rehab_budget_total: 0,
  rehab_budget_itemized: {
    kitchen: 0, bathrooms: 0, flooring: 0, paint_interior: 0,
    paint_exterior: 0, roof: 0, hvac: 0, electrical: 0,
    plumbing: 0, windows: 0, doors: 0, landscaping: 0,
    foundation: 0, permits: 0, contingency: 0, other: 0,
  },
  rehab_timeline_months: 3,
  holding_costs_monthly: 0,
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
  arv: 200000,
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
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  ...overrides,
})

describe('StatusPipeline', () => {
  it('renders all status columns', () => {
    render(<StatusPipeline properties={[]} />)
    expect(screen.getByText('Analyzing')).toBeDefined()
    expect(screen.getByText('Researching')).toBeDefined()
    expect(screen.getByText('Offer Made')).toBeDefined()
    expect(screen.getByText('Rented')).toBeDefined()
  })

  it('places properties in correct columns', () => {
    const properties = [
      createProperty({ id: '1', name: 'Prop A', status: 'analyzing' }),
      createProperty({ id: '2', name: 'Prop B', status: 'rented' }),
      createProperty({ id: '3', name: 'Prop C', status: 'analyzing' }),
    ]

    render(<StatusPipeline properties={properties} />)
    expect(screen.getByText('Prop A')).toBeDefined()
    expect(screen.getByText('Prop B')).toBeDefined()
    expect(screen.getByText('Prop C')).toBeDefined()
  })

  it('shows count badges for columns with properties', () => {
    const properties = [
      createProperty({ id: '1', name: 'Prop A', status: 'analyzing' }),
      createProperty({ id: '2', name: 'Prop B', status: 'analyzing' }),
    ]

    render(<StatusPipeline properties={properties} />)
    expect(screen.getByText('2')).toBeDefined()
  })

  it('renders empty state with no properties', () => {
    const { container } = render(<StatusPipeline properties={[]} />)
    expect(container.firstChild).toBeDefined()
  })
})
