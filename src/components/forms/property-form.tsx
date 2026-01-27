'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePropertyStore } from '@/store/property-store'
import { PropertyBasicsForm } from './property-basics-form'
import { PurchaseForm } from './purchase-form'
import { RehabForm } from './rehab-form'
import { RentForm } from './rent-form'
import { RefinanceForm } from './refinance-form'
import { AssumptionsForm } from './assumptions-form'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import {
  Home,
  DollarSign,
  Hammer,
  Key,
  RefreshCw,
  Settings,
  Save,
  Loader2,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Property } from '@/types/property'

interface PropertyFormProps {
  property?: Property | null
  onSave: (data: ReturnType<typeof usePropertyStore.getState>['form']) => Promise<void>
  isLoading?: boolean
}

const TABS = [
  { id: 'basics', label: 'Basics', icon: Home, description: 'Property details & location' },
  { id: 'purchase', label: 'Buy', icon: DollarSign, description: 'Purchase price & financing' },
  { id: 'rehab', label: 'Rehab', icon: Hammer, description: 'Renovation budget & timeline' },
  { id: 'rent', label: 'Rent', icon: Key, description: 'Rental income & expenses' },
  { id: 'refinance', label: 'Refinance', icon: RefreshCw, description: 'ARV & refi terms' },
  { id: 'assumptions', label: 'Assumptions', icon: Settings, description: 'Growth rates & projections' },
] as const

type TabId = (typeof TABS)[number]['id']

export function PropertyForm({ property, onSave, isLoading = false }: PropertyFormProps) {
  const router = useRouter()
  const { form, setForm, loadProperty, resetForm, isDirty } = usePropertyStore()
  const [activeTab, setActiveTab] = useState<TabId>('basics')
  const [completedTabs, setCompletedTabs] = useState<Set<TabId>>(new Set())

  // Load property data on mount
  useEffect(() => {
    if (property) {
      loadProperty(property)
    } else {
      resetForm()
    }
    return () => {
      // Don't reset on unmount - let the page handle that
    }
  }, [property, loadProperty, resetForm])

  const markTabComplete = useCallback((tabId: TabId) => {
    setCompletedTabs((prev) => new Set([...prev, tabId]))
  }, [])

  const handleNext = useCallback(() => {
    const currentIndex = TABS.findIndex((t) => t.id === activeTab)
    markTabComplete(activeTab)
    if (currentIndex < TABS.length - 1) {
      setActiveTab(TABS[currentIndex + 1].id)
    }
  }, [activeTab, markTabComplete])

  const handlePrevious = useCallback(() => {
    const currentIndex = TABS.findIndex((t) => t.id === activeTab)
    if (currentIndex > 0) {
      setActiveTab(TABS[currentIndex - 1].id)
    }
  }, [activeTab])

  const handleSave = useCallback(async () => {
    await onSave(form)
  }, [form, onSave])

  const currentTabIndex = TABS.findIndex((t) => t.id === activeTab)
  const isFirstTab = currentTabIndex === 0
  const isLastTab = currentTabIndex === TABS.length - 1

  // Validation check for name
  const canSave = form.name.trim().length > 0 && form.purchase_price > 0

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabId)}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto p-1 bg-neutral-800/50">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            const isComplete = completedTabs.has(tab.id)

            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  'flex flex-col items-center gap-1 py-3 px-2 relative',
                  'data-[state=active]:bg-neutral-700',
                  isComplete && !isActive && 'text-green-500'
                )}
              >
                <div className="flex items-center gap-1.5">
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-medium hidden sm:inline">{tab.label}</span>
                </div>
                {isComplete && !isActive && (
                  <CheckCircle className="h-3 w-3 absolute top-1 right-1 text-green-500" />
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* Tab Description */}
        <Card className="border-neutral-800 bg-neutral-900/50">
          <CardContent className="py-3">
            <p className="text-sm text-neutral-400">
              <span className="font-medium text-neutral-200">
                {TABS.find((t) => t.id === activeTab)?.label}:
              </span>{' '}
              {TABS.find((t) => t.id === activeTab)?.description}
            </p>
          </CardContent>
        </Card>

        {/* Tab Content */}
        <TabsContent value="basics" className="mt-0">
          <PropertyBasicsForm />
        </TabsContent>
        <TabsContent value="purchase" className="mt-0">
          <PurchaseForm />
        </TabsContent>
        <TabsContent value="rehab" className="mt-0">
          <RehabForm />
        </TabsContent>
        <TabsContent value="rent" className="mt-0">
          <RentForm />
        </TabsContent>
        <TabsContent value="refinance" className="mt-0">
          <RefinanceForm />
        </TabsContent>
        <TabsContent value="assumptions" className="mt-0">
          <AssumptionsForm />
        </TabsContent>
      </Tabs>

      {/* Navigation & Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstTab}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {!isLastTab && (
            <Button
              variant="outline"
              onClick={handleNext}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isDirty && (
            <span className="text-xs text-neutral-500">Unsaved changes</span>
          )}

          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={isLoading || !canSave}
            className="bg-brand-600 hover:bg-brand-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {property ? 'Save Changes' : 'Create Property'}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Validation Message */}
      {!canSave && (
        <p className="text-sm text-yellow-500">
          Please enter a property name and purchase price to save.
        </p>
      )}
    </div>
  )
}
