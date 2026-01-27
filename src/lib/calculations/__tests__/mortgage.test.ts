import { describe, it, expect } from 'vitest'
import {
  calculateMonthlyPI,
  calculateMortgage,
  generateAmortizationSchedule,
  getLoanBalanceAtMonth,
  getPrincipalPaidInYear,
} from '../mortgage'

describe('calculateMonthlyPI', () => {
  it('returns correct monthly payment for standard 30-year mortgage', () => {
    // $200k loan at 7% for 30 years => ~$1,330.60/mo
    const payment = calculateMonthlyPI(200000, 7, 30)
    expect(payment).toBeCloseTo(1330.60, 0)
  })

  it('returns 0 for zero principal', () => {
    expect(calculateMonthlyPI(0, 7, 30)).toBe(0)
  })

  it('returns 0 for negative principal', () => {
    expect(calculateMonthlyPI(-100000, 7, 30)).toBe(0)
  })

  it('handles 0% interest rate', () => {
    const payment = calculateMonthlyPI(120000, 0, 30)
    expect(payment).toBeCloseTo(333.33, 0)
  })

  it('returns correct payment for 15-year mortgage', () => {
    const payment = calculateMonthlyPI(200000, 7, 15)
    expect(payment).toBeCloseTo(1797.66, 0)
  })
})

describe('calculateMortgage', () => {
  it('returns correct mortgage details with percentage down payment', () => {
    const result = calculateMortgage(250000, 25, 7, 30)
    expect(result.downPayment).toBe(62500)
    expect(result.loanAmount).toBe(187500)
    expect(result.monthlyPI).toBeGreaterThan(0)
    expect(result.totalMonthlyPayment).toBe(result.monthlyPI + result.monthlyPMI)
  })

  it('uses fixed down payment when provided', () => {
    const result = calculateMortgage(250000, 25, 7, 30, 0, 50000)
    expect(result.downPayment).toBe(50000)
    expect(result.loanAmount).toBe(200000)
  })

  it('includes PMI in total monthly payment', () => {
    const result = calculateMortgage(250000, 25, 7, 30, 100)
    expect(result.totalMonthlyPayment).toBe(result.monthlyPI + 100)
  })

  it('calculates total cost correctly', () => {
    const result = calculateMortgage(200000, 20, 7, 30)
    const expectedTotalPayments = result.totalMonthlyPayment * 360
    expect(result.totalCost).toBeCloseTo(expectedTotalPayments + result.downPayment, 0)
  })
})

describe('generateAmortizationSchedule', () => {
  it('returns empty array for zero principal', () => {
    expect(generateAmortizationSchedule(0, 7, 30)).toEqual([])
  })

  it('generates correct number of entries', () => {
    const schedule = generateAmortizationSchedule(200000, 7, 30)
    expect(schedule).toHaveLength(360)
  })

  it('ends with zero balance', () => {
    const schedule = generateAmortizationSchedule(200000, 7, 30)
    const lastEntry = schedule[schedule.length - 1]
    expect(lastEntry.balance).toBeLessThan(10) // rounding may leave a tiny residual
  })

  it('has increasing principal and decreasing interest over time', () => {
    const schedule = generateAmortizationSchedule(200000, 7, 30)
    expect(schedule[0].interest).toBeGreaterThan(schedule[0].principal)
    const last = schedule[schedule.length - 1]
    expect(last.principal).toBeGreaterThan(last.interest)
  })

  it('correctly tracks year field', () => {
    const schedule = generateAmortizationSchedule(200000, 7, 30)
    expect(schedule[0].year).toBe(1)
    expect(schedule[11].year).toBe(1)
    expect(schedule[12].year).toBe(2)
  })
})

describe('getLoanBalanceAtMonth', () => {
  it('returns principal at month 0', () => {
    expect(getLoanBalanceAtMonth(200000, 7, 30, 0)).toBe(200000)
  })

  it('returns 0 at end of term', () => {
    expect(getLoanBalanceAtMonth(200000, 7, 30, 360)).toBe(0)
  })

  it('returns 0 for months beyond term', () => {
    expect(getLoanBalanceAtMonth(200000, 7, 30, 400)).toBe(0)
  })

  it('returns decreasing balance over time', () => {
    const balance12 = getLoanBalanceAtMonth(200000, 7, 30, 12)
    const balance60 = getLoanBalanceAtMonth(200000, 7, 30, 60)
    const balance120 = getLoanBalanceAtMonth(200000, 7, 30, 120)
    expect(balance12).toBeGreaterThan(balance60)
    expect(balance60).toBeGreaterThan(balance120)
  })
})

describe('getPrincipalPaidInYear', () => {
  it('returns positive principal paid in year 1', () => {
    const principal = getPrincipalPaidInYear(200000, 7, 30, 1)
    expect(principal).toBeGreaterThan(0)
  })

  it('pays more principal in later years', () => {
    const year1 = getPrincipalPaidInYear(200000, 7, 30, 1)
    const year10 = getPrincipalPaidInYear(200000, 7, 30, 10)
    const year20 = getPrincipalPaidInYear(200000, 7, 30, 20)
    expect(year10).toBeGreaterThan(year1)
    expect(year20).toBeGreaterThan(year10)
  })
})
