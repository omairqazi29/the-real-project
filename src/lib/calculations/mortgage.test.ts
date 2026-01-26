import { describe, it, expect } from 'vitest'
import {
  calculateMonthlyPI,
  calculateMortgage,
  generateAmortizationSchedule,
  getLoanBalanceAtMonth,
  getPrincipalPaidInYear,
} from './mortgage'

describe('calculateMonthlyPI', () => {
  it('calculates monthly payment correctly for standard 30-year mortgage', () => {
    // $200,000 loan at 7% for 30 years
    const payment = calculateMonthlyPI(200000, 7, 30)
    expect(payment).toBeCloseTo(1330.60, 0)
  })

  it('calculates monthly payment for 15-year mortgage', () => {
    // $200,000 loan at 6.5% for 15 years
    const payment = calculateMonthlyPI(200000, 6.5, 15)
    expect(payment).toBeCloseTo(1742.21, 0)
  })

  it('returns 0 for zero principal', () => {
    expect(calculateMonthlyPI(0, 7, 30)).toBe(0)
  })

  it('returns 0 for negative principal', () => {
    expect(calculateMonthlyPI(-100000, 7, 30)).toBe(0)
  })

  it('handles zero interest rate (interest-free loan)', () => {
    // $120,000 loan at 0% for 10 years = $1,000/month
    const payment = calculateMonthlyPI(120000, 0, 10)
    expect(payment).toBe(1000)
  })

  it('handles high interest rates', () => {
    // $100,000 at 15% for 30 years
    const payment = calculateMonthlyPI(100000, 15, 30)
    expect(payment).toBeCloseTo(1264.44, 0)
  })
})

describe('calculateMortgage', () => {
  it('calculates full mortgage details correctly', () => {
    const result = calculateMortgage(250000, 20, 7, 30)

    expect(result.downPayment).toBe(50000)
    expect(result.loanAmount).toBe(200000)
    expect(result.monthlyPI).toBeCloseTo(1330.60, 0)
    expect(result.totalMonthlyPayment).toBeCloseTo(1330.60, 0)
  })

  it('includes PMI in total monthly payment', () => {
    const result = calculateMortgage(250000, 10, 7, 30, 150)

    expect(result.monthlyPMI).toBe(150)
    expect(result.totalMonthlyPayment).toBeCloseTo(result.monthlyPI + 150, 0)
  })

  it('uses fixed down payment when provided', () => {
    const result = calculateMortgage(300000, 20, 7, 30, 0, 75000)

    expect(result.downPayment).toBe(75000)
    expect(result.loanAmount).toBe(225000)
  })

  it('calculates total interest correctly', () => {
    const result = calculateMortgage(200000, 25, 7, 30)

    // Total paid - down payment - loan amount = total interest
    const expectedTotalPaid = result.totalMonthlyPayment * 360 + result.downPayment
    expect(result.totalCost).toBeCloseTo(expectedTotalPaid, 0)
  })
})

describe('generateAmortizationSchedule', () => {
  it('generates correct number of entries', () => {
    const schedule = generateAmortizationSchedule(200000, 7, 30)
    expect(schedule).toHaveLength(360) // 30 years * 12 months
  })

  it('returns empty array for zero principal', () => {
    const schedule = generateAmortizationSchedule(0, 7, 30)
    expect(schedule).toHaveLength(0)
  })

  it('has final balance of zero (or near zero)', () => {
    const schedule = generateAmortizationSchedule(200000, 7, 30)
    const lastEntry = schedule[schedule.length - 1]
    // Allow for small rounding errors over 360 payments
    expect(lastEntry.balance).toBeLessThan(10)
  })

  it('tracks cumulative totals correctly', () => {
    const schedule = generateAmortizationSchedule(200000, 7, 30)
    const lastEntry = schedule[schedule.length - 1]

    // Total principal paid should equal original loan amount (within $10 due to rounding)
    expect(lastEntry.totalPrincipalPaid).toBeGreaterThan(199990)
    expect(lastEntry.totalPrincipalPaid).toBeLessThanOrEqual(200000)
  })

  it('assigns correct year values', () => {
    const schedule = generateAmortizationSchedule(100000, 6, 15)

    expect(schedule[0].year).toBe(1)
    expect(schedule[11].year).toBe(1)
    expect(schedule[12].year).toBe(2)
    expect(schedule[179].year).toBe(15)
  })
})

describe('getLoanBalanceAtMonth', () => {
  it('returns principal for month 0 or negative', () => {
    expect(getLoanBalanceAtMonth(200000, 7, 30, 0)).toBe(200000)
    expect(getLoanBalanceAtMonth(200000, 7, 30, -5)).toBe(200000)
  })

  it('returns 0 at end of loan term', () => {
    expect(getLoanBalanceAtMonth(200000, 7, 30, 360)).toBe(0)
    expect(getLoanBalanceAtMonth(200000, 7, 30, 400)).toBe(0)
  })

  it('returns correct balance mid-term', () => {
    // After 5 years (60 months) on a $200k loan at 7%, balance should be around $188k
    const balance = getLoanBalanceAtMonth(200000, 7, 30, 60)
    expect(balance).toBeGreaterThan(185000)
    expect(balance).toBeLessThan(195000)
  })

  it('matches amortization schedule', () => {
    const schedule = generateAmortizationSchedule(200000, 7, 30)
    const month60Balance = getLoanBalanceAtMonth(200000, 7, 30, 60)

    expect(month60Balance).toBeCloseTo(schedule[59].balance, 0)
  })
})

describe('getPrincipalPaidInYear', () => {
  it('calculates principal paid in first year', () => {
    const principal = getPrincipalPaidInYear(200000, 7, 30, 1)

    // First year principal paydown on $200k at 7% is around $2,100
    expect(principal).toBeGreaterThan(2000)
    expect(principal).toBeLessThan(3000)
  })

  it('shows increasing principal paydown over time', () => {
    const year1 = getPrincipalPaidInYear(200000, 7, 30, 1)
    const year10 = getPrincipalPaidInYear(200000, 7, 30, 10)
    const year20 = getPrincipalPaidInYear(200000, 7, 30, 20)

    expect(year10).toBeGreaterThan(year1)
    expect(year20).toBeGreaterThan(year10)
  })

  it('returns larger principal for shorter term loans', () => {
    const year1_30yr = getPrincipalPaidInYear(200000, 7, 30, 1)
    const year1_15yr = getPrincipalPaidInYear(200000, 7, 15, 1)

    expect(year1_15yr).toBeGreaterThan(year1_30yr)
  })
})
