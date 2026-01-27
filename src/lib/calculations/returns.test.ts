import { describe, it, expect } from 'vitest'
import {
  calculateCapRate,
  calculateCashOnCash,
  calculateGRM,
  calculateDSCR,
  calculateTotalROI,
  calculateAnnualizedROI,
  calculateIRR,
  calculateReturns,
  checkOnePercentRule,
  estimate50PercentRule,
  calculate70PercentRule,
} from './returns'

describe('calculateCapRate', () => {
  it('calculates cap rate correctly', () => {
    // $24,000 NOI / $300,000 property = 8%
    const capRate = calculateCapRate(24000, 300000)
    expect(capRate).toBe(8)
  })

  it('returns 0 for zero property value', () => {
    const capRate = calculateCapRate(24000, 0)
    expect(capRate).toBe(0)
  })

  it('returns 0 for negative property value', () => {
    const capRate = calculateCapRate(24000, -100000)
    expect(capRate).toBe(0)
  })

  it('handles negative NOI', () => {
    const capRate = calculateCapRate(-5000, 300000)
    expect(capRate).toBeCloseTo(-1.67, 1)
  })
})

describe('calculateCashOnCash', () => {
  it('calculates CoC return correctly', () => {
    // $6,000 annual cash flow / $50,000 invested = 12%
    const coc = calculateCashOnCash(6000, 50000)
    expect(coc).toBe(12)
  })

  it('returns Infinity for positive cash flow with zero investment', () => {
    const coc = calculateCashOnCash(6000, 0)
    expect(coc).toBe(Infinity)
  })

  it('returns 0 for negative or zero cash flow with zero investment', () => {
    expect(calculateCashOnCash(0, 0)).toBe(0)
    expect(calculateCashOnCash(-1000, 0)).toBe(0)
  })

  it('handles negative cash flow', () => {
    const coc = calculateCashOnCash(-2400, 50000)
    expect(coc).toBe(-4.8)
  })
})

describe('calculateGRM', () => {
  it('calculates GRM correctly', () => {
    // $300,000 price / $36,000 annual rent = 8.33
    const grm = calculateGRM(300000, 36000)
    expect(grm).toBeCloseTo(8.33, 1)
  })

  it('returns 0 for zero rent', () => {
    const grm = calculateGRM(300000, 0)
    expect(grm).toBe(0)
  })

  it('lower GRM indicates better cash flow potential', () => {
    const grmGood = calculateGRM(200000, 30000) // ~6.67
    const grmBad = calculateGRM(200000, 18000) // ~11.11
    expect(grmGood).toBeLessThan(grmBad)
  })
})

describe('calculateDSCR', () => {
  it('calculates DSCR correctly', () => {
    // $24,000 NOI / $18,000 debt service = 1.33
    const dscr = calculateDSCR(24000, 18000)
    expect(dscr).toBeCloseTo(1.33, 1)
  })

  it('returns Infinity for positive NOI with zero debt service', () => {
    const dscr = calculateDSCR(24000, 0)
    expect(dscr).toBe(Infinity)
  })

  it('returns 0 for zero NOI with zero debt service', () => {
    const dscr = calculateDSCR(0, 0)
    expect(dscr).toBe(0)
  })

  it('DSCR < 1 indicates insufficient NOI to cover debt', () => {
    const dscr = calculateDSCR(15000, 18000)
    expect(dscr).toBeLessThan(1)
  })
})

describe('calculateTotalROI', () => {
  it('calculates total ROI correctly', () => {
    // $75,000 returns / $50,000 investment = 150%
    const roi = calculateTotalROI(75000, 50000)
    expect(roi).toBe(150)
  })

  it('returns Infinity for positive returns with zero investment', () => {
    const roi = calculateTotalROI(10000, 0)
    expect(roi).toBe(Infinity)
  })

  it('handles negative returns', () => {
    const roi = calculateTotalROI(-10000, 50000)
    expect(roi).toBe(-20)
  })
})

describe('calculateAnnualizedROI', () => {
  it('calculates annualized ROI correctly', () => {
    // 100% total ROI over 5 years
    const annualized = calculateAnnualizedROI(100, 5)
    // (1 + 1)^(1/5) - 1 ≈ 14.87%
    expect(annualized).toBeCloseTo(14.87, 0)
  })

  it('returns 0 for zero years', () => {
    const annualized = calculateAnnualizedROI(100, 0)
    expect(annualized).toBe(0)
  })

  it('returns same value for 1 year', () => {
    const annualized = calculateAnnualizedROI(15, 1)
    expect(annualized).toBe(15)
  })
})

