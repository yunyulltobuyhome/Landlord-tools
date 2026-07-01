import Link from "next/link";
import { statesData } from "@/lib/states-data";

export default function HomePage() {
  const featured = statesData.filter((s) =>
    ["california", "new-york", "texas", "florida", "massachusetts", "illinois"].includes(
      s.slug
    )
  );

  return (
    <div>
      <section className="border-b-2 border-ink bg-sand">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-clay">
            For independent landlords &amp; small property owners
          </p>
          <h1 className="mt-3 max-w-2xl font-serif text-4xl font-bold leading-tight sm:text-6xl">
            Return a security deposit{" "}
            <span className="underline-squiggle">the right way</span>
          </h1>
          <p className="mt-5 max-w-xl font-sans text-lg text-ink/70">
            Free calculators and document generators for the moment a
            tenant moves out — built around each state&apos;s deadlines,
            interest rules, and penalties, so you don&apos;t have to dig
            through a statute.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/calculator"
              className="card-flat bg-mossdark px-6 py-3 font-sans text-sm font-semibold text-paper hover:bg-moss"
            >
              Calculate a refund →
            </Link>
            <Link
              href="/deduction-letter"
              className="card-flat bg-clay px-6 py-3 font-sans text-sm font-semibold text-paper hover:bg-clay/90"
            >
              Generate a deduction letter →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="card-flat bg-white p-6">
            <p className="font-serif text-2xl font-bold text-moss">01</p>
            <h2 className="mt-2 font-serif text-lg font-bold">
              Know your deadline
            </h2>
            <p className="mt-2 font-sans text-sm text-ink/70">
              Every state sets a hard deadline to return a deposit or send
              an itemized statement — from 14 to 60 days after move-out.
              Miss it and you can forfeit the right to withhold anything.
            </p>
          </div>
          <div className="card-flat bg-white p-6">
            <p className="font-serif text-2xl font-bold text-moss">02</p>
            <h2 className="mt-2 font-serif text-lg font-bold">
              Calculate the refund
            </h2>
            <p className="mt-2 font-sans text-sm text-ink/70">
              Enter the deposit, deductions, and dates. The calculator
              applies your state&apos;s deadline and interest rules and
              shows exactly what&apos;s owed and by when.
            </p>
          </div>
          <div className="card-flat bg-white p-6">
            <p className="font-serif text-2xl font-bold text-moss">03</p>
            <h2 className="mt-2 font-serif text-lg font-bold">
              Document it
            </h2>
            <p className="mt-2 font-sans text-sm text-ink/70">
              Generate a clean, itemized PDF statement citing your state
              statute — the paper trail that protects you if a former
              tenant disputes a deduction.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-ink bg-mossdark py-16 text-paper">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="font-serif text-3xl font-bold">
            Look up your state&apos;s deposit law
          </h2>
          <p className="mt-2 max-w-xl font-sans text-paper/70">
            Deposit caps, refund deadlines, interest requirements, and
            penalties — summarized for all 50 states plus D.C.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {featured.map((s) => (
              <Link
                key={s.slug}
                href={`/state/${s.slug}`}
                className="border-2 border-paper/40 px-4 py-3 font-sans text-sm font-medium hover:border-paper hover:bg-paper hover:text-mossdark"
              >
                {s.name}
              </Link>
            ))}
          </div>
          <Link
            href="/state"
            className="mt-6 inline-block font-sans text-sm font-semibold text-gold hover:underline"
          >
            View all states →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="font-serif text-3xl font-bold">
          Built for the paperwork side of being a landlord
        </h2>
        <p className="mt-3 max-w-2xl font-sans text-ink/70">
          Landlord Tools is a small, focused set of calculators and
          document generators — not a listing platform or a leasing
          service. Everything runs in your browser; nothing you enter is
          uploaded or stored.
        </p>
      </section>
    </div>
  );
}
