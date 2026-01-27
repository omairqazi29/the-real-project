import {
  Calculator,
  TrendingUp,
  Eye,
  BarChart3,
  Shield,
  Zap,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Calculator,
    title: 'Complete BRRR Analysis',
    description:
      'Model every phase of your BRRR strategy: Buy, Rehab, Rent, and Refinance with detailed projections.',
  },
  {
    icon: Eye,
    title: 'Full Transparency',
    description:
      'See exactly how every number is calculated. Click any metric to view the formula, inputs, and data sources.',
  },
  {
    icon: TrendingUp,
    title: '10-Year Projections',
    description:
      'Visualize equity buildup, cash flow growth, and total returns over time with multiple scenarios.',
  },
  {
    icon: BarChart3,
    title: 'Visual Analytics',
    description:
      'Beautiful charts showing equity growth, cash flow trends, and capital flow through your BRRR deals.',
  },
  {
    icon: Zap,
    title: 'Instant Calculations',
    description:
      'All metrics update in real-time as you adjust inputs. Run sensitivity analysis with interactive sliders.',
  },
  {
    icon: Shield,
    title: 'Cloud Persistence',
    description:
      'Your property analyses are securely saved in the cloud. Access your portfolio from anywhere.',
  },
]

export function Features() {
  return (
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
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600/20">
                <feature.icon className="h-6 w-6 text-brand-500" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-100">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
