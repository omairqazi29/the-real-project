import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CTA() {
  return (
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
  )
}
