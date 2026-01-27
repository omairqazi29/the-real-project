import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
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
  )
}
