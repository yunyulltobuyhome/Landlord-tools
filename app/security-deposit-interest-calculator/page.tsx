import type { Metadata } from "next";
import Link from "next/link";
import InterestCalculator from "@/components/InterestCalculator";
import { toolJsonLd } from "@/lib/tool-schema";
import Disclaimer from "@/components/Disclaimer";
import { statesData } from "@/lib/states-data";
import { SITE_URL } from "@/lib/site";

const year = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Security Deposit Interest Calculator by State (${year})`,
  description:
    "Calculate the interest a landlord owes on a security deposit. State-aware, with an editable rate so it never goes stale, plus simple vs. compound interest and statute references. Free.",
  alternates: { canonical: "/security-deposit-interest-calculator" },
};

export default function InterestCalculatorPage() {
  const jsonLd = toolJsonLd(
    "Security Deposit Interest Calculator",
    "/security-deposit-interest-calculator"
  );

  const interestStates = statesData.filter((s) => s.interestRequired);

  const faqs = [
    {
      q: "Which states require interest on security deposits?",
      a: `${interestStates.length} states plus the District of Columbia require landlords to pay interest on held security deposits, including ${interestStates
        .slice(0, 6)
        .map((s) => s.name)
        .join(", ")}, and others. Each state's rule and rate differ.`,
    },
    {
      q: "How is security deposit interest calculated?",
      a: "Most states use simple interest: deposit × annual rate × number of years held. A few reference the rate actually earned in the account instead. This calculator shows both simple and (for comparison) compound interest, and lets you enter the exact current rate for your state.",
    },
    {
      q: "Why does this calculator let me enter the rate myself?",
      a: "Because in most states the required rate is tied to a bank or U.S. Treasury index and changes every year — a hardcoded rate quickly becomes wrong. Where a fixed statutory rate exists (e.g., Massachusetts and Ohio at 5%), it is prefilled; otherwise you enter the current figure so the result is accurate.",
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
        Free tool · {year}
      </p>
      <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">
        Security Deposit Interest Calculator
      </h1>
      <p className="mt-3 max-w-2xl font-sans text-ink/70">
        Work out the interest a landlord owes on a security deposit in states
        that require it. Enter the deposit, the dates it was held, and the
        rate — the statutory rate is prefilled where one is fixed, and
        editable everywhere else so your result is never based on a stale
        number.
      </p>
      <div className="mt-8">
        <InterestCalculator />
      </div>

      <div className="mt-16 max-w-3xl space-y-4 font-sans text-sm text-ink/80">
        <h2 className="font-serif text-2xl font-bold text-ink">
          How security deposit interest works
        </h2>
        <p>
          A number of states require landlords to hold security deposits in a
          way that earns interest and to pay that interest to the tenant —
          either annually or when the deposit is returned. The mechanics vary:
          some states set a fixed rate in the statute, while most tie it to a
          bank passbook rate or a U.S. Treasury index that is republished each
          year. That&apos;s exactly why a calculator with a hardcoded rate
          tends to be wrong within a year — this one prefills a rate only
          where it&apos;s genuinely fixed and otherwise asks you for the
          current figure.
        </p>
        <p>
          Most statutes specify <strong>simple</strong> interest (deposit ×
          rate × years). We show a compound figure alongside it only for
          comparison. For the precise rule and rate in your state, open your
          state&apos;s page:
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {interestStates.map((s) => (
            <Link
              key={s.slug}
              href={`/state/${s.slug}`}
              className="rounded-lg border border-line bg-white px-3 py-1.5 font-sans text-sm transition-colors hover:border-moss hover:text-moss"
            >
              {s.name}
            </Link>
          ))}
        </div>
      </div>

      <section className="mt-14 max-w-3xl">
        <h2 className="font-serif text-2xl font-bold text-ink">
          Security deposit interest FAQ
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
        <p className="mt-6 font-sans text-sm text-ink/60">
          Calculating a full refund?{" "}
          <a href={`${SITE_URL}/calculator`} className="font-semibold text-moss underline">
            Use the security deposit calculator →
          </a>
        </p>
      </section>
      <Disclaimer />
    </div>
  );
}
