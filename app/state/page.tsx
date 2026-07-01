import type { Metadata } from "next";
import Link from "next/link";
import { statesData } from "@/lib/states-data";

export const metadata: Metadata = {
  title: "Security Deposit Laws by State",
  description:
    "Deposit limits, return deadlines, interest rules, and penalties for landlords in all 50 states plus Washington, D.C.",
  alternates: { canonical: "/state" },
};

export default function StateIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <p className="font-sans text-xs font-bold uppercase tracking-widest text-clay">
        Reference
      </p>
      <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">
        Security Deposit Laws by State
      </h1>
      <p className="mt-3 max-w-2xl font-sans text-ink/70">
        Deposit caps, refund deadlines, interest requirements, and
        penalties for late or improper withholding — summarized for every
        state. Select yours for full details.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {statesData.map((s) => (
          <Link
            key={s.slug}
            href={`/state/${s.slug}`}
            className="card-flat flex items-center justify-between bg-white px-4 py-3 font-sans text-sm font-medium hover:bg-sand"
          >
            {s.name}
            <span className="text-ink/40">{s.abbr}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
