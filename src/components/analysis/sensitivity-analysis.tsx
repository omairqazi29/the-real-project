'use client'

import { useMemo, useState, useCallback } from 'react'
import { cn } from '@/lib/cn'
import { formatCurrency, formatPercent } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle, Slider } from '@/components/ui'
import { calculatePropertyCashFlow, calculatePropertyBRRR, calculateReturns } from '@/lib/calculations'
import type { Property } from '@/types/property'

interface SensitivityAnalysisProps {
  property: Property
  onChange?: (overrides: Partial<Property>) => void
  className?: string
}

interface SliderConfig {
  key: string
  label: string
  propertyKey: keyof Property
  min: number
  max: number
  step: number
  format: 'currency' | 'percent'
  getRange: (base: number) => [number, number]
}

const SLIDER_CONFIGS: SliderConfig[] = [
  {
    key: 'purchase_price',
    label: 'Purchase Price',
    propertyKey: 'purchase_price',
    min: 0,
    max: 100,
    step: 1000,
    format: 'currency',
    getRange: (base) => [base * 0.8, base * 1.2],
  },
  {
    key: 'monthly_rent',
    label: 'Monthly Rent',
    propertyKey: 'monthly_rent',
    min: 0,
    max: 100,
    step: 50,
    format: 'currency',
    getRange: (base) => [base * 0.7, base * 1.3],
  },
  {
    key: 'interest_rate',
    label: 'Interest Rate',
    propertyKey: 'interest_rate',
    min: 0,
    max: 100,
    step: 0.125,
    format: 'percent',
    getRange: (base) => [Math.max(0, base - 3), base + 3],
  },
  {
    key: 'vacancy_percent',
    label: 'Vacancy Rate',
    propertyKey: 'vacancy_percent',
    min: 0,
    max: 15,
    step: 0.5,
    format: 'percent',
    getRange: () => [0, 15],
  },
  {
    key: 'appreciation_rate',
    label: 'Appreciation Rate',
    propertyKey: 'appreciation_rate',
    min: 0,
    max: 8,
    step: 0.25,
    format: 'percent',
    getRange: () => [0, 8],
  },
  {
    key: 'capex_percent',
    label: 'CapEx Reserve',
    propertyKey: 'capex_percent',
    min: 0,
    max: 15,
    step: 0.5,
    format: 'percent',
    getRange: () => [0, 15],
  },
]

function computeMetrics(property: Property) {
  const cashFlow = calculatePropertyCashFlow(property)
  const brrr = calculatePropertyBRRR(property)
  const noi = cashFlow.netOperatingIncome * 12
  const returns = calculateReturns({
    annualNOI: noi,
    propertyValue: property.purchase_price,
    annualCashFlow: cashFlow.annualCashFlow,
    totalCashInvested: brrr.totalCashInvested,
    annualGrossRent: (property.monthly_rent ?? 0) * 12,
    annualDebtService: cashFlow.debtService * 12,
  })

  return {
    monthlyCashFlow: cashFlow.monthlyCashFlow,
    cocReturn: returns.cashOnCashReturn,
    capRate: returns.capRate,
  }
}

