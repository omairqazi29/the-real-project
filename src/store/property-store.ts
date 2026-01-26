import { create } from 'zustand'
import type { Property } from '@/types/property'
import { DEFAULT_ASSUMPTIONS, type FinancingType, type PropertyType, type PropertyStatus } from '@/lib/constants'
import { DEFAULT_REHAB_BUDGET, type RehabBudget } from '@/types/property'

interface PropertyFormState {
  // Basic Info
  name: string
  address: string
  city: string
  state: string
  zip: string
  county: string
  property_type: PropertyType
  beds: number | null
  baths: number | null
  sqft: number | null
  lot_sqft: number | null
  year_built: number | null
  notes: string
  status: PropertyStatus

  // Buy Phase
  purchase_price: number
  closing_cost_percent: number
  closing_cost_fixed: number
  earnest_money: number
  financing_type: FinancingType
  down_payment_percent: number
  down_payment_amount: number | null
  interest_rate: number
  loan_term_years: number
  points: number
  pmi_monthly: number

  // Rehab Phase
  rehab_budget_total: number
  rehab_budget_itemized: RehabBudget
  rehab_timeline_months: number
  holding_costs_monthly: number

  // Rent Phase
  monthly_rent: number | null
  vacancy_percent: number
  maintenance_percent: number
  capex_percent: number
  management_percent: number
  insurance_monthly: number
  property_tax_annual: number | null
  property_tax_rate: number | null
  hoa_monthly: number
  utilities_monthly: number
  other_expenses_monthly: number

  // Refinance Phase
  arv: number | null
  refi_ltv_percent: number
  refi_interest_rate: number
  refi_loan_term_years: number
  refi_closing_cost_percent: number
  refi_closing_cost_fixed: number

  // Appreciation & Growth
  appreciation_rate: number
  appreciation_low: number
  appreciation_high: number
  rent_growth_rate: number
  expense_growth_rate: number
}

interface PropertyStore {
  // Form state
  form: PropertyFormState
  setForm: (form: Partial<PropertyFormState>) => void
  resetForm: () => void
  loadProperty: (property: Property) => void

  // Current property being viewed
  currentProperty: Property | null
  setCurrentProperty: (property: Property | null) => void

  // Dirty state
  isDirty: boolean
  setIsDirty: (dirty: boolean) => void
}

const initialFormState: PropertyFormState = {
  name: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  county: '',
  property_type: 'SFH',
  beds: null,
  baths: null,
  sqft: null,
  lot_sqft: null,
  year_built: null,
  notes: '',
  status: 'analyzing',

  purchase_price: 0,
  closing_cost_percent: DEFAULT_ASSUMPTIONS.closing_cost_buy_percent,
  closing_cost_fixed: 0,
  earnest_money: 0,
  financing_type: 'conventional',
  down_payment_percent: DEFAULT_ASSUMPTIONS.down_payment_percent,
  down_payment_amount: null,
  interest_rate: DEFAULT_ASSUMPTIONS.interest_rate,
  loan_term_years: DEFAULT_ASSUMPTIONS.loan_term_years,
  points: 0,
  pmi_monthly: 0,

  rehab_budget_total: 0,
  rehab_budget_itemized: { ...DEFAULT_REHAB_BUDGET },
  rehab_timeline_months: DEFAULT_ASSUMPTIONS.rehab_timeline_months,
  holding_costs_monthly: 0,

  monthly_rent: null,
  vacancy_percent: DEFAULT_ASSUMPTIONS.vacancy_percent,
  maintenance_percent: DEFAULT_ASSUMPTIONS.maintenance_percent,
  capex_percent: DEFAULT_ASSUMPTIONS.capex_percent,
  management_percent: DEFAULT_ASSUMPTIONS.management_percent,
  insurance_monthly: DEFAULT_ASSUMPTIONS.insurance_monthly,
  property_tax_annual: null,
  property_tax_rate: DEFAULT_ASSUMPTIONS.property_tax_rate,
  hoa_monthly: 0,
  utilities_monthly: 0,
  other_expenses_monthly: 0,

  arv: null,
  refi_ltv_percent: DEFAULT_ASSUMPTIONS.refi_ltv_percent,
  refi_interest_rate: DEFAULT_ASSUMPTIONS.interest_rate,
  refi_loan_term_years: DEFAULT_ASSUMPTIONS.loan_term_years,
  refi_closing_cost_percent: DEFAULT_ASSUMPTIONS.closing_cost_refi_percent,
  refi_closing_cost_fixed: 0,

  appreciation_rate: DEFAULT_ASSUMPTIONS.appreciation_rate,
  appreciation_low: 1,
  appreciation_high: 5,
  rent_growth_rate: DEFAULT_ASSUMPTIONS.rent_growth_rate,
  expense_growth_rate: DEFAULT_ASSUMPTIONS.expense_growth_rate,
}