describe('calculateIRR', () => {
  it('calculates IRR for simple investment', () => {
    // -$100 investment, $110 return next year = 10% IRR
    const irr = calculateIRR([-100, 110])
    expect(irr).toBeCloseTo(10, 0)
  })

  it('calculates IRR for multi-year cash flows', () => {
    // -$1000 investment, $300/year for 5 years
    const irr = calculateIRR([-1000, 300, 300, 300, 300, 300])
    expect(irr).toBeCloseTo(15.24, 0)
  })

  it('returns 0 for insufficient cash flows', () => {
    const irr = calculateIRR([-100])
    expect(irr).toBe(0)
  })

  it('handles negative IRR', () => {
    // Investment that loses money
    const irr = calculateIRR([-1000, 200, 200, 200])
    expect(irr).toBeLessThan(0)
  })
})

describe('calculateReturns', () => {
  it('calculates all return metrics', () => {
    const result = calculateReturns({
      propertyValue: 300000,
      annualNOI: 24000,
      annualCashFlow: 8000,
      totalCashInvested: 60000,
      annualGrossRent: 36000,
      annualDebtService: 16000,
    })

    expect(result.capRate).toBe(8)
    expect(result.cashOnCashReturn).toBeCloseTo(13.33, 1)
    expect(result.grossRentMultiplier).toBeCloseTo(8.33, 1)
    expect(result.debtServiceCoverageRatio).toBe(1.5)
  })

  it('calculates total ROI with equity gain', () => {
    const result = calculateReturns({
      propertyValue: 300000,
      annualNOI: 24000,
      annualCashFlow: 8000,
      totalCashInvested: 60000,
      annualGrossRent: 36000,
      annualDebtService: 16000,
      totalEquityGain: 50000,
      years: 5,
    })

    // Total returns = (8000 * 5) + 50000 = 90000
    // Total ROI = 90000 / 60000 = 150%
    expect(result.totalROI).toBe(150)
  })
})

describe('checkOnePercentRule', () => {
  it('passes when rent >= 1% of price', () => {
    const result = checkOnePercentRule(200000, 2000)
    expect(result.passes).toBe(true)
    expect(result.ratio).toBe(1)
  })

  it('passes when rent > 1% of price', () => {
    const result = checkOnePercentRule(200000, 2500)
    expect(result.passes).toBe(true)
    expect(result.ratio).toBe(1.25)
  })

  it('fails when rent < 1% of price', () => {
    const result = checkOnePercentRule(200000, 1500)
    expect(result.passes).toBe(false)
    expect(result.ratio).toBe(0.75)
  })

  it('returns false for zero purchase price', () => {
    const result = checkOnePercentRule(0, 2000)
    expect(result.passes).toBe(false)
    expect(result.ratio).toBe(0)
  })
})

describe('estimate50PercentRule', () => {
  it('estimates expenses at 50% of rent', () => {
    const result = estimate50PercentRule(2000)
    expect(result.estimatedExpenses).toBe(1000)
    expect(result.estimatedNOI).toBe(1000)
    expect(result.estimatedAnnualNOI).toBe(12000)
  })

  it('handles zero rent', () => {
    const result = estimate50PercentRule(0)
    expect(result.estimatedExpenses).toBe(0)
    expect(result.estimatedNOI).toBe(0)
    expect(result.estimatedAnnualNOI).toBe(0)
  })
})

describe('calculate70PercentRule', () => {
  it('calculates max purchase price correctly', () => {
    // ARV $300,000, Repairs $50,000
    // Max = 300000 * 0.7 - 50000 = 160000
    const maxPrice = calculate70PercentRule(300000, 50000)
    expect(maxPrice).toBe(160000)
  })

  it('can result in negative value for high repair costs', () => {
    // ARV $200,000, Repairs $150,000
    // Max = 200000 * 0.7 - 150000 = -10000
    const maxPrice = calculate70PercentRule(200000, 150000)
    expect(maxPrice).toBe(-10000)
  })

  it('handles zero ARV', () => {
    const maxPrice = calculate70PercentRule(0, 50000)
    expect(maxPrice).toBe(-50000)
  })
})
