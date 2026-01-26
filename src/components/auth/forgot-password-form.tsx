'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from './auth-provider'
import { Button, Input, Label } from '@/components/ui'
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await resetPassword(email)
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
          <CheckCircle className="h-6 w-6 text-green-500" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-100">
          Check your email
        </h3>
        <p className="text-sm text-neutral-400">
          We&apos;ve sent password reset instructions to <strong>{email}</strong>.
        </p>
        <Link href="/login">
          <Button variant="outline" className="w-full">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <p className="text-sm text-neutral-400">
        Enter your email address and we&apos;ll send you a link to reset your password.
      </p>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="h-4 w-4" />}
          required
          autoComplete="email"
        />
      </div>

      <Button type="submit" className="w-full" loading={loading}>
        Send reset link
      </Button>

      <Link href="/login" className="block">
        <Button variant="ghost" className="w-full">
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Button>
      </Link>
    </form>
  )
}
