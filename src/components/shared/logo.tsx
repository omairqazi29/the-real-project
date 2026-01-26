import Link from 'next/link'
import { cn } from '@/lib/cn'

interface LogoProps {
  className?: string
  showTagline?: boolean
  linkTo?: string
}

function LogoContent({ className, showTagline }: { className?: string; showTagline: boolean }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Logo Icon */}
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
        <svg
          className="h-5 w-5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>
      {/* Logo Text */}
      <div className="flex flex-col">
        <span className="text-lg font-bold tracking-tight text-neutral-100">
          The Real Project
        </span>
        {showTagline && (
          <span className="text-xs text-neutral-400">
            Every number, explained.
          </span>
        )}
      </div>
    </div>
  )
}

export function Logo({ className, showTagline = false, linkTo }: LogoProps) {
  if (linkTo) {
    return (
      <Link href={linkTo} className="focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-neutral-900 rounded-lg">
        <LogoContent className={className} showTagline={showTagline} />
      </Link>
    )
  }

  return <LogoContent className={className} showTagline={showTagline} />
}

export function LogoIcon({ className }: { className?: string }) {
  return (
    <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600', className)}>
      <svg
        className="h-5 w-5 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    </div>
  )
}
