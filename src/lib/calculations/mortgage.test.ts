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
    // Expected: ~$1,330.60
    expect(payment).toBeCloseTo(1330.60, 0)
  })

  it('calculates monthly payment correctly for 15-year mortgage', () => {
    // $200,000 loan at 6.5% for 15 years
    const payment = calculateMonthlyPI(200000, 6.5, 15)
    // Expected: ~$1,742.21
    expect(payment).toBeCloseTo(1742.21, 0)
  })

  it('returns 0 for zero principal', () => {
    const payment = calculateMonthlyPI(0, 7, 30)
    expect(payment).toBe(0)
  })

  it('returns 0 for negative principal', () => {
    const payment = calculateMonthlyPI(-100000, 7, 30)
    expect(payment).toBe(0)
  })

  it('handles 0% interest rate', () => {
    // $120,000 at 0% for 30 years = $333.33/month
    const payment = calculateMonthlyPI(120000, 0, 30)
    expect(payment).toBeCloseTo(333.33, 0)
  })

  it('handles high interest rates', () => {
    // $100,000 at 12% for 30 years
    const payment = calculateMonthlyPI(100000, 12, 30)
    expect(payment).toBeCloseTo(1028.61, 0)
  })
})

describe('calculateMortgage', () => {
  it('calculates full mortgage details correctly', () => {
    const result = calculateMortgage(250000, 20, 7, 30, 0)

    expect(result.downPayment).toBe(50000)
    expect(result.loanAmount).toBe(200000)
    expect(result.monthlyPI).toBeCloseTo(1330.60, 0)
    expect(result.monthlyPMI).toBe(0)
    expect(result.totalMonthlyPayment).toBeCloseTo(1330.60, 0)
  })

  it('includes PMI in total monthly payment', () => {
    const result = calculateMortgage(250000, 10, 7, 30, 150)

    expect(result.downPayment).toBe(25000)
    expect(result.loanAmount).toBe(225000)
    expect(result.monthlyPMI).toBe(150)
    expect(result.totalMonthlyPayment).toBe(result.monthlyPI + 150)
  })

  it('uses fixed down payment when provided', () => {
    const result = calculateMortgage(250000, 20, 7, 30, 0, 75000)

    expect(result.downPayment).toBe(75000)
    expect(result.loanAmount).toBe(175000)
  })

  it('calculates total interest correctly', () => {
    const result = calculateMortgage(200000, 20, 7, 30, 0)
    // Total cost = (monthly payment * 360) + down payment
    // Total interest = Total cost - down payment - loan amount
    const expectedTotalPayments = result.totalMonthlyPayment * 360
    const expectedTotalCost = expectedTotalPayments + result.downPayment
    const expectedTotalInterest = expectedTotalCost - result.downPayment - result.loanAmount

    expect(result.totalInterest).toBeCloseTo(expectedTotalInterest, 0)
  })
})

describe('generateAmortizationSchedule', () => {
  it('generates correct number of entries', () => {
    const schedule = generateAmortizationSchedule(200000, 7, 30)
    expect(schedule.length).toBe(360) // 30 years * 12 months
  })

  it('returns empty array for zero principal', () => {
    const schedule = generateAmortizationSchedule(0, 7, 30)
    expect(schedule.length).toBe(0)
  })

  it('first payment has more interest than principal', () => {
    const schedule = generateAmortizationSchedule(200000, 7, 30)
    const firstPayment = schedule[0]

    expect(firstPayment.month).toBe(1)
    expect(firstPayment.year).toBe(1)
    expect(firstPayment.interest).toBeGreaterThan(firstPayment.principal)
  })

  it('last payment has more principal than interest', () => {
    const schedule = generateAmortizationSchedule(200000, 7, 30)
    const lastPayment = schedule[schedule.length - 1]

    expect(lastPayment.month).toBe(360)
    expect(lastPayment.year).toBe(30)
    expect(lastPayment.principal).toBeGreaterThan(lastPayment.interest)
    expect(lastPayment.balance).toBeLessThan(10) // Small rounding error acceptable over 360 payments
  })

  it('balance decreases over time', () => {
    const schedule = generateAmortizationSchedule(200000, 7, 30)

    for (let i = 1; i < schedule.length; i++) {
      expect(schedule[i].balance).toBeLessThan(schedule[i - 1].balance)
    }
  })

  it('total principal paid equals loan amount', () => {
    const schedule = generateAmortizationSchedule(200000, 7, 30)
    const lastPayment = schedule[schedule.length - 1]

    // Allow small rounding error over 360 payments
    expect(lastPayment.totalPrincipalPaid).toBeGreaterThan(199990)
    expect(lastPayment.totalPrincipalPaid).toBeLessThan(200010)
  })
})

describe('getLoanBalanceAtMonth', () => {
  it('returns principal for month 0', () => {
    const balance = getLoanBalanceAtMonth(200000, 7, 30, 0)
    expect(balance).toBe(200000)
  })

  it('returns 0 for month at or after term', () => {
    const balance = getLoanBalanceAtMonth(200000, 7, 30, 360)
    expect(balance).toBe(0)

    const balanceAfter = getLoanBalanceAtMonth(200000, 7, 30, 400)
    expect(balanceAfter).toBe(0)
  })

  it('calculates mid-term balance correctly', () => {
    const balance = getLoanBalanceAtMonth(200000, 7, 30, 180) // 15 years in
    // After 15 years of a 30-year mortgage, balance should be ~68% of original
    expect(balance).toBeGreaterThan(130000)
    expect(balance).toBeLessThan(150000)
  })

  it('matches amortization schedule', () => {
    const schedule = generateAmortizationSchedule(200000, 7, 30)
    const balanceAt12 = getLoanBalanceAtMonth(200000, 7, 30, 12)

    expect(balanceAt12).toBeCloseTo(schedule[11].balance, 0)
  })
})

describe('getPrincipalPaidInYear', () => {
  it('calculates first year principal correctly', () => {
    const principalYear1 = getPrincipalPaidInYear(200000, 7, 30, 1)
    // First year principal is relatively small
    expect(principalYear1).toBeGreaterThan(2000)
    expect(principalYear1).toBeLessThan(5000)
  })

  it('principal paid increases each year', () => {
    const principalYear1 = getPrincipalPaidInYear(200000, 7, 30, 1)
    const principalYear10 = getPrincipalPaidInYear(200000, 7, 30, 10)
    const principalYear20 = getPrincipalPaidInYear(200000, 7, 30, 20)

    expect(principalYear10).toBeGreaterThan(principalYear1)
    expect(principalYear20).toBeGreaterThan(principalYear10)
  })

  it('sums to total principal over loan term', () => {
    let totalPrincipal = 0
    for (let year = 1; year <= 30; year++) {
      totalPrincipal += getPrincipalPaidInYear(200000, 7, 30, year)
    }

    expect(totalPrincipal).toBeCloseTo(200000, 0)
  })
})
