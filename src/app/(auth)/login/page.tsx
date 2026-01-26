import { Suspense } from 'react'
import { LoginForm } from '@/components/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'

export const metadata = {
  title: 'Sign In - The Real Project',
  description: 'Sign in to your account',
}

export default function LoginPage() {
  return (
    <Card className="border-neutral-800 bg-surface">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div className="h-64 animate-pulse bg-neutral-800 rounded-lg" />}>
          <LoginForm />
        </Suspense>
      </CardContent>
    </Card>
  )
}
