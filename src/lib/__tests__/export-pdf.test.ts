import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Property } from '@/types/property'
import type { BRRRResult, YearProjection } from '@/types/calculations'

// Mock jsPDF
const mockSave = vi.fn()
const mockAddPage = vi.fn()
const mockText = vi.fn()
const mockLine = vi.fn()
const mockRect = vi.fn()
const mockSetFontSize = vi.fn()
const mockSetFont = vi.fn()
const mockSetTextColor = vi.fn()
const mockSetDrawColor = vi.fn()
const mockSetFillColor = vi.fn()
const mockGetTextWidth = vi.fn().mockReturnValue(50)

class MockJsPDF {
  internal = {
    pageSize: { getWidth: () => 210, getHeight: () => 297 },
  }
  save = mockSave
  addPage = mockAddPage
  text = mockText
  line = mockLine
  rect = mockRect
  setFontSize = mockSetFontSize
  setFont = mockSetFont
  setTextColor = mockSetTextColor
  setDrawColor = mockSetDrawColor
  setFillColor = mockSetFillColor
  getTextWidth = mockGetTextWidth
}

vi.mock('jspdf', () => ({
  default: MockJsPDF,
}))

const mockProperty: Property = {
  id: 'test-1',
  user_id: 'user-1',
  name: 'Test Property',
  address: '123 Main St',
  city: 'Austin',
  state: 'TX',
  zip: '78701',
  property_type: 'SFH',
  beds: 3,
  baths: 2,
  sqft: 1500,
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
    doors: 0, landscaping: 2000, foundation: 0,
    permits: 1000, contingency: 2000, other: 0,
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
  property_tax_annual: 3600,
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

const mockBRRR: BRRRResult = {
  purchasePrice: 200000,
  closingCosts: 6000,
  downPayment: 50000,
  loanAmount: 150000,
  totalCashToBuy: 56000,
  rehabBudget: 30000,
  holdingCosts: 1500,
  totalRehabCosts: 31500,
  monthlyRent: 1800,
  monthlyExpenses: 624,
  monthlyDebtService: 998,
  monthlyCashFlow: 178,
  annualCashFlow: 2136,
  capRate: 5.08,
  initialCoCReturn: 2.44,
  arv: 280000,
  newLoanAmount: 210000,
  cashOut: 60000,
  refiClosingCosts: 4200,
  netCashOut: 55800,
  cashLeftInDeal: 31700,
  newMonthlyPayment: 1397,
  postRefiCashFlow: -221,
  postRefiCoCReturn: -8.37,
  forcedEquity: 50000,
  initialEquityPercent: 25,
  totalCashInvested: 87500,
  capitalRecycled: 55800,
  velocityOfMoney: 0.64,
  infiniteReturn: false,
}

const mockProjections: YearProjection[] = [
  {
    year: 1,
    propertyValue: 288400,
    appreciation: 8400,
    loanBalance: 148000,
    equityForced: 50000,
    equityAppreciation: 8400,
    equityPrincipal: 2000,
    equityTotal: 60400,
    monthlyRent: 1800,
    monthlyExpenses: 624,
    monthlyCashFlow: 178,
    annualCashFlow: 2136,
    cumulativeCashFlow: 2136,
    cocReturn: 2.44,
    totalROI: 71.47,
  },
]

describe('generatePropertyPDF', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('generates a PDF and saves it', async () => {
    const { generatePropertyPDF } = await import('../export-pdf')
    await generatePropertyPDF(mockProperty, mockBRRR, mockProjections)

    expect(mockSave).toHaveBeenCalledTimes(1)
    expect(mockSave).toHaveBeenCalledWith('test-property-analysis.pdf')
  })

  it('includes the property name in the PDF', async () => {
    const { generatePropertyPDF } = await import('../export-pdf')
    await generatePropertyPDF(mockProperty, mockBRRR, mockProjections)

    expect(mockText).toHaveBeenCalled()
    const calls = mockText.mock.calls
    const textContent = calls.map((c: string[]) => c[0]).join(' ')
    expect(textContent).toContain('Test Property')
  })

  it('includes BRRR metrics header', async () => {
    const { generatePropertyPDF } = await import('../export-pdf')
    await generatePropertyPDF(mockProperty, mockBRRR, mockProjections)

    const calls = mockText.mock.calls
    const textContent = calls.map((c: string[]) => c[0]).join(' ')
    expect(textContent).toContain('BRRR STRATEGY METRICS')
  })
})
