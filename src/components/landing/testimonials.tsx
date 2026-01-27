const TESTIMONIALS = [
  {
    quote: "Finally, a calculator that shows me WHERE the numbers come from. I've caught bad assumptions in other tools that I never would have seen.",
    name: 'Marcus R.',
    role: 'BRRR Investor, 12 properties',
  },
  {
    quote: 'The scenario comparison feature sold me. Seeing conservative vs optimistic projections side by side helps me make confident offers.',
    name: 'Sarah K.',
    role: 'Real Estate Investor',
  },
  {
    quote: 'I used to spend hours in spreadsheets. Now I can analyze a deal in minutes and know every formula is correct.',
    name: 'James T.',
    role: 'Portfolio Investor, 8 units',
  },
]

export function Testimonials() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-100 sm:text-4xl">
            Trusted by Investors
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            Real feedback from real estate investors
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-4"
            >
              <p className="text-sm text-neutral-300 leading-relaxed italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div>
                <p className="font-medium text-neutral-100">{testimonial.name}</p>
                <p className="text-xs text-neutral-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
