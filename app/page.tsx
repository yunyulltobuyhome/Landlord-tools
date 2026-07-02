import Link from "next/link";
import { statesData } from "@/lib/states-data";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export default function HomePage() {
  const featured = statesData.filter((s) =>
    ["california", "new-york", "texas", "florida", "massachusetts", "illinois"].includes(
      s.slug
    )
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
      },
      {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="bg-sand">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:py-28">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
            For independent landlords &amp; small property owners
          </p>
          <h1 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
            Return a security deposit{" "}
            <span className="text-moss">the right way</span>
          </h1>
          <p className="mt-5 max-w-xl font-sans text-lg text-ink/60">
            Free calculators and document generators for the moment a
            tenant moves out — built around each state&apos;s deadlines,
            interest rules, and penalties, so you don&apos;t have to dig
            through a statute.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/calculator"
              className="card-flat rounded-xl bg-ink px-6 py-3 font-sans text-sm font-semibold text-white hover:bg-ink/90"
            >
              Calculate a refund →
            </Link>
            <Link
              href="/deduction-letter"
              className="rounded-xl border border-line bg-white px-6 py-3 font-sans text-sm font-semibold text-ink hover:border-moss hover:text-moss"
            >
              Generate a deduction letter →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20">
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="card-flat rounded-2xl bg-white p-7">
            <p className="font-serif text-2xl font-bold text-moss">01</p>
            <h2 className="mt-3 font-serif text-lg font-bold">
              Know your deadline
            </h2>
            <p className="mt-2 font-sans text-sm text-ink/60">
              Every state sets a hard deadline to return a deposit or send
              an itemized statement — from 14 to 60 days after move-out.
              Miss it and you can forfeit the right to withhold anything.
            </p>
          </div>
          <div className="card-flat rounded-2xl bg-white p-7">
            <p className="font-serif text-2xl font-bold text-moss">02</p>
            <h2 className="mt-3 font-serif text-lg font-bold">
              Calculate the refund
            </h2>
            <p className="mt-2 font-sans text-sm text-ink/60">
              Enter the deposit, deductions, and dates. The calculator
              applies your state&apos;s deadline and interest rules and
              shows exactly what&apos;s owed and by when.
            </p>
          </div>
          <div className="card-flat rounded-2xl bg-white p-7">
            <p className="font-serif text-2xl font-bold text-moss">03</p>
            <h2 className="mt-3 font-serif text-lg font-bold">
              Document it
            </h2>
            <p className="mt-2 font-sans text-sm text-ink/60">
              Generate a clean, itemized PDF statement citing your state
              statute — the paper trail that protects you if a former
              tenant disputes a deduction.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-mossdark py-20 text-white">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="font-serif text-3xl font-bold tracking-tight">
            Look up your state&apos;s deposit law
          </h2>
          <p className="mt-2 max-w-xl font-sans text-white/60">
            Deposit caps, refund deadlines, interest requirements, and
            penalties — summarized for all 50 states plus D.C.
          </p>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {featured.map((s) => (
              <Link
                key={s.slug}
                href={`/state/${s.slug}`}
                className="rounded-xl border border-white/15 px-4 py-3 font-sans text-sm font-medium transition-colors hover:border-white/40 hover:bg-white/5"
              >
                {s.name}
              </Link>
            ))}
          </div>
          <Link
            href="/state"
            className="mt-7 inline-block font-sans text-sm font-semibold text-white hover:text-white/70"
          >
            View all states →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20">
        <div className="card-flat rounded-2xl bg-clay p-8 text-white sm:p-10">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-white/80">
            Renter, not a landlord?
          </p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl font-bold tracking-tight">
            Landlord won&apos;t return your security deposit?
          </h2>
          <p className="mt-3 max-w-xl font-sans text-white/85">
            Generate a free demand letter that cites your state&apos;s return
            deadline and the penalties your landlord faces for withholding it —
            the step that settles most cases before small claims.
          </p>
          <Link
            href="/security-deposit-demand-letter"
            className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-sans text-sm font-semibold text-clay transition-colors hover:bg-white/90"
          >
            Get my deposit back →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20">
        <h2 className="font-serif text-3xl font-bold tracking-tight">
          More free tools for the rest of the rent cycle
        </h2>
        <p className="mt-3 max-w-2xl font-sans text-ink/60">
          Beyond move-out: proration, late fees, condition checklists, and
          receipts.
        </p>
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <Link
            href="/move-in-checklist"
            className="card-flat rounded-2xl bg-white p-7 transition-colors hover:border-moss"
          >
            <h3 className="font-serif text-lg font-bold">
              Move-In / Move-Out Checklist
            </h3>
            <p className="mt-2 font-sans text-sm text-ink/60">
              Room-by-room condition report, signed and dated — the best
              evidence in a deposit dispute.
            </p>
          </Link>
          <Link
            href="/rent-receipt-generator"
            className="card-flat rounded-2xl bg-white p-7 transition-colors hover:border-moss"
          >
            <h3 className="font-serif text-lg font-bold">
              Rent Receipt Generator
            </h3>
            <p className="mt-2 font-sans text-sm text-ink/60">
              A clean, dated PDF receipt for any rent payment, in under a
              minute.
            </p>
          </Link>
          <Link
            href="/prorated-rent-calculator"
            className="card-flat rounded-2xl bg-white p-7 transition-colors hover:border-moss"
          >
            <h3 className="font-serif text-lg font-bold">
              Prorated Rent Calculator
            </h3>
            <p className="mt-2 font-sans text-sm text-ink/60">
              Charge the right amount when a tenant moves in or out
              mid-month.
            </p>
          </Link>
          <Link
            href="/late-fee-calculator"
            className="card-flat rounded-2xl bg-white p-7 transition-colors hover:border-moss"
          >
            <h3 className="font-serif text-lg font-bold">
              Late Rent Fee Calculator
            </h3>
            <p className="mt-2 font-sans text-sm text-ink/60">
              Work out a flat, percentage, or per-day late fee after the
              grace period.
            </p>
          </Link>
        </div>
        <Link
          href="/tools"
          className="mt-7 inline-block font-sans text-sm font-semibold text-moss hover:underline"
        >
          View all tools →
        </Link>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20">
        <h2 className="font-serif text-3xl font-bold tracking-tight">
          Built for the paperwork side of being a landlord
        </h2>
        <p className="mt-3 max-w-2xl font-sans text-ink/60">
          Landlord Tools is a small, focused set of calculators and
          document generators — not a listing platform or a leasing
          service. Everything runs in your browser; nothing you enter is
          uploaded or stored.
        </p>
      </section>
    </div>
  );
}
