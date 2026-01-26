import { describe, it, expect } from 'vitest'
import { calculateCashFlow, calculateMonthlyExpenses } from './cashflow'

describe('calculateCashFlow', () => {
  const baseInputs = {
    monthlyRent: 2000,
    vacancyPercent: 5,
    maintenancePercent: 5,
    capexPercent: 8,
    managementPercent: 10,
    insuranceMonthly: 100,
    propertyTaxAnnual: 3600,
    hoaMonthly: 0,
    utilitiesMonthly: 0,
    otherExpensesMonthly: 0,
    loanAmount: 160000,
    interestRate: 7,
    loanTermYears: 30,
    pmiMonthly: 0,
  }

  it('calculates gross rent correctly', () => {
    const result = calculateCashFlow(baseInputs)
    expect(result.grossRent).toBe(2000)
  })

  it('calculates vacancy correctly', () => {
    const result = calculateCashFlow(baseInputs)
    expect(result.vacancy).toBe(100) // 5% of $2000
  })

  it('calculates effective gross income correctly', () => {
    const result = calculateCashFlow(baseInputs)
    expect(result.effectiveGrossIncome).toBe(1900) // $2000 - $100 vacancy
  })

  it('calculates operating expenses correctly', () => {
    const result = calculateCashFlow(baseInputs)

    expect(result.operatingExpenses.maintenance).toBe(100) // 5% of $2000
    expect(result.operatingExpenses.capex).toBe(160) // 8% of $2000
    expect(result.operatingExpenses.management).toBe(200) // 10% of $2000
    expect(result.operatingExpenses.insurance).toBe(100)
    expect(result.operatingExpenses.propertyTax).toBe(300) // $3600 / 12
  })

  it('calculates NOI correctly', () => {
    const result = calculateCashFlow(baseInputs)

    // EGI - OpEx = NOI
    const expectedOpEx = 100 + 160 + 200 + 100 + 300 // maint + capex + mgmt + ins + tax
    const expectedNOI = 1900 - expectedOpEx
    expect(result.netOperatingIncome).toBe(expectedNOI)
  })

  it('calculates debt service correctly', () => {
    const result = calculateCashFlow(baseInputs)

    // Monthly P&I on $160k at 7% for 30 years is ~$1064
    expect(result.debtService).toBeCloseTo(1064, 0)
  })

  it('calculates monthly and annual cash flow correctly', () => {
    const result = calculateCashFlow(baseInputs)

    // Cash flow = NOI - debt service (use toBeCloseTo for floating point)
    expect(result.monthlyCashFlow).toBeCloseTo(result.netOperatingIncome - result.debtService, 2)
    expect(result.annualCashFlow).toBeCloseTo(result.monthlyCashFlow * 12, 2)
  })

  it('handles zero rent scenario', () => {
    const result = calculateCashFlow({
      ...baseInputs,
      monthlyRent: 0,
    })

    expect(result.grossRent).toBe(0)
    expect(result.vacancy).toBe(0)
    expect(result.operatingExpenses.maintenance).toBe(0)
  })

  it('includes PMI in debt service', () => {
    const result = calculateCashFlow({
      ...baseInputs,
      pmiMonthly: 150,
    })

    // P&I + PMI
    expect(result.debtService).toBeCloseTo(1064 + 150, 0)
  })

  it('handles no loan (cash purchase)', () => {
    const result = calculateCashFlow({
      ...baseInputs,
      loanAmount: 0,
    })

    expect(result.debtService).toBe(0)
    expect(result.monthlyCashFlow).toBe(result.netOperatingIncome)
  })

  it('handles HOA and utilities', () => {
    const result = calculateCashFlow({
      ...baseInputs,
      hoaMonthly: 250,
      utilitiesMonthly: 100,
    })

    expect(result.operatingExpenses.hoa).toBe(250)
    expect(result.operatingExpenses.utilities).toBe(100)
    expect(result.operatingExpenses.total).toBeGreaterThan(baseInputs.insuranceMonthly + 300)
  })
})

describe('calculateMonthlyExpenses', () => {
  it('calculates total monthly expenses correctly', () => {
    const expenses = calculateMonthlyExpenses(
      2000, // rent
      5,    // vacancy
      5,    // maintenance
      8,    // capex
      10,   // management
      100,  // insurance
      3600, // property tax annual
      0,    // hoa
      0,    // utilities
      0     // other
    )

    // vacancy: 100, maint: 100, capex: 160, mgmt: 200, ins: 100, tax: 300 = 960
    expect(expenses).toBe(960)
  })

  it('handles zero rent', () => {
    const expenses = calculateMonthlyExpenses(
      0, 5, 5, 8, 10, 100, 3600, 0, 0, 0
    )

    // Only fixed expenses: insurance 100 + tax 300 = 400
    expect(expenses).toBe(400)
  })

  it('includes all expense categories', () => {
    const expenses = calculateMonthlyExpenses(
      2000, // rent
      5,    // vacancy
      5,    // maintenance
      8,    // capex
      10,   // management
      100,  // insurance
      2400, // property tax annual ($200/mo)
      150,  // hoa
      75,   // utilities
      50    // other
    )

    // vacancy: 100, maint: 100, capex: 160, mgmt: 200, ins: 100, tax: 200, hoa: 150, util: 75, other: 50
    expect(expenses).toBe(100 + 100 + 160 + 200 + 100 + 200 + 150 + 75 + 50)
  })
})
