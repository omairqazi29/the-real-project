'use client'

import { PageHeader, Container } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Settings, User, SlidersHorizontal } from 'lucide-react'

export default function SettingsPage() {
  return (
    <Container>
      <PageHeader
        title="Settings"
        description="Manage your account and default assumptions"
      />

      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <Link href="/settings/defaults">
          <Card className="hover:border-brand-500/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-brand-500" />
                Default Assumptions
              </CardTitle>
              <CardDescription>
                Set default values for vacancy, maintenance, CapEx, appreciation, and other
                assumptions used in new property analyses.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/settings/profile">
          <Card className="hover:border-brand-500/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-brand-500" />
                Profile
              </CardTitle>
              <CardDescription>
                Update your name, email, and account preferences.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </Container>
  )
}
