import { describe, it, expect } from 'vitest'
import { calculateBRRR, type BRRRInputs } from './brrr'

const standardBRRRInputs: BRRRInputs = {
  // Buy Phase
  purchasePrice: 150000,
  closingCostPercent: 3,
  closingCostFixed: 0,
  downPaymentPercent: 25,
  interestRate: 7,
  loanTermYears: 30,
  points: 0,
  pmiMonthly: 0,
  
  // Rehab Phase
  rehabBudgetTotal: 30000,
  rehabTimelineMonths: 3,
  holdingCostsMonthly: 500,
  
  // Rent Phase
  monthlyRent: 1800,
  vacancyPercent: 5,
  maintenancePercent: 5,
  capexPercent: 8,
  managementPercent: 10,
  insuranceMonthly: 100,
  propertyTaxAnnual: 2400,
  hoaMonthly: 0,
  utilitiesMonthly: 0,
  otherExpensesMonthly: 0,
  
  // Refinance Phase
  arv: 220000,
  refiLtvPercent: 75,
  refiInterestRate: 7,
  refiLoanTermYears: 30,
  refiClosingCostPercent: 2,
  refiClosingCostFixed: 0,
}

describe('calculateBRRR - Buy Phase', () => {
  it('calculates closing costs correctly', () => {
    const result = calculateBRRR(standardBRRRInputs)
    // 3% of $150,000 = $4,500
    expect(result.closingCosts).toBe(4500)
  })

  it('calculates down payment correctly', () => {
    const result = calculateBRRR(standardBRRRInputs)
    // 25% of $150,000 = $37,500
    expect(result.downPayment).toBe(37500)
  })

  it('calculates loan amount correctly', () => {
    const result = calculateBRRR(standardBRRRInputs)
    // $150,000 - $37,500 = $112,500
    expect(result.loanAmount).toBe(112500)
  })

  it('calculates total cash to buy correctly', () => {
    const result = calculateBRRR(standardBRRRInputs)
    // $37,500 + $4,500 + $0 points = $42,000
    expect(result.totalCashToBuy).toBe(42000)
  })

  it('handles fixed down payment', () => {
    const result = calculateBRRR({
      ...standardBRRRInputs,
      downPaymentFixed: 50000,
    })
    expect(result.downPayment).toBe(50000)
    expect(result.loanAmount).toBe(100000)
  })

  it('includes points in total cash to buy', () => {
    const result = calculateBRRR({
      ...standardBRRRInputs,
      points: 2,
    })
    // $37,500 + $4,500 + $3,000 (2% of $150k) = $45,000
    expect(result.totalCashToBuy).toBe(45000)
  })
})

describe('calculateBRRR - Rehab Phase', () => {
  it('calculates holding costs correctly', () => {
    const result = calculateBRRR(standardBRRRInputs)
    // $500/month * 3 months = $1,500
    expect(result.holdingCosts).toBe(1500)
  })

  it('calculates total rehab costs correctly', () => {
    const result = calculateBRRR(standardBRRRInputs)
    // $30,000 + $1,500 = $31,500
    expect(result.totalRehabCosts).toBe(31500)
  })

  it('stores rehab budget correctly', () => {
    const result = calculateBRRR(standardBRRRInputs)
    expect(result.rehabBudget).toBe(30000)
  })
})

describe('calculateBRRR - Rent Phase', () => {
  it('calculates monthly rent correctly', () => {
    const result = calculateBRRR(standardBRRRInputs)
    expect(result.monthlyRent).toBe(1800)
  })

  it('calculates monthly expenses correctly', () => {
    const result = calculateBRRR(standardBRRRInputs)
    // Maintenance: $90, CapEx: $144, Management: $180, Insurance: $100, Tax: $200, HOA: $0
    expect(result.monthlyExpenses).toBe(714)
  })

  it('calculates monthly debt service correctly', () => {
    const result = calculateBRRR(standardBRRRInputs)
    // P&I for $112,500 at 7% for 30 years ≈ $748.54
    expect(result.monthlyDebtService).toBeCloseTo(748.54, 0)
  })

  it('calculates cap rate correctly', () => {
    const result = calculateBRRR(standardBRRRInputs)
    // NOI = ($1800 - 5% vacancy - $714 expenses) * 12 = ($1710 - $714) * 12 = $11,952
    // Cap Rate = $11,952 / $150,000 = 7.97%
    expect(result.capRate).toBeCloseTo(7.97, 0)
  })

  it('calculates total cash invested correctly', () => {
    const result = calculateBRRR(standardBRRRInputs)
    // Total cash to buy $42,000 + Total rehab costs $31,500 = $73,500
    expect(result.totalCashInvested).toBe(73500)
  })

  it('calculates initial CoC return correctly', () => {
    const result = calculateBRRR(standardBRRRInputs)
    // Annual cash flow / Total cash invested
    expect(result.initialCoCReturn).toBeGreaterThan(0)
  })
})

