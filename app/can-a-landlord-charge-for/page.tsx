import type { Metadata } from "next";
import Link from "next/link";
import { deductionsData } from "@/lib/deductions-data";

export const metadata: Metadata = {
  title: "Normal Wear and Tear vs. Damage: What a Landlord Can Charge For",
  description:
    "A plain-English guide to what counts as normal wear and tear versus tenant damage — carpet, paint, nail holes, cleaning, pets, and more — and what a landlord can deduct from a security deposit.",
  alternates: { canonical: "/can-a-landlord-charge-for" },
};

export default function DeductionsIndexPage() {
  const verdictStyle: Record<string, string> = {
    "Usually normal wear and tear": "text-moss",
    "Often a valid deduction": "text-clay",
    "It depends": "text-gold",
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
        Guide
      </p>
      <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">
        Normal wear and tear vs. damage
      </h1>
      <p className="mt-3 max-w-2xl font-sans text-ink/70">
        The most common security-deposit disputes come down to one question:
        is this normal wear and tear, or is it damage the tenant can be
        charged for? Here&apos;s where the line usually falls for the things
        landlords and tenants argue about most.
      </p>

      <div className="mt-8 space-y-3">
        {deductionsData.map((d) => (
          <Link
            key={d.slug}
            href={`/can-a-landlord-charge-for/${d.slug}`}
            className="card-flat flex items-center justify-between gap-4 rounded-2xl bg-white p-5 transition-colors hover:border-moss"
          >
            <div>
              <h2 className="font-serif text-lg font-bold">{d.question}</h2>
              <p className="mt-1 font-sans text-sm text-ink/60">
                {d.shortAnswer}
              </p>
            </div>
            <span
              className={`shrink-0 font-sans text-xs font-bold uppercase tracking-widest ${
                verdictStyle[d.verdict] ?? "text-ink"
              }`}
            >
              {d.verdict.split(" ")[0]}
            </span>
          </Link>
        ))}
      </div>

      <section className="mt-14 max-w-3xl space-y-4 font-sans text-sm leading-relaxed text-ink/80">
        <h2 className="font-serif text-2xl font-bold text-ink">
          The general rule
        </h2>
        <p>
          Normal wear and tear is the natural deterioration that happens when
          someone lives in a home normally — faded paint, light carpet
          matting, minor scuffs, small nail holes. Landlords are expected to
          absorb it as a cost of doing business and generally cannot deduct
          for it. Damage is harm beyond that: things caused by accident,
          neglect, abuse, or a pet, which a tenant can be charged to repair.
        </p>
        <p>
          Two ideas make almost every deduction defensible: <strong>useful
          life</strong> (you charge for the value a tenant destroyed, prorated
          for age — not a brand-new replacement of something already worn) and{" "}
          <strong>documentation</strong> (move-in and move-out photos plus an
          itemized statement). When you can show both, deductions hold up; when
          you can&apos;t, tenants win.
        </p>
        <p>
          Ready to put it in writing? Use the{" "}
          <Link href="/deduction-letter" className="underline hover:text-moss">
            itemized deduction letter generator
          </Link>{" "}
          and the{" "}
          <Link href="/calculator" className="underline hover:text-moss">
            security deposit calculator
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
