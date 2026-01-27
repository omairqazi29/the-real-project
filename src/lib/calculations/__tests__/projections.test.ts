import { describe, it, expect } from 'vitest'
import { generateProjections, generateScenarios, type ProjectionInputs } from '../projections'

const defaultInputs: ProjectionInputs = {
  purchasePrice: 200000,
  arv: 300000,
  loanAmount: 150000,
  interestRate: 7,
  loanTermYears: 30,
  totalCashInvested: 97500,
  rehabBudget: 40000,
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
  pmiMonthly: 0,
  appreciationRate: 3,
  rentGrowthRate: 2,
  expenseGrowthRate: 2,
}

describe('generateProjections', () => {
  it('generates 10 years of projections by default', () => {
    const projections = generateProjections(defaultInputs)
    expect(projections).toHaveLength(10)
  })

  it('generates custom number of years', () => {
    const projections = generateProjections(defaultInputs, 5)
    expect(projections).toHaveLength(5)
  })

  it('year numbers are sequential', () => {
    const projections = generateProjections(defaultInputs)
    projections.forEach((p, i) => {
      expect(p.year).toBe(i + 1)
    })
  })

  it('property value increases with appreciation', () => {
    const projections = generateProjections(defaultInputs)
    for (let i = 1; i < projections.length; i++) {
      expect(projections[i].propertyValue).toBeGreaterThan(projections[i - 1].propertyValue)
    }
  })

  it('loan balance decreases over time', () => {
    const projections = generateProjections(defaultInputs)
    for (let i = 1; i < projections.length; i++) {
      expect(projections[i].loanBalance).toBeLessThan(projections[i - 1].loanBalance)
    }
  })

  it('total equity increases over time', () => {
    const projections = generateProjections(defaultInputs)
    for (let i = 1; i < projections.length; i++) {
      expect(projections[i].equityTotal).toBeGreaterThan(projections[i - 1].equityTotal)
    }
  })

  it('forced equity remains constant', () => {
    const projections = generateProjections(defaultInputs)
    const forcedEquity = projections[0].equityForced
    projections.forEach((p) => {
      expect(p.equityForced).toBe(forcedEquity)
    })
  })

  it('cumulative cash flow increases each year', () => {
    const projections = generateProjections(defaultInputs)
    for (let i = 1; i < projections.length; i++) {
      expect(projections[i].cumulativeCashFlow).toBeGreaterThan(projections[i - 1].cumulativeCashFlow)
    }
  })

  it('monthly rent grows over time', () => {
    const projections = generateProjections(defaultInputs)
    for (let i = 1; i < projections.length; i++) {
      expect(projections[i].monthlyRent).toBeGreaterThan(projections[i - 1].monthlyRent)
    }
  })

  it('equity components sum to total', () => {
    const projections = generateProjections(defaultInputs)
    projections.forEach((p) => {
      const sum = p.equityForced + p.equityAppreciation + p.equityPrincipal
      expect(p.equityTotal).toBeCloseTo(sum, 0)
    })
  })
})

describe('generateScenarios', () => {
  it('generates 3 scenarios', () => {
    const scenarios = generateScenarios(defaultInputs)
    expect(scenarios).toHaveLength(3)
  })

  it('scenarios are named correctly', () => {
    const scenarios = generateScenarios(defaultInputs)
    expect(scenarios[0].name).toBe('Conservative')
    expect(scenarios[1].name).toBe('Base')
    expect(scenarios[2].name).toBe('Optimistic')
  })

  it('optimistic scenario has higher equity than conservative', () => {
    const scenarios = generateScenarios(defaultInputs)
    const conservative = scenarios[0]
    const optimistic = scenarios[2]
    expect(optimistic.summary.totalEquity10yr).toBeGreaterThan(
      conservative.summary.totalEquity10yr
    )
  })

  it('optimistic scenario has higher cash flow than conservative', () => {
    const scenarios = generateScenarios(defaultInputs)
    const conservative = scenarios[0]
    const optimistic = scenarios[2]
    expect(optimistic.summary.totalCashFlow10yr).toBeGreaterThan(
      conservative.summary.totalCashFlow10yr
    )
  })

  it('each scenario includes summary metrics', () => {
    const scenarios = generateScenarios(defaultInputs)
    scenarios.forEach((s) => {
      expect(s.summary).toHaveProperty('totalCashFlow10yr')
      expect(s.summary).toHaveProperty('totalEquity10yr')
      expect(s.summary).toHaveProperty('totalROI10yr')
      expect(s.summary).toHaveProperty('averageCoCReturn')
      expect(s.summary).toHaveProperty('irr')
    })
  })

  it('each scenario has 10 years of projections', () => {
    const scenarios = generateScenarios(defaultInputs)
    scenarios.forEach((s) => {
      expect(s.projections).toHaveLength(10)
    })
  })
})