export function SensitivityAnalysis({ property, onChange, className }: SensitivityAnalysisProps) {
  const [overrides, setOverrides] = useState<Partial<Property>>({})

  const adjustedProperty: Property = useMemo(() => {
    return { ...property, ...overrides }
  }, [property, overrides])

  const baseMetrics = useMemo(() => computeMetrics(property), [property])
  const currentMetrics = useMemo(() => computeMetrics(adjustedProperty), [adjustedProperty])

  const handleSliderChange = useCallback(
    (key: keyof Property, value: number) => {
      const newOverrides = { ...overrides, [key]: value }
      setOverrides(newOverrides)
      onChange?.(newOverrides)
    },
    [overrides, onChange]
  )

  const handleReset = useCallback(() => {
    setOverrides({})
    onChange?.({})
  }, [onChange])

  const getBaseValue = (config: SliderConfig): number => {
    const val = property[config.propertyKey]
    return typeof val === 'number' ? val : 0
  }

  const getCurrentValue = (config: SliderConfig): number => {
    const val = adjustedProperty[config.propertyKey]
    return typeof val === 'number' ? val : 0
  }

  const formatSliderValue = (value: number, format: string): string => {
    return format === 'currency' ? formatCurrency(value) : formatPercent(value)
  }

  const hasChanges = Object.keys(overrides).length > 0

  return (
    <div className={cn('space-y-6', className)}>
      {/* Summary Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Scenario Summary</CardTitle>
            {hasChanges && (
              <button
                onClick={handleReset}
                className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
              >
                Reset to Original
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-neutral-400 mb-1">Monthly Cash Flow</p>
              <p
                className={cn(
                  'text-xl font-bold font-mono',
                  currentMetrics.monthlyCashFlow >= 0 ? 'text-green-500' : 'text-red-500'
                )}
              >
                {formatCurrency(currentMetrics.monthlyCashFlow)}
              </p>
              {hasChanges && (
                <p
                  className={cn(
                    'text-xs font-mono mt-1',
                    currentMetrics.monthlyCashFlow - baseMetrics.monthlyCashFlow >= 0
                      ? 'text-green-400'
                      : 'text-red-400'
                  )}
                >
                  {currentMetrics.monthlyCashFlow - baseMetrics.monthlyCashFlow >= 0 ? '+' : ''}
                  {formatCurrency(currentMetrics.monthlyCashFlow - baseMetrics.monthlyCashFlow)}
                </p>
              )}
            </div>
            <div className="text-center">
              <p className="text-xs text-neutral-400 mb-1">CoC Return</p>
              <p
                className={cn(
                  'text-xl font-bold font-mono',
                  currentMetrics.cocReturn >= 0 ? 'text-green-500' : 'text-red-500'
                )}
              >
                {formatPercent(currentMetrics.cocReturn)}
              </p>
              {hasChanges && (
                <p
                  className={cn(
                    'text-xs font-mono mt-1',
                    currentMetrics.cocReturn - baseMetrics.cocReturn >= 0
                      ? 'text-green-400'
                      : 'text-red-400'
                  )}
                >
                  {currentMetrics.cocReturn - baseMetrics.cocReturn >= 0 ? '+' : ''}
                  {formatPercent(currentMetrics.cocReturn - baseMetrics.cocReturn)}
                </p>
              )}
            </div>
            <div className="text-center">
              <p className="text-xs text-neutral-400 mb-1">Cap Rate</p>
              <p
                className={cn(
                  'text-xl font-bold font-mono',
                  currentMetrics.capRate >= 0 ? 'text-green-500' : 'text-red-500'
                )}
              >
                {formatPercent(currentMetrics.capRate)}
              </p>
              {hasChanges && (
                <p
                  className={cn(
                    'text-xs font-mono mt-1',
                    currentMetrics.capRate - baseMetrics.capRate >= 0
                      ? 'text-green-400'
                      : 'text-red-400'
                  )}
                >
                  {currentMetrics.capRate - baseMetrics.capRate >= 0 ? '+' : ''}
                  {formatPercent(currentMetrics.capRate - baseMetrics.capRate)}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sliders */}
      <Card>
        <CardHeader>
          <CardTitle>Adjust Variables</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {SLIDER_CONFIGS.map((config) => {
            const baseValue = getBaseValue(config)
            const [rangeMin, rangeMax] = config.getRange(baseValue)
            const currentValue = getCurrentValue(config)

            return (
              <div key={config.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-neutral-300">
                    {config.label}
                  </label>
                  <span className="text-sm font-mono text-neutral-100">
                    {formatSliderValue(currentValue, config.format)}
                  </span>
                </div>
                <Slider
                  value={[currentValue]}
                  min={rangeMin}
                  max={rangeMax}
                  step={config.step}
                  onValueChange={([val]) => handleSliderChange(config.propertyKey, val)}
                />
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>{formatSliderValue(rangeMin, config.format)}</span>
                  <span className="text-neutral-400">
                    Base: {formatSliderValue(baseValue, config.format)}
                  </span>
                  <span>{formatSliderValue(rangeMax, config.format)}</span>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
