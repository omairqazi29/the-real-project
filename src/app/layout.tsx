import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/auth'
import { TooltipProvider } from '@/components/ui'

export const metadata: Metadata = {
  title: 'The Real Project - Rental Property Investment Analyzer',
  description: 'BRRR strategy modeling, full data transparency, and market analysis for real estate investors. Every number, explained.',
  keywords: ['real estate', 'investment', 'BRRR', 'rental property', 'cash flow', 'analysis'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AuthProvider>
          <TooltipProvider delayDuration={300}>
            {children}
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
