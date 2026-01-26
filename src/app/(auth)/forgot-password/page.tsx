import { ForgotPasswordForm } from '@/components/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'

export const metadata = {
  title: 'Reset Password - The Real Project',
  description: 'Reset your password',
}

export default function ForgotPasswordPage() {
  return (
    <Card className="border-neutral-800 bg-surface">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Reset password</CardTitle>
        <CardDescription>
          We&apos;ll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
      </CardContent>
    </Card>
  )
}
