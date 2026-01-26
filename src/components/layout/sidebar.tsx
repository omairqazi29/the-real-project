'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/cn'
import { Logo, LogoIcon } from '@/components/shared/logo'
import {
  Home,
  Building2,
  Map,
  GitCompare,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

const navigation = [
  { name: 'Dashboard', href: '/properties', icon: Home },
  { name: 'Properties', href: '/properties', icon: Building2 },
  { name: 'Markets', href: '/markets', icon: Map },
  { name: 'Compare', href: '/compare', icon: GitCompare },
]

const bottomNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-neutral-800 bg-surface transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-neutral-800 px-4">
        {collapsed ? (
          <Link href="/properties">
            <LogoIcon />
          </Link>
        ) : (
          <Logo linkTo="/properties" />
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-600/10 text-brand-500'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100',
                collapsed && 'justify-center px-2'
              )}
            >
              <item.icon className={cn('h-5 w-5 shrink-0', isActive && 'text-brand-500')} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-neutral-800 p-2">
        {bottomNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-600/10 text-brand-500'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100',
                collapsed && 'justify-center px-2'
              )}
            >
              <item.icon className={cn('h-5 w-5 shrink-0', isActive && 'text-brand-500')} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </div>

      {/* Collapse Toggle */}
      {onToggle && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-neutral-700 bg-surface text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      )}
    </aside>
  )
}
