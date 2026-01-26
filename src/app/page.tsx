import Link from 'next/link'
import { Button } from '@/components/ui'
import { Logo } from '@/components/shared/logo'
import {
  Calculator,
  TrendingUp,
  Eye,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
} from 'lucide-react'

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

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-100 sm:text-5xl md:text-6xl">
            Analyze Real Estate Investments
            <br />
            <span className="text-brand-500">With Full Transparency</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-neutral-400">
            BRRR strategy modeling, comprehensive financial analysis, and complete visibility
            into every calculation. Know exactly where your numbers come from.
          </p>
          <p className="mt-2 text-xl font-medium text-brand-500">
            Every number, explained.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Analyzing Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-100 sm:text-4xl">
              Everything You Need for BRRR Analysis
            </h2>
            <p className="mt-4 text-lg text-neutral-400">
              Comprehensive tools designed for serious real estate investors
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600/20">
                <Calculator className="h-6 w-6 text-brand-500" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-100">
                Complete BRRR Analysis
              </h3>
              <p className="mt-2 text-sm text-neutral-400">
                Model every phase of your BRRR strategy: Buy, Rehab, Rent, and Refinance
                with detailed projections.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600/20">
                <Eye className="h-6 w-6 text-brand-500" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-100">
                Full Transparency
              </h3>
              <p className="mt-2 text-sm text-neutral-400">
                See exactly how every number is calculated. Click any metric to view
                the formula, inputs, and data sources.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600/20">
                <TrendingUp className="h-6 w-6 text-brand-500" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-100">
                10-Year Projections
              </h3>
              <p className="mt-2 text-sm text-neutral-400">
                Visualize equity buildup, cash flow growth, and total returns over time
                with multiple scenarios.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600/20">
                <BarChart3 className="h-6 w-6 text-brand-500" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-100">
                Visual Analytics
              </h3>
              <p className="mt-2 text-sm text-neutral-400">
                Beautiful charts showing equity growth, cash flow trends, and capital
                flow through your BRRR deals.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600/20">
                <Zap className="h-6 w-6 text-brand-500" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-100">
                Instant Calculations
              </h3>
              <p className="mt-2 text-sm text-neutral-400">
                All metrics update in real-time as you adjust inputs. Run sensitivity
                analysis with interactive sliders.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600/20">
                <Shield className="h-6 w-6 text-brand-500" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-100">
                Cloud Persistence
              </h3>
              <p className="mt-2 text-sm text-neutral-400">
                Your property analyses are securely saved in the cloud. Access your
                portfolio from anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-20">
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

      {/* CTA Section */}
      <section className="py-20 bg-surface">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-neutral-100 sm:text-4xl">
            Ready to Analyze Your Next Deal?
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            Join investors who trust their numbers because they understand where they come from.
          </p>
          <div className="mt-10">
            <Link href="/signup">
              <Button size="lg">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

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
