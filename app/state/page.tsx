import type { Metadata } from "next";
import Link from "next/link";
import { statesData } from "@/lib/states-data";
import { SITE_URL } from "@/lib/site";
import StateComparisonTable from "@/components/StateComparisonTable";

export const metadata: Metadata = {
  title: `Security Deposit Laws by State (${new Date().getFullYear()})`,
  description:
    "Compare security deposit laws in all 50 states plus Washington, D.C. — deposit limits, return deadlines, interest requirements, and statute citations in one searchable table.",
  alternates: { canonical: "/state" },
};

export default function StateIndexPage() {
  const year = new Date().getFullYear();

  const interestStates = statesData.filter((s) => s.interestRequired).length;

  const faqs = [
    {
      q: "How long does a landlord have to return a security deposit?",
      a: "It depends on the state — deadlines in this table range from 14 to 60 days after move-out. Most states fall between 21 and 45 days, and many require an itemized statement of deductions within the same window.",
    },
    {
      q: "Which states require interest on security deposits?",
      a: `${interestStates} states plus the District of Columbia require landlords to pay interest on held security deposits (rules and rates vary). Select a state to see its specific interest requirement.`,
    },
    {
      q: "Can a landlord keep a security deposit for normal wear and tear?",
      a: "No. Across states, deductions must be for damage beyond ordinary wear and tear, unpaid rent, or other charges allowed by the lease and statute — not for routine aging like minor scuffs or worn carpet.",
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
        Reference · {year}
      </p>
      <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">
        Security Deposit Laws by State
      </h1>
      <p className="mt-3 max-w-2xl font-sans text-ink/70">
        Deposit caps, refund deadlines, interest requirements, and statute
        citations for all 50 states plus Washington, D.C. — in one place.
        Search the table below or open a state for the full guide and a
        refund calculator set to its rules.
      </p>

      <div className="mt-8">
        <StateComparisonTable />
      </div>

      <p className="mt-4 font-sans text-xs text-ink/50">
        Figures reflect general statewide rules as of {year} and exclude
        city/county ordinances, which can be stricter. Each state page cites
        the underlying statute — verify there before relying on any figure.
      </p>

      <section className="mt-14">
        <h2 className="font-serif text-2xl font-bold">
          Security deposit law FAQ
        </h2>
        <div className="mt-5 space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="card-flat rounded-2xl bg-white p-5 [&_summary]:cursor-pointer"
            >
              <summary className="font-serif text-base font-bold">
                {f.q}
              </summary>
              <p className="mt-2 font-sans text-sm text-ink/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-2xl font-bold">Popular states</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {statesData
            .filter((s) =>
              [
                "california",
                "new-york",
                "texas",
                "florida",
                "massachusetts",
                "illinois",
                "georgia",
                "washington",
              ].includes(s.slug)
            )
            .map((s) => (
              <Link
                key={s.slug}
                href={`/state/${s.slug}`}
                className="rounded-lg border border-line bg-white px-3 py-1.5 font-sans text-sm transition-colors hover:border-moss hover:text-moss"
              >
                {s.name}
              </Link>
            ))}
        </div>
        <p className="mt-6 font-sans text-sm text-ink/60">
          Need to calculate a specific refund?{" "}
          <a
            href={`${SITE_URL}/calculator`}
            className="font-semibold text-moss underline"
          >
            Open the deposit calculator →
          </a>
        </p>
      </section>
    </div>
  );
}
