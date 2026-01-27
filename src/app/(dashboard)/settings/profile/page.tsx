'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader, Container } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Save, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function ProfileSettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      setEmail(user.email || '')

      const { data } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single() as { data: { full_name: string | null } | null }

      if (data?.full_name) setFullName(data.full_name)
    }
    load()
  }, [supabase, router])

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('profiles') as any).update({ full_name: fullName }).eq('id', user.id)

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <Container>
      <Link
        href="/settings"
        className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-100 transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Settings
      </Link>

      <PageHeader
        title="Profile"
        description="Manage your account information"
      >
        <Button onClick={handleSave} loading={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </PageHeader>

      <div className="grid gap-6 mt-6 max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={email} disabled />
              <p className="text-xs text-neutral-500 mt-1">Email cannot be changed here</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/30">
          <CardHeader>
            <CardTitle className="text-red-500">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}
