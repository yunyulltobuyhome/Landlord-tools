import type { Metadata } from "next";
import Link from "next/link";
import RentIncreaseCalculator from "@/components/RentIncreaseCalculator";
import { toolJsonLd } from "@/lib/tool-schema";

export const metadata: Metadata = {
  title: "Rent Increase Calculator",
  description:
    "Work out a new rent after an increase, check it against your state's cap, and see how much written notice is required and when the new rent can start. Free, no signup.",
  alternates: { canonical: "/rent-increase-calculator" },
};

export default function RentIncreasePage() {
  const jsonLd = toolJsonLd("Rent Increase Calculator", "/rent-increase-calculator");

  const faqs = [
    {
      q: "How much can a landlord raise the rent?",
      a: "In most states there is no statewide cap: at the end of a lease term a landlord can raise the rent by any amount, provided proper written notice is given and the increase is not retaliatory or discriminatory. Only Oregon and California have statewide caps, and a number of cities impose local rent control even where the state does not.",
    },
    {
      q: "How much notice does a landlord have to give before raising rent?",
      a: "Most states require at least 30 days' written notice for a month-to-month tenancy. Some require more for larger increases — California, for example, requires 90 days when the increase is more than 10%, and Oregon requires 90 days. Rent generally cannot be raised mid-lease unless the lease itself allows it.",
    },
    {
      q: "Can a landlord raise rent in the middle of a lease?",
      a: "Generally no. A fixed-term lease locks the rent for its duration, so an increase normally takes effect at renewal or during a month-to-month tenancy. The exception is a lease that expressly permits a mid-term adjustment.",
    },
    {
      q: "What can I do if a rent increase seems illegal?",
      a: "Check whether your state or city caps increases, whether the required notice period was honored, and whether the increase followed a complaint or repair request (which may make it retaliatory). If something looks wrong, your local housing authority or a tenant-rights organization is the right place to start.",
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
    <div className="mx-auto max-w-5xl px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
        Free tool
      </p>
      <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">
        Rent Increase Calculator
      </h1>
      <p className="mt-3 max-w-2xl font-sans text-ink/70">
        Calculate the new rent after an increase — then check it against your
        state&apos;s cap, see how much written notice is required, and find the
        earliest date the new rent can take effect. Useful whether you&apos;re
        the landlord setting the increase or the tenant checking it.
      </p>
      <div className="mt-8">
        <RentIncreaseCalculator />
      </div>

      <div className="mt-16 max-w-3xl space-y-4 font-sans text-sm text-ink/80">
        <h2 className="font-serif text-2xl font-bold text-ink">
          What actually limits a rent increase
        </h2>
        <p>
          Three things decide whether an increase is allowed: <strong>the
          lease</strong> (rent normally can&apos;t change mid-term),{" "}
          <strong>notice</strong> (a written notice period, usually at least 30
          days), and <strong>any cap</strong> that applies where the property
          is. Most calculators only do the arithmetic and stop there — the
          percentage is the easy part, and it&apos;s the notice and cap rules
          that decide whether the increase actually sticks.
        </p>
        <p>
          Statewide caps are rarer than people assume. Oregon and California are
          the two states with one, and both express it as a formula tied to
          local CPI rather than a flat number, which is why this tool asks you
          for the current CPI instead of burying a figure that goes stale within
          a year. Everywhere else, the limit comes from local rent control if
          your city has it — so a &quot;no statewide cap&quot; answer is not the
          same as &quot;no limit&quot;.
        </p>
        <p>
          Looking at the wider picture for your state? The{" "}
          <Link href="/state" className="underline hover:text-moss">
            state-by-state rental law guide
          </Link>{" "}
          covers deposits, deadlines, and penalties, and the{" "}
          <Link href="/prorated-rent-calculator" className="underline hover:text-moss">
            prorated rent calculator
          </Link>{" "}
          handles the partial month when an increase lands mid-cycle.
        </p>
        <p className="text-xs text-ink/50">
          This tool provides general information and estimates, not legal
          advice, and Landlord Tools is not a law firm. Rent-increase rules vary
          by state and by city and change over time — confirm the current rules
          for your location, or consult a licensed attorney or your local
          housing authority, before relying on any result.
        </p>
      </div>

      <section className="mt-14 max-w-3xl">
        <h2 className="font-serif text-2xl font-bold text-ink">
          Rent increase FAQ
        </h2>
        <div className="mt-5 space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="card-flat rounded-2xl bg-white p-5 [&_summary]:cursor-pointer"
            >
              <summary className="font-serif text-base font-bold">{f.q}</summary>
              <p className="mt-2 font-sans text-sm text-ink/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
