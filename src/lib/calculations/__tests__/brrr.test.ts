import { describe, it, expect } from 'vitest'
import { calculateBRRR, type BRRRInputs } from '../brrr'

const defaultBRRRInputs: BRRRInputs = {
  // Buy
  purchasePrice: 200000,
  closingCostPercent: 3,
  closingCostFixed: 0,
  downPaymentPercent: 25,
  interestRate: 7,
  loanTermYears: 30,
  points: 0,
  pmiMonthly: 0,
  // Rehab
  rehabBudgetTotal: 40000,
  rehabTimelineMonths: 3,
  holdingCostsMonthly: 500,
  // Rent
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
  // Refinance
  arv: 300000,
  refiLtvPercent: 75,
  refiInterestRate: 7,
  refiLoanTermYears: 30,
  refiClosingCostPercent: 2,
  refiClosingCostFixed: 0,
}

describe('calculateBRRR', () => {
  it('calculates buy phase correctly', () => {
    const result = calculateBRRR(defaultBRRRInputs)
    expect(result.purchasePrice).toBe(200000)
    expect(result.downPayment).toBe(50000)
    expect(result.loanAmount).toBe(150000)
    expect(result.closingCosts).toBe(6000) // 3% of 200k
  })

  it('calculates rehab phase correctly', () => {
    const result = calculateBRRR(defaultBRRRInputs)
    expect(result.rehabBudget).toBe(40000)
    expect(result.holdingCosts).toBe(1500) // 500 * 3 months
    expect(result.totalRehabCosts).toBe(41500) // 40000 + 1500
  })

  it('calculates total cash invested', () => {
    const result = calculateBRRR(defaultBRRRInputs)
    // downPayment + closingCosts + rehabBudget + holdingCosts
    expect(result.totalCashInvested).toBe(result.totalCashToBuy + result.totalRehabCosts)
  })

  it('calculates refinance phase correctly', () => {
    const result = calculateBRRR(defaultBRRRInputs)
    expect(result.arv).toBe(300000)
    expect(result.newLoanAmount).toBe(225000) // 75% of 300k
    expect(result.cashOut).toBe(75000) // 225k - 150k
    expect(result.refiClosingCosts).toBe(4500) // 2% of 225k
    expect(result.netCashOut).toBe(70500) // 75k - 4.5k
  })

  it('calculates forced equity', () => {
    const result = calculateBRRR(defaultBRRRInputs)
    expect(result.forcedEquity).toBe(60000) // 300k - 200k - 40k
  })

  it('calculates cash left in deal', () => {
    const result = calculateBRRR(defaultBRRRInputs)
    // totalCashInvested - netCashOut
    const expected = Math.max(0, result.totalCashInvested - result.netCashOut)
    expect(result.cashLeftInDeal).toBe(expected)
  })

  it('produces positive monthly cash flow for good deal', () => {
    const result = calculateBRRR(defaultBRRRInputs)
    expect(result.monthlyCashFlow).toBeGreaterThan(0)
  })

  it('identifies infinite return when no cash left in deal', () => {
    // High ARV to get all money back
    const inputs: BRRRInputs = {
      ...defaultBRRRInputs,
      arv: 500000,
    }
    const result = calculateBRRR(inputs)
    expect(result.cashLeftInDeal).toBe(0)
    expect(result.infiniteReturn).toBe(true)
  })

  it('calculates velocity of money', () => {
    const result = calculateBRRR(defaultBRRRInputs)
    if (result.netCashOut > 0) {
      expect(result.capitalRecycled).toBe(result.netCashOut)
      expect(result.velocityOfMoney).toBeCloseTo(
        result.capitalRecycled / result.totalCashInvested,
        2
      )
    }
  })

  it('uses fixed down payment when provided', () => {
    const inputs: BRRRInputs = {
      ...defaultBRRRInputs,
      downPaymentFixed: 40000,
    }
    const result = calculateBRRR(inputs)
    expect(result.downPayment).toBe(40000)
    expect(result.loanAmount).toBe(160000)
  })
})
