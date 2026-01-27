import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PipelineCard } from '../pipeline-card'
import type { Property } from '@/types/property'

const mockProperty: Property = {
  id: '1',
  user_id: 'user1',
  name: 'Test Investment Property',
  address: '123 Main St',
  city: 'Atlanta',
  state: 'GA',
  zip: '30301',
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
  calculated_monthly_cashflow: 312,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
}

describe('PipelineCard', () => {
  it('renders property name', () => {
    render(<PipelineCard property={mockProperty} />)
    expect(screen.getByText('Test Investment Property')).toBeDefined()
  })

  it('renders purchase price', () => {
    render(<PipelineCard property={mockProperty} />)
    expect(screen.getByText('$200,000')).toBeDefined()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<PipelineCard property={mockProperty} onClick={onClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalled()
  })

  it('shows cash flow value', () => {
    render(<PipelineCard property={mockProperty} />)
    const button = screen.getByRole('button')
    expect(button.textContent).toContain('312')
    expect(button.textContent).toContain('/mo')
  })

  it('renders property type badge', () => {
    render(<PipelineCard property={mockProperty} />)
    expect(screen.getByText('Single Family Home')).toBeDefined()
  })

  it('renders address when provided', () => {
    render(<PipelineCard property={mockProperty} />)
    expect(screen.getByText(/123 Main St/)).toBeDefined()
  })
})
