import { describe, it, expect } from 'vitest'
import { calculateBRRR, type BRRRInputs } from './brrr'

describe('calculateBRRR', () => {
  const standardBRRRInputs: BRRRInputs = {
    // Buy Phase
    purchasePrice: 150000,
    closingCostPercent: 3,
    closingCostFixed: 0,
    downPaymentPercent: 25,
    interestRate: 7.5,
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
    managementPercent: 8,
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

  describe('Buy Phase calculations', () => {
    it('calculates closing costs correctly', () => {
      const result = calculateBRRR(standardBRRRInputs)
      expect(result.closingCosts).toBe(4500) // 3% of $150k
    })

    it('calculates down payment correctly', () => {
      const result = calculateBRRR(standardBRRRInputs)
      expect(result.downPayment).toBe(37500) // 25% of $150k
    })

    it('calculates loan amount correctly', () => {
      const result = calculateBRRR(standardBRRRInputs)
      expect(result.loanAmount).toBe(112500) // $150k - $37.5k
    })

    it('calculates total cash to buy correctly', () => {
      const result = calculateBRRR(standardBRRRInputs)
      // down payment + closing costs + points
      expect(result.totalCashToBuy).toBe(37500 + 4500 + 0)
    })

    it('handles fixed down payment', () => {
      const result = calculateBRRR({
        ...standardBRRRInputs,
        downPaymentFixed: 40000,
      })
      expect(result.downPayment).toBe(40000)
      expect(result.loanAmount).toBe(110000)
    })
  })

  describe('Rehab Phase calculations', () => {
    it('calculates holding costs correctly', () => {
      const result = calculateBRRR(standardBRRRInputs)
      expect(result.holdingCosts).toBe(1500) // $500 * 3 months
    })

    it('calculates total rehab costs correctly', () => {
      const result = calculateBRRR(standardBRRRInputs)
      expect(result.totalRehabCosts).toBe(31500) // $30k rehab + $1.5k holding
    })
  })

  describe('Rent Phase calculations', () => {
    it('calculates monthly cash flow', () => {
      const result = calculateBRRR(standardBRRRInputs)
      expect(result.monthlyCashFlow).toBeDefined()
      expect(typeof result.monthlyCashFlow).toBe('number')
    })

    it('calculates initial cap rate', () => {
      const result = calculateBRRR(standardBRRRInputs)
      expect(result.capRate).toBeGreaterThan(0)
    })

    it('calculates initial CoC return', () => {
      const result = calculateBRRR(standardBRRRInputs)
      expect(result.initialCoCReturn).toBeDefined()
    })
  })

  describe('Refinance Phase calculations', () => {
    it('calculates new loan amount correctly', () => {
      const result = calculateBRRR(standardBRRRInputs)
      expect(result.newLoanAmount).toBe(165000) // 75% of $220k ARV
    })

    it('calculates cash out correctly', () => {
      const result = calculateBRRR(standardBRRRInputs)
      // New loan - old loan = cash out
      expect(result.cashOut).toBe(165000 - 112500) // $52,500
    })

    it('calculates refi closing costs correctly', () => {
      const result = calculateBRRR(standardBRRRInputs)
      expect(result.refiClosingCosts).toBe(3300) // 2% of $165k
    })

    it('calculates net cash out correctly', () => {
      const result = calculateBRRR(standardBRRRInputs)
      // Cash out - refi closing costs
      expect(result.netCashOut).toBe(52500 - 3300)
    })

    it('calculates cash left in deal correctly', () => {
      const result = calculateBRRR(standardBRRRInputs)
      // Total invested - net cash out
      const totalInvested = 42000 + 31500 // buy + rehab
      const netCashOut = 52500 - 3300
      expect(result.cashLeftInDeal).toBe(Math.max(0, totalInvested - netCashOut))
    })
  })

  describe('Equity calculations', () => {
    it('calculates forced equity correctly', () => {
      const result = calculateBRRR(standardBRRRInputs)
      // ARV - purchase price - rehab = forced equity
      expect(result.forcedEquity).toBe(220000 - 150000 - 30000)
    })

    it('calculates initial equity percent correctly', () => {
      const result = calculateBRRR(standardBRRRInputs)
      // (ARV - new loan) / ARV * 100
      expect(result.initialEquityPercent).toBe(25) // 25% equity at 75% LTV
    })
  })

  describe('Summary metrics', () => {
    it('calculates total cash invested correctly', () => {
      const result = calculateBRRR(standardBRRRInputs)
      expect(result.totalCashInvested).toBe(result.totalCashToBuy + result.totalRehabCosts)
    })

    it('calculates capital recycled', () => {
      const result = calculateBRRR(standardBRRRInputs)
      expect(result.capitalRecycled).toBeGreaterThanOrEqual(0)
    })

    it('calculates velocity of money', () => {
      const result = calculateBRRR(standardBRRRInputs)
      expect(result.velocityOfMoney).toBeDefined()
    })

    it('identifies infinite return scenarios', () => {
      // Scenario where you get all your money back
      const result = calculateBRRR({
        ...standardBRRRInputs,
        arv: 300000, // Higher ARV = more cash out
      })

      // With higher ARV, might achieve infinite return
      if (result.cashLeftInDeal <= 0) {
        expect(result.infiniteReturn).toBe(true)
      }
    })
  })

  describe('Edge cases', () => {
    it('handles zero rent', () => {
      const result = calculateBRRR({
        ...standardBRRRInputs,
        monthlyRent: 0,
      })

      expect(result.monthlyRent).toBe(0)
      expect(result.monthlyCashFlow).toBeLessThan(0)
    })

    it('handles zero rehab', () => {
      const result = calculateBRRR({
        ...standardBRRRInputs,
        rehabBudgetTotal: 0,
        holdingCostsMonthly: 0,
        rehabTimelineMonths: 0,
      })

      expect(result.rehabBudget).toBe(0)
      expect(result.totalRehabCosts).toBe(0)
    })

    it('handles ARV equal to purchase price (no appreciation)', () => {
      const result = calculateBRRR({
        ...standardBRRRInputs,
        arv: 150000, // Same as purchase
        rehabBudgetTotal: 0,
      })

      expect(result.forcedEquity).toBe(0)
    })

    it('handles 100% financing', () => {
      const result = calculateBRRR({
        ...standardBRRRInputs,
        downPaymentPercent: 0,
      })

      expect(result.downPayment).toBe(0)
      expect(result.loanAmount).toBe(150000)
    })

    it('handles cash purchase', () => {
      const result = calculateBRRR({
        ...standardBRRRInputs,
        downPaymentPercent: 100,
      })

      expect(result.loanAmount).toBe(0)
      expect(result.downPayment).toBe(150000)
    })
  })
})
