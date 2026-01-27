import { describe, it, expect } from 'vitest'
import { calculateCashFlow, calculateMonthlyExpenses, type CashFlowInputs } from '../cashflow'

const defaultInputs: CashFlowInputs = {
  monthlyRent: 1800,
  vacancyPercent: 5,
  maintenancePercent: 5,
  capexPercent: 8,
  managementPercent: 0,
  insuranceMonthly: 100,
  propertyTaxAnnual: 3000,
  hoaMonthly: 0,
  utilitiesMonthly: 0,
  otherExpensesMonthly: 0,
  loanAmount: 187500,
  interestRate: 7,
  loanTermYears: 30,
  pmiMonthly: 0,
}

describe('calculateCashFlow', () => {
  it('returns correct gross rent', () => {
    const result = calculateCashFlow(defaultInputs)
    expect(result.grossRent).toBe(1800)
  })

  it('calculates vacancy correctly', () => {
    const result = calculateCashFlow(defaultInputs)
    expect(result.vacancy).toBe(90) // 5% of 1800
  })

  it('calculates effective gross income', () => {
    const result = calculateCashFlow(defaultInputs)
    expect(result.effectiveGrossIncome).toBe(1710) // 1800 - 90
  })

  it('calculates operating expenses correctly', () => {
    const result = calculateCashFlow(defaultInputs)
    expect(result.operatingExpenses.maintenance).toBe(90) // 5% of 1800
    expect(result.operatingExpenses.capex).toBe(144)      // 8% of 1800
    expect(result.operatingExpenses.management).toBe(0)
    expect(result.operatingExpenses.insurance).toBe(100)
    expect(result.operatingExpenses.propertyTax).toBe(250) // 3000/12
    expect(result.operatingExpenses.hoa).toBe(0)
  })

  it('calculates net operating income', () => {
    const result = calculateCashFlow(defaultInputs)
    // NOI = EGI - OpEx
    expect(result.netOperatingIncome).toBe(
      result.effectiveGrossIncome - result.operatingExpenses.total
    )
  })

  it('calculates cash flow as NOI minus debt service', () => {
    const result = calculateCashFlow(defaultInputs)
    expect(result.monthlyCashFlow).toBeCloseTo(
      result.netOperatingIncome - result.debtService,
      0
    )
  })

  it('annual cash flow is 12x monthly', () => {
    const result = calculateCashFlow(defaultInputs)
    expect(result.annualCashFlow).toBeCloseTo(result.monthlyCashFlow * 12, 0)
  })

  it('handles zero rent', () => {
    const result = calculateCashFlow({ ...defaultInputs, monthlyRent: 0 })
    expect(result.grossRent).toBe(0)
    expect(result.monthlyCashFlow).toBeLessThan(0)
  })

  it('includes management fee when set', () => {
    const result = calculateCashFlow({ ...defaultInputs, managementPercent: 10 })
    expect(result.operatingExpenses.management).toBe(180) // 10% of 1800
  })
})

describe('calculateMonthlyExpenses', () => {
  it('sums all expenses correctly', () => {
    const total = calculateMonthlyExpenses(
      1800, 5, 5, 8, 0, 100, 3000, 0, 0, 0
    )
    // vacancy=90, maintenance=90, capex=144, mgmt=0, ins=100, tax=250, hoa=0, util=0, other=0
    expect(total).toBe(674)
  })

  it('includes all expense categories', () => {
    const total = calculateMonthlyExpenses(
      2000, 5, 5, 8, 10, 150, 3600, 200, 100, 50
    )
    // vacancy=100, maint=100, capex=160, mgmt=200, ins=150, tax=300, hoa=200, util=100, other=50
    expect(total).toBe(1360)
  })
})
