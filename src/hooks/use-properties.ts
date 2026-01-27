'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Property } from '@/types/property'
import type { Database } from '@/types/database'

type PropertyRow = Database['public']['Tables']['properties']['Row']
type PropertyInsert = Database['public']['Tables']['properties']['Insert']
type PropertyUpdate = Database['public']['Tables']['properties']['Update']

// Create a stable client reference
const getSupabase = () => createClient()

function mapRowToProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    user_id: row.user_id,
    name: row.name,
    address: row.address,
    city: row.city,
    state: row.state,
    zip: row.zip,
    county: row.county,
    property_type: row.property_type as Property['property_type'],
    beds: row.beds,
    baths: row.baths,
    sqft: row.sqft,
    lot_sqft: row.lot_sqft,
    year_built: row.year_built,
    photo_urls: row.photo_urls || [],
    notes: row.notes,
    status: row.status as Property['status'],
    purchase_price: row.purchase_price,
    closing_cost_percent: row.closing_cost_percent ?? 3,
    closing_cost_fixed: row.closing_cost_fixed ?? 0,
    earnest_money: row.earnest_money ?? 0,
    financing_type: row.financing_type as Property['financing_type'],
    down_payment_percent: row.down_payment_percent ?? 25,
    down_payment_amount: row.down_payment_amount,
    interest_rate: row.interest_rate ?? 7,
    loan_term_years: row.loan_term_years ?? 30,
    points: row.points ?? 0,
    pmi_monthly: row.pmi_monthly ?? 0,
    rehab_budget_total: row.rehab_budget_total ?? 0,
    rehab_budget_itemized: row.rehab_budget_itemized as unknown as Property['rehab_budget_itemized'],
    rehab_timeline_months: row.rehab_timeline_months ?? 3,
    holding_costs_monthly: row.holding_costs_monthly ?? 0,
    monthly_rent: row.monthly_rent,
    rent_comps: (row.rent_comps as unknown as Property['rent_comps']) || [],
    vacancy_percent: row.vacancy_percent ?? 5,
    maintenance_percent: row.maintenance_percent ?? 5,
    capex_percent: row.capex_percent ?? 8,
    management_percent: row.management_percent ?? 0,
    insurance_monthly: row.insurance_monthly ?? 100,
    property_tax_annual: row.property_tax_annual,
    property_tax_rate: row.property_tax_rate,
    hoa_monthly: row.hoa_monthly ?? 0,
    utilities_monthly: row.utilities_monthly ?? 0,
    other_expenses_monthly: row.other_expenses_monthly ?? 0,
    arv: row.arv,
    arv_comps: (row.arv_comps as unknown as Property['arv_comps']) || [],
    refi_ltv_percent: row.refi_ltv_percent ?? 75,
    refi_interest_rate: row.refi_interest_rate ?? 7,
    refi_loan_term_years: row.refi_loan_term_years ?? 30,
    refi_closing_cost_percent: row.refi_closing_cost_percent ?? 2,
    refi_closing_cost_fixed: row.refi_closing_cost_fixed ?? 0,
    appreciation_rate: row.appreciation_rate ?? 3,
    appreciation_low: row.appreciation_low ?? 1,
    appreciation_high: row.appreciation_high ?? 5,
    rent_growth_rate: row.rent_growth_rate ?? 2,
    expense_growth_rate: row.expense_growth_rate ?? 2,
    data_sources: (row.data_sources as unknown as Property['data_sources']) || {},
    calculated_monthly_cashflow: row.calculated_monthly_cashflow,
    calculated_cap_rate: row.calculated_cap_rate,
    calculated_coc_return: row.calculated_coc_return,
    calculated_total_investment: row.calculated_total_investment,
    calculated_cash_left_in_deal: row.calculated_cash_left_in_deal,
    created_at: row.created_at,
    updated_at: row.updated_at,
    analyzed_at: row.analyzed_at,
  }
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const supabase = useMemo(() => getSupabase(), [])

  const fetchProperties = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setProperties(data?.map(mapRowToProperty) || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch properties'))
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  const createProperty = useCallback(async (data: Omit<PropertyInsert, 'user_id'>) => {
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: newProperty, error: insertError } = await (supabase as any)
        .from('properties')
        .insert({
          ...data,
          user_id: user.id,
        })
        .select()
        .single()

      if (insertError) throw insertError

      const property = mapRowToProperty(newProperty)
      setProperties((prev) => [property, ...prev])

      return property
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create property')
      setError(error)
      throw error
    }
  }, [supabase])

  const deleteProperty = useCallback(async (id: string) => {
    setError(null)

    try {
      const { error: deleteError } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      setProperties((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete property')
      setError(error)
      throw error
    }
  }, [supabase])

  return {
    properties,
    isLoading,
    error,
    refresh: fetchProperties,
    createProperty,
    deleteProperty,
  }
}

export function useProperty(id: string | null) {
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const supabase = useMemo(() => getSupabase(), [])

  const fetchProperty = useCallback(async () => {
    if (!id) {
      setProperty(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      setProperty(data ? mapRowToProperty(data) : null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch property'))
      setProperty(null)
    } finally {
      setIsLoading(false)
    }
  }, [id, supabase])

  useEffect(() => {
    fetchProperty()
  }, [fetchProperty])

  const updateProperty = useCallback(async (data: PropertyUpdate) => {
    if (!id) throw new Error('No property ID')

    setError(null)

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: updated, error: updateError } = await (supabase as any)
        .from('properties')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      const updatedProperty = mapRowToProperty(updated)
      setProperty(updatedProperty)

      return updatedProperty
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update property')
      setError(error)
      throw error
    }
  }, [id, supabase])

  return {
    property,
    isLoading,
    error,
    refresh: fetchProperty,
    updateProperty,
  }
}
