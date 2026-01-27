import { describe, it, expect } from 'vitest'
import {
  calculateCashFlow,
  calculateMonthlyExpenses,
  type CashFlowInputs,
} from './cashflow'

const baseInputs: CashFlowInputs = {
  monthlyRent: 2000,
  vacancyPercent: 5,
  maintenancePercent: 5,
  capexPercent: 8,
  managementPercent: 10,
  insuranceMonthly: 100,
  propertyTaxAnnual: 3600, // $300/month
  hoaMonthly: 50,
  utilitiesMonthly: 0,
  otherExpensesMonthly: 0,
  loanAmount: 160000,
  interestRate: 7,
  loanTermYears: 30,
  pmiMonthly: 0,
}

describe('calculateCashFlow', () => {
  it('calculates gross rent correctly', () => {
    const result = calculateCashFlow(baseInputs)
    expect(result.grossRent).toBe(2000)
  })

  it('calculates vacancy correctly', () => {
    const result = calculateCashFlow(baseInputs)
    // 5% of $2000 = $100
    expect(result.vacancy).toBe(100)
  })

  it('calculates effective gross income correctly', () => {
    const result = calculateCashFlow(baseInputs)
    // $2000 - $100 vacancy = $1900
    expect(result.effectiveGrossIncome).toBe(1900)
  })

  it('calculates operating expenses correctly', () => {
    const result = calculateCashFlow(baseInputs)

    // Maintenance: 5% of $2000 = $100
    expect(result.operatingExpenses.maintenance).toBe(100)

    // CapEx: 8% of $2000 = $160
    expect(result.operatingExpenses.capex).toBe(160)

    // Management: 10% of $2000 = $200
    expect(result.operatingExpenses.management).toBe(200)

    // Insurance: $100
    expect(result.operatingExpenses.insurance).toBe(100)

    // Property Tax: $3600/12 = $300
    expect(result.operatingExpenses.propertyTax).toBe(300)

    // HOA: $50
    expect(result.operatingExpenses.hoa).toBe(50)
  })

  it('calculates total operating expenses correctly', () => {
    const result = calculateCashFlow(baseInputs)
    // $100 + $160 + $200 + $100 + $300 + $50 + $0 + $0 = $910
    expect(result.operatingExpenses.total).toBe(910)
  })

  it('calculates NOI correctly', () => {
    const result = calculateCashFlow(baseInputs)
    // EGI $1900 - Operating Expenses $910 = $990
    expect(result.netOperatingIncome).toBe(990)
  })

  it('calculates debt service correctly', () => {
    const result = calculateCashFlow(baseInputs)
    // Monthly P&I for $160,000 at 7% for 30 years ≈ $1,064.48
    expect(result.debtService).toBeCloseTo(1064.48, 0)
  })

  it('calculates monthly cash flow correctly', () => {
    const result = calculateCashFlow(baseInputs)
    // NOI $990 - Debt Service ~$1064 = ~-$74
    expect(result.monthlyCashFlow).toBeCloseTo(-74, 0)
  })

  it('calculates annual cash flow correctly', () => {
    const result = calculateCashFlow(baseInputs)
    // Monthly * 12
    expect(result.annualCashFlow).toBeCloseTo(result.monthlyCashFlow * 12, 0)
  })

  it('handles zero rent', () => {
    const result = calculateCashFlow({
      ...baseInputs,
      monthlyRent: 0,
    })

    expect(result.grossRent).toBe(0)
    expect(result.vacancy).toBe(0)
    expect(result.effectiveGrossIncome).toBe(0)
    // Operating expenses based on fixed costs only
    expect(result.operatingExpenses.maintenance).toBe(0)
  })

  it('handles no mortgage (cash purchase)', () => {
    const result = calculateCashFlow({
      ...baseInputs,
      loanAmount: 0,
    })

    expect(result.debtService).toBe(0)
    // Cash flow = NOI with no debt service
    expect(result.monthlyCashFlow).toBe(result.netOperatingIncome)
  })

  it('includes PMI in debt service', () => {
    const result = calculateCashFlow({
      ...baseInputs,
      pmiMonthly: 150,
    })

    // Debt service should include PMI
    const baseResult = calculateCashFlow(baseInputs)
    expect(result.debtService).toBe(baseResult.debtService + 150)
  })

  it('handles high vacancy rate', () => {
    const result = calculateCashFlow({
      ...baseInputs,
      vacancyPercent: 20,
    })

    // 20% of $2000 = $400
    expect(result.vacancy).toBe(400)
    expect(result.effectiveGrossIncome).toBe(1600)
  })

  it('handles all utilities and other expenses', () => {
    const result = calculateCashFlow({
      ...baseInputs,
      utilitiesMonthly: 200,
      otherExpensesMonthly: 100,
    })

    expect(result.operatingExpenses.utilities).toBe(200)
    expect(result.operatingExpenses.other).toBe(100)
    expect(result.operatingExpenses.total).toBe(baseInputs.insuranceMonthly + 
      baseInputs.propertyTaxAnnual / 12 + 
      baseInputs.hoaMonthly + 
      200 + 100 + 
      (baseInputs.monthlyRent * (baseInputs.maintenancePercent + baseInputs.capexPercent + baseInputs.managementPercent) / 100))
  })
})

describe('calculateMonthlyExpenses', () => {
  it('calculates total monthly expenses', () => {
    const expenses = calculateMonthlyExpenses(
      2000, // monthlyRent
      5,    // vacancyPercent
      5,    // maintenancePercent
      8,    // capexPercent
      10,   // managementPercent
      100,  // insuranceMonthly
      3600, // propertyTaxAnnual
      50,   // hoaMonthly
      0,    // utilitiesMonthly
      0     // otherExpensesMonthly
    )

    // Vacancy: $100 + Maintenance: $100 + CapEx: $160 + Management: $200 + 
    // Insurance: $100 + Tax: $300 + HOA: $50 = $1010
    expect(expenses).toBe(1010)
  })

  it('handles zero rent', () => {
    const expenses = calculateMonthlyExpenses(
      0, 5, 5, 8, 10, 100, 3600, 50, 0, 0
    )

    // Only fixed expenses: $100 + $300 + $50 = $450
    expect(expenses).toBe(450)
  })

  it('includes utilities and other expenses', () => {
    const expenses = calculateMonthlyExpenses(
      2000, 5, 5, 8, 10, 100, 3600, 50, 150, 75
    )

    // Base $1010 + $150 + $75 = $1235
    expect(expenses).toBe(1235)
  })
})
