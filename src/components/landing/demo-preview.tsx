import { formatCurrency, formatPercent } from '@/lib/format'
import { ArrowUpRight, TrendingUp, DollarSign, Percent, PiggyBank } from 'lucide-react'

const DEMO_METRICS = [
  { label: 'Purchase Price', value: '$185,000', icon: DollarSign },
  { label: 'Monthly Cash Flow', value: '$312/mo', icon: TrendingUp, color: 'text-green-500' },
  { label: 'Cash-on-Cash Return', value: '12.4%', icon: Percent, color: 'text-green-500' },
  { label: 'Cash Left in Deal', value: '$0', icon: PiggyBank, color: 'text-green-500' },
]

const DEMO_PROJECTIONS = [
  { year: 1, equity: '$42,200', cashflow: '$3,744' },
  { year: 3, equity: '$68,500', cashflow: '$12,100' },
  { year: 5, equity: '$98,900', cashflow: '$21,800' },
  { year: 10, equity: '$187,300', cashflow: '$52,400' },
]

export function DemoPreview() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-100 sm:text-4xl">
            See Your Deal at a Glance
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            Every metric calculated transparently with full formula breakdowns
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          {/* Mock Deal Summary */}
          <div className="rounded-xl border border-neutral-800 bg-surface p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-100">
                Sample BRRR Analysis
              </h3>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                Infinite Return
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {DEMO_METRICS.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-lg border border-neutral-700 bg-neutral-800/50 p-4"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <metric.icon className="h-3.5 w-3.5 text-neutral-500" />
                    <span className="text-xs text-neutral-400">{metric.label}</span>
                  </div>
                  <p className={`font-mono text-xl font-bold ${metric.color || 'text-neutral-100'}`}>
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Mini projections table */}
            <div className="overflow-hidden rounded-lg border border-neutral-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-800/50">
                    <th className="text-left py-2 px-4 text-xs text-neutral-400 font-medium">Year</th>
                    <th className="text-right py-2 px-4 text-xs text-neutral-400 font-medium">Total Equity</th>
                    <th className="text-right py-2 px-4 text-xs text-neutral-400 font-medium">Cumulative Cash Flow</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_PROJECTIONS.map(row => (
                    <tr key={row.year} className="border-t border-neutral-800">
                      <td className="py-2 px-4 font-medium">Year {row.year}</td>
                      <td className="py-2 px-4 text-right font-mono text-brand-400">{row.equity}</td>
                      <td className="py-2 px-4 text-right font-mono text-green-500">{row.cashflow}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-neutral-500 text-center">
              Click any number to see the full formula breakdown with data sources
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
