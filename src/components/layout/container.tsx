import { cn } from '@/lib/cn'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'full'
}

const sizeClasses = {
  sm: 'max-w-3xl',
  default: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
}

export function Container({
  children,
  className,
  size = 'default',
}: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sizeClasses[size], className)}>
      {children}
    </div>
  )
}
