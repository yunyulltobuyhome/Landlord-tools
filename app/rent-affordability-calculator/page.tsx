import type { Metadata } from "next";
import Link from "next/link";
import AffordabilityCalculator from "@/components/AffordabilityCalculator";
import { toolJsonLd } from "@/lib/tool-schema";

export const metadata: Metadata = {
  title: "How Much Rent Can I Afford?",
  description:
    "Find the rent you can afford on your income, and check whether you'd pass a landlord's 3x-rent or 40x-annual income screening. Free calculator, no signup.",
  alternates: { canonical: "/rent-affordability-calculator" },
};

export default function AffordabilityPage() {
  const jsonLd = toolJsonLd(
    "Rent Affordability Calculator",
    "/rent-affordability-calculator"
  );

  const faqs = [
    {
      q: "How much of my income should go to rent?",
      a: "The common guideline is no more than 30% of gross (pre-tax) income. HUD considers households paying more than 30% of income on housing to be cost burdened, and more than 50% severely cost burdened. In expensive cities many renters exceed 30% by necessity, which is why this calculator lets you model 20% through 45%.",
    },
    {
      q: "What income do landlords require to rent an apartment?",
      a: "Most landlords and property managers require gross monthly income of at least 3 times the monthly rent, though some accept 2.5x and stricter buildings ask 3.5x. In New York and some other markets the same test is expressed as annual income of 40 times the monthly rent.",
    },
    {
      q: "How much do I need to make to afford $2,000 rent?",
      a: "Under the 30% guideline you'd want roughly $6,667 gross per month ($80,000 a year). To pass a typical 3x-rent landlord screening you'd need at least $6,000 gross per month, or $80,000 a year under the 40x annual rule. Enter your own numbers above to check any rent.",
    },
    {
      q: "What if my income doesn't meet the landlord's requirement?",
      a: "Landlords commonly accept alternatives: a co-signer or guarantor, proof of significant savings, several months of rent prepaid where lawful, or a larger security deposit where state law permits it. Deposit limits vary by state — check your state's cap before agreeing to a larger deposit.",
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
        How much rent can I afford?
      </h1>
      <p className="mt-3 max-w-2xl font-sans text-ink/70">
        Two answers in one place: the rent your income comfortably supports,
        and — the part most calculators skip — whether you&apos;d actually
        pass a landlord&apos;s income screening for a specific apartment.
      </p>
      <div className="mt-8">
        <AffordabilityCalculator />
      </div>

      <div className="mt-16 max-w-3xl space-y-4 font-sans text-sm text-ink/80">
        <h2 className="font-serif text-2xl font-bold text-ink">
          Affording rent vs. qualifying for it
        </h2>
        <p>
          These are two different questions, and renters get tripped up by the
          gap between them. <strong>Affording</strong> rent is a budgeting
          question — the 30%-of-gross-income guideline, adjusted for your debt
          payments and what you need left over each month.{" "}
          <strong>Qualifying</strong> is a screening question: the landlord
          applies a hard rule, usually gross monthly income of at least 3× the
          rent (or annual income of 40× the monthly rent), and you either clear
          it or you don&apos;t.
        </p>
        <p>
          You can comfortably afford a rent and still fail the screening, or
          clear the screening on a rent that would leave you stretched. That&apos;s
          why this tool shows both — so you can search for apartments you will
          actually be approved for.
        </p>
        <h2 className="font-serif text-2xl font-bold text-ink">
          Budget for the costs beyond rent
        </h2>
        <p>
          Rent is rarely the whole number. Before signing, account for the
          security deposit (often one month&apos;s rent, and capped by state
          law), any application or pet fees, utilities not included in rent,
          renters insurance if the lease requires it, and moving costs. If
          you&apos;re moving in partway through a month, the{" "}
          <Link href="/prorated-rent-calculator" className="underline hover:text-moss">
            prorated rent calculator
          </Link>{" "}
          works out that first partial payment, and if you&apos;re splitting
          with roommates, the{" "}
          <Link href="/rent-split-calculator" className="underline hover:text-moss">
            rent split calculator
          </Link>{" "}
          divides it fairly.
        </p>
        <p>
          Curious how much of a deposit a landlord can legally ask for where
          you live? See the{" "}
          <Link href="/state" className="underline hover:text-moss">
            security deposit limits by state
          </Link>
          .
        </p>
      </div>

      <section className="mt-14 max-w-3xl">
        <h2 className="font-serif text-2xl font-bold text-ink">
          Rent affordability FAQ
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
