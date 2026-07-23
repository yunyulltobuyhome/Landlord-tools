import type { Metadata } from "next";
import Link from "next/link";
import RentSplitCalculator from "@/components/RentSplitCalculator";
import { toolJsonLd } from "@/lib/tool-schema";

export const metadata: Metadata = {
  title: "Rent Split Calculator (Free) — By Income, Room Size, or Equal",
  description:
    "Split rent fairly between roommates — equally, by income, by room size, or a weighted blend of both. Add utilities, get each person's share instantly, and copy a summary to share. Free, no signup.",
  alternates: { canonical: "/rent-split-calculator" },
};

export default function RentSplitPage() {
  const jsonLd = toolJsonLd("Rent Split Calculator", "/rent-split-calculator");

  const faqs = [
    {
      q: "How should roommates split rent fairly?",
      a: "There's no single right answer — common methods are splitting equally, in proportion to each person's income, or in proportion to the size of each bedroom. Many households blend income and room size, which this calculator supports with an adjustable weight.",
    },
    {
      q: "How do you split rent by income?",
      a: "Add up everyone's income, then each person pays the same share of the rent as their share of the total income. If two roommates earn $4,000 and $2,000, they'd pay two-thirds and one-third of the rent respectively.",
    },
    {
      q: "Should utilities be split the same way as rent?",
      a: "It's up to you. Many roommates split rent by room size or income but share utilities equally, since everyone uses them. This calculator lets you split utilities equally while still applying your chosen method to the rent.",
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
      <p className="font-sans text-xs font-bold uppercase tracking-widest text-clay">
        Free tool · for renters
      </p>
      <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">
        Rent Split Calculator
      </h1>
      <p className="mt-3 max-w-2xl font-sans text-ink/70">
        Divide rent between roommates the fair way — split it equally, by
        income, by room size, or a weighted blend of income and room size that
        most calculators don&apos;t offer. Add shared utilities and copy a
        clean summary to settle it in the group chat.
      </p>
      <div className="mt-8">
        <RentSplitCalculator />
      </div>

      <div className="mt-16 max-w-3xl space-y-4 font-sans text-sm text-ink/80">
        <h2 className="font-serif text-2xl font-bold text-ink">
          Fair ways to split rent with roommates
        </h2>
        <p>
          An equal split is simplest, but it isn&apos;t always fair — a
          roommate with the big bedroom and en-suite, or one who earns far
          more, often ends up feeling like the numbers are off. The two most
          popular alternatives are splitting by <strong>room size</strong> (the
          bigger your private space, the more you pay) and by{" "}
          <strong>income</strong> (you pay in proportion to what you earn). The
          fairest answer for many households is a mix of the two, which is why
          this calculator lets you weight income and room size together.
        </p>
        <p>
          Whatever you choose, agreeing on the method up front — and writing it
          down — prevents most roommate money friction. If you&apos;re also
          moving in mid-month, the{" "}
          <Link href="/prorated-rent-calculator" className="underline hover:text-moss">
            prorated rent calculator
          </Link>{" "}
          works out the partial first month, and the{" "}
          <Link href="/rent-receipt-generator" className="underline hover:text-moss">
            rent receipt generator
          </Link>{" "}
          gives everyone a record of what they paid.
        </p>
      </div>

      <section className="mt-14 max-w-3xl">
        <h2 className="font-serif text-2xl font-bold text-ink">
          Splitting rent FAQ
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
