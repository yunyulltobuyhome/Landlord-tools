import type { Metadata } from "next";
import ProratedRentCalculator from "@/components/ProratedRentCalculator";

export const metadata: Metadata = {
  title: "Prorated Rent Calculator",
  description:
    "Calculate prorated rent for a partial month when a tenant moves in or out mid-month — free, instant, no signup.",
  alternates: { canonical: "/prorated-rent-calculator" },
};

export default function ProratedRentPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <p className="font-sans text-xs font-bold uppercase tracking-widest text-clay">
        Free tool
      </p>
      <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">
        Prorated Rent Calculator
      </h1>
      <p className="mt-3 max-w-2xl font-sans text-ink/70">
        Figure out exactly how much rent to charge for a partial month when
        a tenant&apos;s lease starts or ends mid-month.
      </p>
      <div className="mt-8">
        <ProratedRentCalculator />
      </div>
      <div className="mt-16 max-w-3xl space-y-4 font-sans text-sm text-ink/80">
        <h2 className="font-serif text-2xl font-bold text-ink">
          How rent proration works
        </h2>
        <p>
          When a tenant moves in or out partway through a month, most
          landlords charge rent only for the days the unit is actually
          occupied. The most common method divides the monthly rent by the
          actual number of days in that calendar month to get a daily rate,
          then multiplies that rate by the number of days owed.
        </p>
        <p>
          Some leases instead use a flat 30-day month for every proration
          calculation, which gives a slightly different daily rate in
          months with 28, 29, or 31 days. Check your lease for a proration
          clause before billing a tenant — if the lease is silent, the
          actual-days-in-month method used here is the most defensible
          default.
        </p>
      </div>
    </div>
  );
}
