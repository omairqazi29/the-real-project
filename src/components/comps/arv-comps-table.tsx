'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ARVCompCard } from './comp-card'
import { ARVCompEditor } from './comp-editor-dialog'
import { formatCurrency } from '@/lib/format'
import { average } from '@/lib/utils'
import { Plus, TrendingUp } from 'lucide-react'
import type { ARVComp } from '@/types/property'

interface ARVCompsTableProps {
  comps: ARVComp[]
  onCompsChange: (comps: ARVComp[]) => void
  className?: string
}

export function ARVCompsTable({ comps, onCompsChange, className }: ARVCompsTableProps) {
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingComp, setEditingComp] = useState<ARVComp | null>(null)

  const handleAdd = () => {
    setEditingComp(null)
    setEditorOpen(true)
  }

  const handleEdit = (comp: ARVComp) => {
    setEditingComp(comp)
    setEditorOpen(true)
  }

  const handleDelete = (id: string) => {
    onCompsChange(comps.filter(c => c.id !== id))
  }

  const handleSave = (comp: ARVComp) => {
    if (editingComp) {
      onCompsChange(comps.map(c => c.id === editingComp.id ? comp : c))
    } else {
      onCompsChange([...comps, comp])
    }
  }

  const adjustedPrices = comps
    .map(c => c.adjusted_price ?? c.sold_price)
    .filter(p => p > 0)

  const averageARV = adjustedPrices.length > 0 ? average(adjustedPrices) : 0

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-500" />
              ARV Comparables
            </CardTitle>
            <CardDescription>
              Comparable sales to estimate After Repair Value
            </CardDescription>
          </div>
          <Button size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-1" />
            Add Comp
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {comps.length > 0 && (
          <div className="rounded-lg bg-brand-600/10 border border-brand-500/30 p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">Estimated ARV</p>
              <p className="text-2xl font-bold font-mono text-neutral-100">
                {formatCurrency(averageARV)}
              </p>
            </div>
            <Badge variant="secondary">{comps.length} comp{comps.length !== 1 ? 's' : ''}</Badge>
          </div>
        )}

        {comps.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No ARV comps added yet</p>
            <p className="text-sm mt-1">Add comparable sales to estimate property value after rehab</p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {comps.map(comp => (
              <ARVCompCard
                key={comp.id}
                comp={comp}
                onEdit={() => handleEdit(comp)}
                onDelete={() => comp.id && handleDelete(comp.id)}
              />
            ))}
          </div>
        )}

        <ARVCompEditor
          open={editorOpen}
          onOpenChange={setEditorOpen}
          comp={editingComp}
          onSave={handleSave}
        />
      </CardContent>
    </Card>
  )
}
