'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ARVComp, RentComp } from '@/types/property'
import { generateId } from '@/lib/utils'

interface ARVCompEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  comp?: ARVComp | null
  onSave: (comp: ARVComp) => void
}

const defaultARVComp: ARVComp = {
  address: '',
  sold_price: 0,
  beds: 3,
  baths: 2,
  sqft: 0,
  price_per_sqft: 0,
  sold_date: new Date().toISOString().split('T')[0],
  distance_miles: 0,
  source: 'MLS',
  adjustments: { sqft: 0, condition: 0, garage: 0, pool: 0, lot_size: 0, other: 0 },
}

export function ARVCompEditor({ open, onOpenChange, comp, onSave }: ARVCompEditorProps) {
  const [form, setForm] = useState<ARVComp>(comp || { ...defaultARVComp, id: generateId() })

  const updateField = <K extends keyof ARVComp>(key: K, value: ARVComp[K]) => {
    setForm(prev => {
      const updated = { ...prev, [key]: value }
      if (key === 'sold_price' || key === 'sqft') {
        const price = key === 'sold_price' ? (value as number) : prev.sold_price
        const sqft = key === 'sqft' ? (value as number) : prev.sqft
        if (sqft > 0) updated.price_per_sqft = Math.round(price / sqft)
      }
      return updated
    })
  }

  const updateAdjustment = (key: string, value: number) => {
    setForm(prev => ({
      ...prev,
      adjustments: { ...prev.adjustments, [key]: value },
    }))
  }

  const handleSave = () => {
    const adjustmentTotal = form.adjustments
      ? Object.values(form.adjustments).reduce((sum, val) => sum + (val || 0), 0)
      : 0
    const saved = {
      ...form,
      adjusted_price: form.sold_price + adjustmentTotal,
    }
    onSave(saved)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{comp ? 'Edit ARV Comp' : 'Add ARV Comp'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Address</Label>
            <Input value={form.address} onChange={e => updateField('address', e.target.value)} placeholder="123 Main St" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Sold Price</Label>
              <Input type="number" value={form.sold_price || ''} onChange={e => updateField('sold_price', Number(e.target.value))} icon={<span>$</span>} />
            </div>
            <div>
              <Label>Sold Date</Label>
              <Input type="date" value={form.sold_date} onChange={e => updateField('sold_date', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Beds</Label>
              <Input type="number" value={form.beds || ''} onChange={e => updateField('beds', Number(e.target.value))} />
            </div>
            <div>
              <Label>Baths</Label>
              <Input type="number" value={form.baths || ''} onChange={e => updateField('baths', Number(e.target.value))} />
            </div>
            <div>
              <Label>Sqft</Label>
              <Input type="number" value={form.sqft || ''} onChange={e => updateField('sqft', Number(e.target.value))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Distance (miles)</Label>
              <Input type="number" step="0.1" value={form.distance_miles || ''} onChange={e => updateField('distance_miles', Number(e.target.value))} />
            </div>
            <div>
              <Label>Source</Label>
              <Input value={form.source} onChange={e => updateField('source', e.target.value)} placeholder="MLS" />
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-4">
            <h4 className="text-sm font-medium text-neutral-300 mb-3">Adjustments</h4>
            <div className="grid grid-cols-2 gap-3">
              {['sqft', 'condition', 'garage', 'pool', 'lot_size', 'other'].map(key => (
                <div key={key}>
                  <Label className="capitalize">{key.replace('_', ' ')}</Label>
                  <Input
                    type="number"
                    value={form.adjustments?.[key as keyof typeof form.adjustments] || ''}
                    onChange={e => updateAdjustment(key, Number(e.target.value))}
                    icon={<span>$</span>}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!form.address || !form.sold_price}>Save Comp</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface RentCompEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  comp?: RentComp | null
  onSave: (comp: RentComp) => void
}

const defaultRentComp: RentComp = {
  address: '',
  rent: 0,
  beds: 3,
  baths: 2,
  sqft: 0,
  distance_miles: 0,
  source: 'Zillow',
  date: new Date().toISOString().split('T')[0],
}

export function RentCompEditor({ open, onOpenChange, comp, onSave }: RentCompEditorProps) {
  const [form, setForm] = useState<RentComp>(comp || { ...defaultRentComp, id: generateId() })

  const updateField = <K extends keyof RentComp>(key: K, value: RentComp[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    onSave(form)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{comp ? 'Edit Rent Comp' : 'Add Rent Comp'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Address</Label>
            <Input value={form.address} onChange={e => updateField('address', e.target.value)} placeholder="123 Main St" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Monthly Rent</Label>
              <Input type="number" value={form.rent || ''} onChange={e => updateField('rent', Number(e.target.value))} icon={<span>$</span>} />
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={e => updateField('date', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Beds</Label>
              <Input type="number" value={form.beds || ''} onChange={e => updateField('beds', Number(e.target.value))} />
            </div>
            <div>
              <Label>Baths</Label>
              <Input type="number" value={form.baths || ''} onChange={e => updateField('baths', Number(e.target.value))} />
            </div>
            <div>
              <Label>Sqft</Label>
              <Input type="number" value={form.sqft || ''} onChange={e => updateField('sqft', Number(e.target.value))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Distance (miles)</Label>
              <Input type="number" step="0.1" value={form.distance_miles || ''} onChange={e => updateField('distance_miles', Number(e.target.value))} />
            </div>
            <div>
              <Label>Source</Label>
              <Input value={form.source} onChange={e => updateField('source', e.target.value)} placeholder="Zillow" />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!form.address || !form.rent}>Save Comp</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
