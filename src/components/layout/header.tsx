'use client'

import { UserMenu } from '@/components/auth'
import { Button } from '@/components/ui'
import { Plus, Menu } from 'lucide-react'
import Link from 'next/link'

interface HeaderProps {
  onMenuClick?: () => void
  showMenuButton?: boolean
}

export function Header({ onMenuClick, showMenuButton = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-neutral-800 bg-background/80 px-4 backdrop-blur-sm lg:px-6">
      <div className="flex items-center gap-4">
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Link href="/properties/new">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Property</span>
          </Button>
        </Link>
        <UserMenu />
      </div>
    </header>
  )
}