export const usePropertyStore = create<PropertyStore>((set) => ({
  form: { ...initialFormState },
  setForm: (updates) =>
    set((state) => ({
      form: { ...state.form, ...updates },
      isDirty: true,
    })),
  resetForm: () =>
    set({
      form: { ...initialFormState },
      isDirty: false,
    }),
  loadProperty: (property) =>
    set({
      form: {
        name: property.name,
        address: property.address || '',
        city: property.city || '',
        state: property.state || '',
        zip: property.zip || '',
        county: property.county || '',
        property_type: property.property_type as PropertyType,
        beds: property.beds ?? null,
        baths: property.baths ?? null,
        sqft: property.sqft ?? null,
        lot_sqft: property.lot_sqft ?? null,
        year_built: property.year_built ?? null,
        notes: property.notes || '',
        status: property.status as PropertyStatus,

        purchase_price: property.purchase_price,
        closing_cost_percent: property.closing_cost_percent,
        closing_cost_fixed: property.closing_cost_fixed,
        earnest_money: property.earnest_money,
        financing_type: property.financing_type as FinancingType,
        down_payment_percent: property.down_payment_percent,
        down_payment_amount: property.down_payment_amount ?? null,
        interest_rate: property.interest_rate,
        loan_term_years: property.loan_term_years,
        points: property.points,
        pmi_monthly: property.pmi_monthly,

        rehab_budget_total: property.rehab_budget_total,
        rehab_budget_itemized: property.rehab_budget_itemized as RehabBudget,
        rehab_timeline_months: property.rehab_timeline_months,
        holding_costs_monthly: property.holding_costs_monthly,

        monthly_rent: property.monthly_rent ?? null,
        vacancy_percent: property.vacancy_percent,
        maintenance_percent: property.maintenance_percent,
        capex_percent: property.capex_percent,
        management_percent: property.management_percent,
        insurance_monthly: property.insurance_monthly,
        property_tax_annual: property.property_tax_annual ?? null,
        property_tax_rate: property.property_tax_rate ?? null,
        hoa_monthly: property.hoa_monthly,
        utilities_monthly: property.utilities_monthly,
        other_expenses_monthly: property.other_expenses_monthly,

        arv: property.arv ?? null,
        refi_ltv_percent: property.refi_ltv_percent,
        refi_interest_rate: property.refi_interest_rate,
        refi_loan_term_years: property.refi_loan_term_years,
        refi_closing_cost_percent: property.refi_closing_cost_percent,
        refi_closing_cost_fixed: property.refi_closing_cost_fixed,

        appreciation_rate: property.appreciation_rate,
        appreciation_low: property.appreciation_low,
        appreciation_high: property.appreciation_high,
        rent_growth_rate: property.rent_growth_rate,
        expense_growth_rate: property.expense_growth_rate,
      },
      currentProperty: property,
      isDirty: false,
    }),

  currentProperty: null,
  setCurrentProperty: (property) => set({ currentProperty: property }),

  isDirty: false,
  setIsDirty: (dirty) => set({ isDirty: dirty }),
}))
