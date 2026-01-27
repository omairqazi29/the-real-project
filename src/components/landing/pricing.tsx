import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      'Up to 3 property analyses',
      'Full BRRR calculator',
      'Data transparency on all metrics',
      '10-year projections',
      'PDF export',
    ],
    cta: 'Get Started',
    href: '/signup',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'For active investors',
    features: [
      'Unlimited property analyses',
      'Everything in Free',
      'Scenario comparison',
      'Comparable management',
      'Market scorecards',
      'Multi-property comparison',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    href: '/signup',
    featured: true,
  },
  {
    name: 'Team',
    price: '$49',
    period: '/month',
    description: 'For investment teams',
    features: [
      'Everything in Pro',
      'Up to 5 team members',
      'Shared property pipeline',
      'Team defaults & templates',
      'API access',
      'Custom branding on exports',
    ],
    cta: 'Contact Us',
    href: '/signup',
    featured: false,
  },
]

export function Pricing() {
  return (
    <section className="py-20 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-100 sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            Start free. Upgrade when you need more.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'rounded-xl border p-6 flex flex-col',
                plan.featured
                  ? 'border-brand-500 bg-brand-600/5 relative'
                  : 'border-neutral-800 bg-neutral-900/50'
              )}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-neutral-100">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-neutral-100">{plan.price}</span>
                  <span className="text-neutral-500">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-neutral-400">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-neutral-300">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <Button
                  className="w-full"
                  variant={plan.featured ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
