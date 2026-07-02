import type { Metadata } from "next";
import LateFeeCalculator from "@/components/LateFeeCalculator";
import { toolJsonLd } from "@/lib/tool-schema";

export const metadata: Metadata = {
  title: "Late Rent Fee Calculator",
  description:
    "Calculate a late rent fee — flat amount, percentage of rent, or per-day charge — after a grace period. Free, instant, no signup.",
  alternates: { canonical: "/late-fee-calculator" },
};

export default function LateFeeCalculatorPage() {
  const jsonLd = toolJsonLd("Late Rent Fee Calculator", "/late-fee-calculator");

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
        Free tool
      </p>
      <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">
        Late Rent Fee Calculator
      </h1>
      <p className="mt-3 max-w-2xl font-sans text-ink/70">
        Work out how much late fee to charge — as a flat amount, a
        percentage of rent, or a per-day charge — once the grace period in
        the lease has passed.
      </p>
      <div className="mt-8">
        <LateFeeCalculator />
      </div>
      <div className="mt-16 max-w-3xl space-y-4 font-sans text-sm text-ink/80">
        <h2 className="font-serif text-2xl font-bold text-ink">
          What makes a late fee enforceable
        </h2>
        <p>
          Late fees are generally enforceable when they are written into the
          lease, apply only after any grace period the lease grants, and
          are a reasonable estimate of the cost of late payment rather than
          a punitive penalty. A handful of states cap late fees explicitly
          (often a flat dollar amount or a percentage of rent); most leave
          &quot;reasonableness&quot; to be worked out between landlord and
          tenant, or decided case-by-case if disputed.
        </p>
        <p>
          If your lease doesn&apos;t already specify a late fee structure,
          add one before you need it — courts are far more likely to
          enforce a fee that both parties agreed to in writing up front
          than one introduced after the fact.
        </p>
      </div>
    </div>
  );
}
