import { SignupForm } from '@/components/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'

export const metadata = {
  title: 'Sign Up - The Real Project',
  description: 'Create a new account',
}

export default function SignupPage() {
  return (
    <Card className="border-neutral-800 bg-surface">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Start analyzing your real estate investments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
      </CardContent>
    </Card>
  )
}
