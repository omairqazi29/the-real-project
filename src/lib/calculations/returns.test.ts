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
} from './returns'

describe('calculateCapRate', () => {
  it('calculates cap rate correctly', () => {
    // $12,000 NOI on $200,000 property = 6%
    expect(calculateCapRate(12000, 200000)).toBe(6)
  })

  it('returns 0 for zero property value', () => {
    expect(calculateCapRate(12000, 0)).toBe(0)
  })

  it('returns 0 for negative property value', () => {
    expect(calculateCapRate(12000, -100000)).toBe(0)
  })

  it('handles high cap rate markets', () => {
    // $24,000 NOI on $200,000 property = 12%
    expect(calculateCapRate(24000, 200000)).toBe(12)
  })
})

describe('calculateCashOnCash', () => {
  it('calculates cash-on-cash return correctly', () => {
    // $5,000 annual cash flow on $50,000 invested = 10%
    expect(calculateCashOnCash(5000, 50000)).toBe(10)
  })

  it('returns Infinity for positive cash flow with zero investment', () => {
    expect(calculateCashOnCash(5000, 0)).toBe(Infinity)
  })

  it('returns 0 for zero cash flow with zero investment', () => {
    expect(calculateCashOnCash(0, 0)).toBe(0)
  })

  it('handles negative cash flow', () => {
    expect(calculateCashOnCash(-2000, 50000)).toBe(-4)
  })
})

describe('calculateGRM', () => {
  it('calculates gross rent multiplier correctly', () => {
    // $200,000 property / $24,000 annual rent = 8.33
    expect(calculateGRM(200000, 24000)).toBeCloseTo(8.33, 1)
  })

  it('returns 0 for zero rent', () => {
    expect(calculateGRM(200000, 0)).toBe(0)
  })

  it('handles expensive markets (high GRM)', () => {
    // $500,000 property / $30,000 annual rent = 16.67
    expect(calculateGRM(500000, 30000)).toBeCloseTo(16.67, 1)
  })
})

describe('calculateDSCR', () => {
  it('calculates DSCR correctly', () => {
    // $15,000 NOI / $12,000 debt service = 1.25
    expect(calculateDSCR(15000, 12000)).toBe(1.25)
  })

  it('returns Infinity for positive NOI with zero debt service', () => {
    expect(calculateDSCR(15000, 0)).toBe(Infinity)
  })

  it('returns 0 for zero NOI with zero debt service', () => {
    expect(calculateDSCR(0, 0)).toBe(0)
  })

  it('handles DSCR below 1 (negative cash flow)', () => {
    expect(calculateDSCR(10000, 12000)).toBeCloseTo(0.83, 1)
  })
})

describe('calculateTotalROI', () => {
  it('calculates total ROI correctly', () => {
    // $25,000 returns on $50,000 investment = 50%
    expect(calculateTotalROI(25000, 50000)).toBe(50)
  })

  it('returns Infinity for positive returns with zero investment', () => {
    expect(calculateTotalROI(10000, 0)).toBe(Infinity)
  })

  it('handles negative returns', () => {
    expect(calculateTotalROI(-5000, 50000)).toBe(-10)
  })
})

describe('calculateAnnualizedROI', () => {
  it('calculates annualized ROI correctly', () => {
    // 100% total ROI over 5 years ≈ 14.87% annualized
    const result = calculateAnnualizedROI(100, 5)
    expect(result).toBeCloseTo(14.87, 0)
  })

  it('returns 0 for zero years', () => {
    expect(calculateAnnualizedROI(100, 0)).toBe(0)
  })

  it('returns same value for 1 year', () => {
    expect(calculateAnnualizedROI(25, 1)).toBe(25)
  })

  it('handles high growth scenarios', () => {
    // 200% over 3 years
    const result = calculateAnnualizedROI(200, 3)
    expect(result).toBeGreaterThan(40)
  })
})

describe('calculateIRR', () => {
  it('calculates IRR for simple cash flows', () => {
    // -$100 initial, then $110 after 1 year = 10% IRR
    const irr = calculateIRR([-100, 110])
    expect(irr).toBeCloseTo(10, 0)
  })

  it('handles multi-year cash flows', () => {
    // -$1000 initial, then $400/year for 3 years
    const irr = calculateIRR([-1000, 400, 400, 400])
    expect(irr).toBeGreaterThan(9)
    expect(irr).toBeLessThan(11)
  })

  it('returns 0 for single cash flow', () => {
    expect(calculateIRR([-100])).toBe(0)
  })

  it('returns 0 for empty array', () => {
    expect(calculateIRR([])).toBe(0)
  })

  it('handles BRRR-style cash flows (large positive at refi)', () => {
    // -$50k initial, then get all money back plus profit at refi
    const irr = calculateIRR([-50000, 5000, 65000])
    expect(irr).toBeGreaterThan(15)
  })
})

describe('checkOnePercentRule', () => {
  it('passes when rent >= 1% of price', () => {
    const result = checkOnePercentRule(200000, 2000)
    expect(result.passes).toBe(true)
    expect(result.ratio).toBe(1)
  })

  it('fails when rent < 1% of price', () => {
    const result = checkOnePercentRule(200000, 1500)
    expect(result.passes).toBe(false)
    expect(result.ratio).toBe(0.75)
  })

  it('handles properties exceeding 1% rule', () => {
    const result = checkOnePercentRule(100000, 1500)
    expect(result.passes).toBe(true)
    expect(result.ratio).toBe(1.5)
  })

  it('returns false for zero purchase price', () => {
    const result = checkOnePercentRule(0, 1500)
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
  })
})

describe('calculate70PercentRule', () => {
  it('calculates max purchase price correctly', () => {
    // ARV $300k * 70% - $50k repairs = $160k max offer
    const maxOffer = calculate70PercentRule(300000, 50000)
    expect(maxOffer).toBe(160000)
  })

  it('handles high rehab costs', () => {
    // ARV $200k * 70% - $80k repairs = $60k max offer
    const maxOffer = calculate70PercentRule(200000, 80000)
    expect(maxOffer).toBe(60000)
  })

  it('can result in negative max offer for over-priced rehabs', () => {
    // ARV $100k * 70% - $80k repairs = -$10k (don't buy!)
    const maxOffer = calculate70PercentRule(100000, 80000)
    expect(maxOffer).toBe(-10000)
  })

  it('handles zero rehab (turnkey)', () => {
    const maxOffer = calculate70PercentRule(300000, 0)
    expect(maxOffer).toBe(210000)
  })
})
