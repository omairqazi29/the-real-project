import { describe, it, expect } from 'vitest'
import {
  calculateCapRate,
  calculateCashOnCash,
  calculateGRM,
  calculateDSCR,
  calculateTotalROI,
  calculateAnnualizedROI,
  calculateIRR,
  checkOnePercentRule,
  estimate50PercentRule,
  calculate70PercentRule,
} from '../returns'

describe('calculateCapRate', () => {
  it('calculates cap rate correctly', () => {
    expect(calculateCapRate(15000, 200000)).toBe(7.5)
  })

  it('returns 0 for zero property value', () => {
    expect(calculateCapRate(15000, 0)).toBe(0)
  })
})

describe('calculateCashOnCash', () => {
  it('calculates CoC return correctly', () => {
    expect(calculateCashOnCash(5000, 50000)).toBe(10)
  })

  it('returns Infinity for zero investment with positive cash flow', () => {
    expect(calculateCashOnCash(5000, 0)).toBe(Infinity)
  })

  it('returns 0 for zero investment and zero cash flow', () => {
    expect(calculateCashOnCash(0, 0)).toBe(0)
  })
})

describe('calculateGRM', () => {
  it('calculates GRM correctly', () => {
    expect(calculateGRM(200000, 24000)).toBeCloseTo(8.33, 1)
  })

  it('returns 0 for zero rent', () => {
    expect(calculateGRM(200000, 0)).toBe(0)
  })
})

describe('calculateDSCR', () => {
  it('calculates DSCR correctly', () => {
    expect(calculateDSCR(18000, 15000)).toBe(1.2)
  })

  it('returns Infinity for zero debt service with positive NOI', () => {
    expect(calculateDSCR(18000, 0)).toBe(Infinity)
  })
})

describe('calculateTotalROI', () => {
  it('calculates ROI correctly', () => {
    expect(calculateTotalROI(25000, 50000)).toBe(50)
  })

  it('handles negative returns', () => {
    expect(calculateTotalROI(-10000, 50000)).toBe(-20)
  })
})

describe('calculateAnnualizedROI', () => {
  it('annualizes ROI correctly', () => {
    // 100% ROI over 5 years => ~14.87% annualized
    const result = calculateAnnualizedROI(100, 5)
    expect(result).toBeCloseTo(14.87, 0)
  })

  it('returns 0 for zero years', () => {
    expect(calculateAnnualizedROI(100, 0)).toBe(0)
  })
})

describe('calculateIRR', () => {
  it('calculates IRR for simple cash flows', () => {
    // Invest $100k, get $30k/year for 5 years
    const cashFlows = [-100000, 30000, 30000, 30000, 30000, 30000]
    const irr = calculateIRR(cashFlows)
    expect(irr).toBeCloseTo(15.24, 0)
  })

  it('returns 0 for insufficient cash flows', () => {
    expect(calculateIRR([100])).toBe(0)
  })

  it('handles negative IRR', () => {
    const cashFlows = [-100000, 10000, 10000, 10000]
    const irr = calculateIRR(cashFlows)
    expect(irr).toBeLessThan(0)
  })
})

describe('checkOnePercentRule', () => {
  it('passes when rent is 1%+ of price', () => {
    const result = checkOnePercentRule(200000, 2000)
    expect(result.passes).toBe(true)
    expect(result.ratio).toBe(1)
  })

  it('fails when rent is below 1%', () => {
    const result = checkOnePercentRule(200000, 1500)
    expect(result.passes).toBe(false)
    expect(result.ratio).toBe(0.75)
  })

  it('returns false for zero purchase price', () => {
    const result = checkOnePercentRule(0, 1500)
    expect(result.passes).toBe(false)
  })
})

describe('estimate50PercentRule', () => {
  it('estimates expenses at 50% of rent', () => {
    const result = estimate50PercentRule(2000)
    expect(result.estimatedExpenses).toBe(1000)
    expect(result.estimatedNOI).toBe(1000)
    expect(result.estimatedAnnualNOI).toBe(12000)
  })
})

describe('calculate70PercentRule', () => {
  it('calculates max purchase price correctly', () => {
    // ARV $300k, rehab $50k => $300k * 0.7 - $50k = $160k
    expect(calculate70PercentRule(300000, 50000)).toBe(160000)
  })
})
