'use client'

import { usePropertyStore } from '@/store/property-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PROPERTY_TYPES, US_STATES, PROPERTY_STATUSES } from '@/lib/constants'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, MapPin } from 'lucide-react'

export function PropertyBasicsForm() {
  const { form, setForm } = usePropertyStore()

  return (
    <div className="space-y-6">
      {/* Property Name & Status */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Home className="h-5 w-5 text-brand-500" />
            Property Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Property Name *</Label>
              <Input
                id="name"
                placeholder="e.g., 123 Main St Flip"
                value={form.name}
                onChange={(e) => setForm({ name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) => setForm({ status: value as typeof form.status })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="property_type">Property Type</Label>
            <Select
              value={form.property_type}
              onValueChange={(value) => setForm({ property_type: value as typeof form.property_type })}
            >
              <SelectTrigger id="property_type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-brand-500" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              placeholder="123 Main St"
              value={form.address}
              onChange={(e) => setForm({ address: e.target.value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="Austin"
                value={form.city}
                onChange={(e) => setForm({ city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select
                value={form.state}
                onValueChange={(value) => setForm({ state: value })}
              >
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.value} - {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input
                id="zip"
                placeholder="78701"
                value={form.zip}
                onChange={(e) => setForm({ zip: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="county">County</Label>
              <Input
                id="county"
                placeholder="Travis"
                value={form.county}
                onChange={(e) => setForm({ county: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Specs */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Property Specifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="beds">Bedrooms</Label>
              <Input
                id="beds"
                type="number"
                min="0"
                placeholder="3"
                value={form.beds ?? ''}
                onChange={(e) => setForm({ beds: e.target.value ? Number(e.target.value) : null })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="baths">Bathrooms</Label>
              <Input
                id="baths"
                type="number"
                min="0"
                step="0.5"
                placeholder="2"
                value={form.baths ?? ''}
                onChange={(e) => setForm({ baths: e.target.value ? Number(e.target.value) : null })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sqft">Square Feet</Label>
              <Input
                id="sqft"
                type="number"
                min="0"
                placeholder="1,500"
                value={form.sqft ?? ''}
                onChange={(e) => setForm({ sqft: e.target.value ? Number(e.target.value) : null })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year_built">Year Built</Label>
              <Input
                id="year_built"
                type="number"
                min="1800"
                max={new Date().getFullYear()}
                placeholder="1990"
                value={form.year_built ?? ''}
                onChange={(e) => setForm({ year_built: e.target.value ? Number(e.target.value) : null })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lot_sqft">Lot Size (sq ft)</Label>
            <Input
              id="lot_sqft"
              type="number"
              min="0"
              placeholder="7,500"
              value={form.lot_sqft ?? ''}
              onChange={(e) => setForm({ lot_sqft: e.target.value ? Number(e.target.value) : null })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="notes"
            placeholder="Add any notes about this property..."
            rows={4}
            value={form.notes}
            onChange={(e) => setForm({ notes: e.target.value })}
          />
        </CardContent>
      </Card>
    </div>
  )
}
