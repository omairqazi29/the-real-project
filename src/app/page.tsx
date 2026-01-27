import Link from 'next/link'
import { Button } from '@/components/ui'
import { Logo } from '@/components/shared/logo'
import { CheckCircle } from 'lucide-react'
import { Hero, Features, DemoPreview, Testimonials, Pricing, CTA } from '@/components/landing'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-800 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo showTagline={false} />
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <Hero />
      <Features />
      <DemoPreview />

      {/* Metrics Section */}
      <section className="py-20 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-100 sm:text-4xl">
              Key Metrics at a Glance
            </h2>
            <p className="mt-4 text-lg text-neutral-400">
              Every metric you need to evaluate investment properties
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Cash-on-Cash Return', desc: 'Annual return on invested cash' },
              { label: 'Cap Rate', desc: 'NOI as percentage of property value' },
              { label: 'Monthly Cash Flow', desc: 'Net income after all expenses' },
              { label: 'Total ROI', desc: 'Complete return including equity' },
              { label: 'DSCR', desc: 'Debt Service Coverage Ratio' },
              { label: 'Cash Left in Deal', desc: 'Capital remaining after refinance' },
              { label: 'Forced Equity', desc: 'Value created through rehab' },
              { label: 'IRR', desc: 'Internal Rate of Return' },
            ].map((metric) => (
              <div
                key={metric.label}
                className="flex items-start gap-3 rounded-lg border border-neutral-800 bg-neutral-900/50 p-4"
              >
                <CheckCircle className="h-5 w-5 shrink-0 text-brand-500" />
                <div>
                  <p className="font-medium text-neutral-100">{metric.label}</p>
                  <p className="text-sm text-neutral-500">{metric.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
      <Pricing />
      <CTA />

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Logo showTagline />
            <p className="text-sm text-neutral-500">
              Built for BRRR investors who demand transparency.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
