'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RentCompCard } from './comp-card'
import { RentCompEditor } from './comp-editor-dialog'
import { formatCurrency } from '@/lib/format'
import { average } from '@/lib/utils'
import { Plus, Home } from 'lucide-react'
import type { RentComp } from '@/types/property'

interface RentCompsTableProps {
  comps: RentComp[]
  onCompsChange: (comps: RentComp[]) => void
  className?: string
}

export function RentCompsTable({ comps, onCompsChange, className }: RentCompsTableProps) {
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingComp, setEditingComp] = useState<RentComp | null>(null)

  const handleAdd = () => {
    setEditingComp(null)
    setEditorOpen(true)
  }

  const handleEdit = (comp: RentComp) => {
    setEditingComp(comp)
    setEditorOpen(true)
  }

  const handleDelete = (id: string) => {
    onCompsChange(comps.filter(c => c.id !== id))
  }

  const handleSave = (comp: RentComp) => {
    if (editingComp) {
      onCompsChange(comps.map(c => c.id === editingComp.id ? comp : c))
    } else {
      onCompsChange([...comps, comp])
    }
  }

  const rents = comps.map(c => c.rent).filter(r => r > 0)
  const averageRent = rents.length > 0 ? average(rents) : 0

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-brand-500" />
              Rent Comparables
            </CardTitle>
            <CardDescription>
              Comparable rentals to estimate market rent
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
          <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">Average Market Rent</p>
              <p className="text-2xl font-bold font-mono text-green-500">
                {formatCurrency(averageRent)}/mo
              </p>
            </div>
            <Badge variant="secondary">{comps.length} comp{comps.length !== 1 ? 's' : ''}</Badge>
          </div>
        )}

        {comps.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <Home className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No rent comps added yet</p>
            <p className="text-sm mt-1">Add comparable rentals to estimate market rent</p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {comps.map(comp => (
              <RentCompCard
                key={comp.id}
                comp={comp}
                onEdit={() => handleEdit(comp)}
                onDelete={() => comp.id && handleDelete(comp.id)}
              />
            ))}
          </div>
        )}

        <RentCompEditor
          open={editorOpen}
          onOpenChange={setEditorOpen}
          comp={editingComp}
          onSave={handleSave}
        />
      </CardContent>
    </Card>
  )
}
