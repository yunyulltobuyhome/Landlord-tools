import type { Metadata } from "next";
import Calculator from "@/components/Calculator";

export const metadata: Metadata = {
  title: "Security Deposit Return Calculator",
  description:
    "Calculate how much security deposit to return a tenant, the legal refund deadline in your state, and any interest owed — free, no signup.",
  alternates: { canonical: "/calculator" },
};

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <p className="font-sans text-xs font-bold uppercase tracking-widest text-clay">
        Free tool
      </p>
      <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">
        Security Deposit Return Calculator
      </h1>
      <p className="mt-3 max-w-2xl font-sans text-ink/70">
        Enter the deposit amount, move-out date, and any deductions to see
        the refund due, the legal deadline for your state, and (where
        required) interest owed to the tenant.
      </p>
      <div className="mt-8">
        <Calculator />
      </div>
      <div className="mt-16 max-w-3xl space-y-4 font-sans text-sm text-ink/80">
        <h2 className="font-serif text-2xl font-bold text-ink">
          How landlords should calculate a security deposit refund
        </h2>
        <p>
          Most states require landlords to return a tenant&apos;s security
          deposit — or a written, itemized list of deductions — within a
          fixed number of days after move-out. Missing that deadline, or
          withholding money without an itemized reason, can expose a
          landlord to penalties well beyond the deposit itself, including
          double or triple damages in some states.
        </p>
        <p>
          This calculator applies your state&apos;s statutory deadline and
          (where applicable) interest requirements to your numbers, then
          shows the exact refund amount and due date. It is meant to help
          you move quickly and correctly after a tenant moves out — it
          does not replace reviewing your state&apos;s statute or, for
          contested amounts, talking to a local attorney.
        </p>
      </div>
    </div>
  );
}
