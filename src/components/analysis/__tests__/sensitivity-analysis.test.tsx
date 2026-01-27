import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SensitivityAnalysis } from '../sensitivity-analysis'
import type { Property } from '@/types/property'

const mockProperty: Property = {
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
  rehab_budget_total: 30000,
  rehab_budget_itemized: {
    kitchen: 10000, bathrooms: 5000, flooring: 5000,
    paint_interior: 3000, paint_exterior: 2000, roof: 0,
    hvac: 0, electrical: 0, plumbing: 0, windows: 0,
    doors: 0, landscaping: 0, foundation: 0, permits: 2000,
    contingency: 3000, other: 0,
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
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
}

describe('SensitivityAnalysis', () => {
  it('renders scenario summary section', () => {
    render(<SensitivityAnalysis property={mockProperty} />)
    expect(screen.getByText('Scenario Summary')).toBeDefined()
  })

  it('renders adjust variables section', () => {
    render(<SensitivityAnalysis property={mockProperty} />)
    expect(screen.getByText('Adjust Variables')).toBeDefined()
  })

  it('renders slider labels', () => {
    render(<SensitivityAnalysis property={mockProperty} />)
    expect(screen.getByText('Purchase Price')).toBeDefined()
    expect(screen.getByText('Monthly Rent')).toBeDefined()
    expect(screen.getByText('Interest Rate')).toBeDefined()
    expect(screen.getByText('Vacancy Rate')).toBeDefined()
    expect(screen.getByText('Appreciation Rate')).toBeDefined()
    expect(screen.getByText('CapEx Reserve')).toBeDefined()
  })

  it('renders metric labels', () => {
    render(<SensitivityAnalysis property={mockProperty} />)
    expect(screen.getByText('Monthly Cash Flow')).toBeDefined()
    expect(screen.getByText('CoC Return')).toBeDefined()
    expect(screen.getByText('Cap Rate')).toBeDefined()
  })

  it('renders without crashing when onChange is provided', () => {
    const onChange = vi.fn()
    const { container } = render(
      <SensitivityAnalysis property={mockProperty} onChange={onChange} />
    )
    expect(container.firstChild).toBeDefined()
  })
})