describe('calculateBRRR - Refinance Phase', () => {
  it('calculates new loan amount correctly', () => {
    const result = calculateBRRR(standardBRRRInputs)
    // $220,000 * 75% = $165,000
    expect(result.newLoanAmount).toBe(165000)
  })

  it('calculates refi closing costs correctly', () => {
    const result = calculateBRRR(standardBRRRInputs)
    // 2% of $165,000 = $3,300
    expect(result.refiClosingCosts).toBe(3300)
  })

  it('calculates cash out correctly', () => {
    const result = calculateBRRR(standardBRRRInputs)
    // $165,000 - $112,500 = $52,500
    expect(result.cashOut).toBe(52500)
  })

  it('calculates net cash out correctly', () => {
    const result = calculateBRRR(standardBRRRInputs)
    // $52,500 - $3,300 = $49,200
    expect(result.netCashOut).toBe(49200)
  })

  it('calculates cash left in deal correctly', () => {
    const result = calculateBRRR(standardBRRRInputs)
    // $73,500 - $49,200 = $24,300
    expect(result.cashLeftInDeal).toBe(24300)
  })

  it('calculates new monthly payment correctly', () => {
    const result = calculateBRRR(standardBRRRInputs)
    // P&I for $165,000 at 7% for 30 years ≈ $1,097.75
    expect(result.newMonthlyPayment).toBeCloseTo(1097.75, 0)
  })

  it('handles fixed refi closing costs', () => {
    const result = calculateBRRR({
      ...standardBRRRInputs,
      refiClosingCostPercent: 0,
      refiClosingCostFixed: 5000,
    })
    expect(result.refiClosingCosts).toBe(5000)
  })
})

describe('calculateBRRR - Equity Calculations', () => {
  it('calculates forced equity correctly', () => {
    const result = calculateBRRR(standardBRRRInputs)
    // $220,000 - $150,000 - $30,000 = $40,000
    expect(result.forcedEquity).toBe(40000)
  })

  it('calculates initial equity percent correctly', () => {
    const result = calculateBRRR(standardBRRRInputs)
    // ($220,000 - $165,000) / $220,000 = 25%
    expect(result.initialEquityPercent).toBe(25)
  })
})

describe('calculateBRRR - Infinite Return Scenario', () => {
  it('detects infinite return when cash left in deal <= 0', () => {
    // Create a scenario where we get all our money back
    const infiniteReturnInputs: BRRRInputs = {
      ...standardBRRRInputs,
      arv: 280000, // Higher ARV
      rehabBudgetTotal: 20000, // Lower rehab
    }

    const result = calculateBRRR(infiniteReturnInputs)

    // New loan = $280,000 * 75% = $210,000
    // Cash out = $210,000 - $112,500 = $97,500
    // Refi closing = $210,000 * 2% = $4,200
    // Net cash out = $97,500 - $4,200 = $93,300
    // Total invested = $42,000 + $21,500 = $63,500
    // Cash left = $63,500 - $93,300 = -$29,800 -> 0

    expect(result.cashLeftInDeal).toBe(0)
    expect(result.infiniteReturn).toBe(true)
    expect(result.postRefiCoCReturn).toBe(Infinity)
  })

  it('calculates velocity of money correctly', () => {
    const result = calculateBRRR(standardBRRRInputs)
    // Capital recycled / Total invested
    expect(result.velocityOfMoney).toBeCloseTo(result.capitalRecycled / result.totalCashInvested, 2)
  })
})

describe('calculateBRRR - Edge Cases', () => {
  it('handles zero ARV', () => {
    const result = calculateBRRR({
      ...standardBRRRInputs,
      arv: 0,
    })
    expect(result.newLoanAmount).toBe(0)
    expect(result.cashOut).toBeLessThan(0)
  })

  it('handles zero rent', () => {
    const result = calculateBRRR({
      ...standardBRRRInputs,
      monthlyRent: 0,
    })
    expect(result.monthlyRent).toBe(0)
    expect(result.monthlyCashFlow).toBeLessThan(0)
  })

  it('handles cash purchase (no financing)', () => {
    const result = calculateBRRR({
      ...standardBRRRInputs,
      downPaymentPercent: 100,
    })
    expect(result.loanAmount).toBe(0)
    expect(result.monthlyDebtService).toBe(0)
  })

  it('handles high LTV refinance', () => {
    const result = calculateBRRR({
      ...standardBRRRInputs,
      refiLtvPercent: 80,
    })
    // 80% of $220,000 = $176,000
    expect(result.newLoanAmount).toBe(176000)
  })
})

describe('calculateBRRR - Real World Scenarios', () => {
  it('typical BRRR deal with positive cash flow', () => {
    const result = calculateBRRR(standardBRRRInputs)

    // Should have positive monthly cash flow initially
    expect(result.monthlyCashFlow).toBeGreaterThan(0)

    // Should have positive forced equity
    expect(result.forcedEquity).toBeGreaterThan(0)

    // Should not have infinite return (we didn't get all money back)
    expect(result.infiniteReturn).toBe(false)
  })

  it('deal with negative post-refi cash flow', () => {
    // Higher refi loan means higher payments
    const result = calculateBRRR({
      ...standardBRRRInputs,
      arv: 280000,
      refiLtvPercent: 80,
    })

    // Post-refi payment will be higher due to larger loan
    expect(result.newMonthlyPayment).toBeGreaterThan(result.monthlyDebtService)
    
    // Post-refi cash flow might be negative
    if (result.postRefiCashFlow < 0) {
      expect(result.postRefiCashFlow).toBeLessThan(result.monthlyCashFlow)
    }
  })
})
