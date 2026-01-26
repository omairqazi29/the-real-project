/**
 * Formula definitions with documentation
 * Used for transparency system to explain calculations
 */

export interface FormulaDefinition {
  name: string
  formula: string
  description: string
  variables: Record<string, string>
  example?: string
}

export const FORMULAS: Record<string, FormulaDefinition> = {
  // ============================================================================
  // MORTGAGE FORMULAS
  // ============================================================================

  MONTHLY_PI: {
    name: 'Monthly Principal & Interest',
    formula: 'P × [r(1+r)^n] / [(1+r)^n - 1]',
    description: 'Standard amortization formula for calculating monthly mortgage payment',
    variables: {
      P: 'Loan principal (purchase price - down payment)',
      r: 'Monthly interest rate (annual rate / 12 / 100)',
      n: 'Total number of payments (loan term years × 12)',
    },
    example: '$200,000 loan at 7% for 30 years = $1,330.60/month',
  },

  LOAN_BALANCE: {
    name: 'Remaining Loan Balance',
    formula: 'P × [(1+r)^n - (1+r)^m] / [(1+r)^n - 1]',
    description: 'Calculate remaining balance at any point in the loan',
    variables: {
      P: 'Original loan principal',
      r: 'Monthly interest rate',
      n: 'Total number of payments',
      m: 'Payments made so far',
    },
  },

  // ============================================================================
  // CASH FLOW FORMULAS
  // ============================================================================

  MONTHLY_CASHFLOW: {
    name: 'Monthly Cash Flow',
    formula: 'Gross Rent - Vacancy - Operating Expenses - Debt Service',
    description: 'Net monthly income after all expenses and debt payments',
    variables: {
      'Gross Rent': 'Total monthly rental income',
      Vacancy: 'Vacancy allowance (typically 5-10% of rent)',
      'Operating Expenses': 'Maintenance + CapEx + Management + Insurance + Taxes + HOA + Utilities',
      'Debt Service': 'Monthly mortgage payment (P&I + PMI)',
    },
  },

  NET_OPERATING_INCOME: {
    name: 'Net Operating Income (NOI)',
    formula: 'Effective Gross Income - Operating Expenses',
    description: 'Income after operating costs but before debt service',
    variables: {
      'Effective Gross Income': 'Gross Rent - Vacancy',
      'Operating Expenses': 'All property expenses except mortgage',
    },
  },

  // ============================================================================
  // RETURNS FORMULAS
  // ============================================================================

  CAP_RATE: {
    name: 'Capitalization Rate',
    formula: '(Annual NOI / Property Value) × 100',
    description: 'Measures return independent of financing. Higher is better for cash flow.',
    variables: {
      'Annual NOI': 'Net Operating Income × 12',
      'Property Value': 'Current market value or purchase price',
    },
    example: '$12,000 NOI / $200,000 value = 6% cap rate',
  },

  COC_RETURN: {
    name: 'Cash-on-Cash Return',
    formula: '(Annual Cash Flow / Total Cash Invested) × 100',
    description: 'Annual return on actual cash invested. Shows real return on your money.',
    variables: {
      'Annual Cash Flow': 'Monthly cash flow × 12',
      'Total Cash Invested': 'Down payment + closing costs + rehab costs',
    },
    example: '$6,000 cash flow / $50,000 invested = 12% CoC return',
  },

  GRM: {
    name: 'Gross Rent Multiplier',
    formula: 'Property Price / Annual Gross Rent',
    description: 'Quick valuation metric. Lower is generally better.',
    variables: {
      'Property Price': 'Purchase price or current value',
      'Annual Gross Rent': 'Monthly rent × 12',
    },
    example: '$200,000 / $24,000 annual rent = 8.3 GRM',
  },

  DSCR: {
    name: 'Debt Service Coverage Ratio',
    formula: 'Annual NOI / Annual Debt Service',
    description: 'Lenders use this to determine loan qualification. Usually need 1.2+',
    variables: {
      'Annual NOI': 'Net Operating Income × 12',
      'Annual Debt Service': 'Monthly mortgage payment × 12',
    },
    example: '$18,000 NOI / $14,400 debt service = 1.25 DSCR',
  },

  TOTAL_ROI: {
    name: 'Total Return on Investment',
    formula: '[(Equity Gain + Cumulative Cash Flow) / Total Investment] × 100',
    description: 'Complete return including appreciation, principal paydown, and cash flow',
    variables: {
      'Equity Gain': 'Current equity - initial equity (appreciation + principal paydown)',
      'Cumulative Cash Flow': 'Sum of all cash flow received',
      'Total Investment': 'All cash invested in the property',
    },
  },

  IRR: {
    name: 'Internal Rate of Return',
    formula: 'NPV = 0 = Σ[CFt / (1+IRR)^t]',
    description: 'Annualized return accounting for timing of cash flows',
    variables: {
      CFt: 'Cash flow in period t',
      t: 'Time period',
      IRR: 'Rate that makes NPV equal to zero',
    },
  },

  // ============================================================================
  // BRRR FORMULAS
  // ============================================================================

  FORCED_EQUITY: {
    name: 'Forced Equity',
    formula: 'ARV - Purchase Price - Rehab Cost',
    description: 'Equity created through buying below market and adding value',
    variables: {
      ARV: 'After Repair Value',
      'Purchase Price': 'Original purchase price',
      'Rehab Cost': 'Total renovation costs',
    },
    example: '$300,000 ARV - $200,000 purchase - $40,000 rehab = $60,000 forced equity',
  },

  CASH_OUT_REFINANCE: {
    name: 'Cash Out Amount',
    formula: 'New Loan Amount - Original Loan Balance - Closing Costs',
    description: 'Net cash received from refinancing',
    variables: {
      'New Loan Amount': 'ARV × LTV%',
      'Original Loan Balance': 'Remaining balance on original loan',
      'Closing Costs': 'Refinance fees and costs',
    },
  },

  CASH_LEFT_IN_DEAL: {
    name: 'Cash Left in Deal',
    formula: 'Total Cash Invested - Net Cash Out',
    description: 'Amount of original investment still tied up in property',
    variables: {
      'Total Cash Invested': 'Down payment + closing costs + rehab + holding costs',
      'Net Cash Out': 'Cash received from refinance after costs',
    },
    example: '$60,000 invested - $55,000 cash out = $5,000 left in deal',
  },

  VELOCITY_OF_MONEY: {
    name: 'Velocity of Money',
    formula: 'Capital Recycled / Total Investment',
    description: 'How much of your capital you recovered to reinvest',
    variables: {
      'Capital Recycled': 'Cash pulled out through refinance',
      'Total Investment': 'Total cash invested before refinance',
    },
    example: '55,000 recycled / $60,000 invested = 91.7% velocity',
  },

  // ============================================================================
  // QUICK RULES
  // ============================================================================

  ONE_PERCENT_RULE: {
    name: '1% Rule',
    formula: 'Monthly Rent ≥ 1% × Purchase Price',
    description: 'Quick filter for cash flow potential. Meeting 1% suggests good cash flow.',
    variables: {
      'Monthly Rent': 'Expected monthly rental income',
      'Purchase Price': 'Property purchase price',
    },
    example: '$200,000 property should rent for $2,000+/month to meet 1% rule',
  },

  FIFTY_PERCENT_RULE: {
    name: '50% Rule',
    formula: 'Operating Expenses ≈ 50% × Gross Rent',
    description: 'Quick estimate that half of rent goes to expenses (excluding mortgage)',
    variables: {
      'Operating Expenses': 'All expenses except mortgage',
      'Gross Rent': 'Total monthly rental income',
    },
  },

  SEVENTY_PERCENT_RULE: {
    name: '70% Rule',
    formula: 'Max Purchase = (ARV × 70%) - Repair Costs',
    description: 'Maximum purchase price for BRRR/flip to ensure profit margin',
    variables: {
      ARV: 'After Repair Value',
      'Repair Costs': 'Estimated renovation costs',
    },
    example: 'ARV $300,000 × 70% - $40,000 repairs = $170,000 max purchase',
  },
}

/**
 * Get formula by key
 */
export function getFormula(key: string): FormulaDefinition | undefined {
  return FORMULAS[key]
}

/**
 * Get all formula keys by category
 */
export const FORMULA_CATEGORIES = {
  mortgage: ['MONTHLY_PI', 'LOAN_BALANCE'],
  cashflow: ['MONTHLY_CASHFLOW', 'NET_OPERATING_INCOME'],
  returns: ['CAP_RATE', 'COC_RETURN', 'GRM', 'DSCR', 'TOTAL_ROI', 'IRR'],
  brrr: ['FORCED_EQUITY', 'CASH_OUT_REFINANCE', 'CASH_LEFT_IN_DEAL', 'VELOCITY_OF_MONEY'],
  quickRules: ['ONE_PERCENT_RULE', 'FIFTY_PERCENT_RULE', 'SEVENTY_PERCENT_RULE'],
}
