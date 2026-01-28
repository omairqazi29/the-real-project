import Link from 'next/link'
import { Button } from '@/components/ui'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <h1 className="text-6xl font-bold text-brand-500">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-neutral-100">Page Not Found</h2>
      <p className="mt-2 text-neutral-400 text-center max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/">
          <Button variant="outline">Go Home</Button>
        </Link>
        <Link href="/properties">
          <Button>View Properties</Button>
        </Link>
      </div>
    </div>
  )
}
