import type { Metadata } from "next";
import Link from "next/link";
import RentLedger from "@/components/RentLedger";
import { toolJsonLd } from "@/lib/tool-schema";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Free Rent Ledger & Payment Tracker",
  description:
    "Track every rent payment for a tenancy and export a clean PDF rent ledger — free, no signup, saved in your browser. A running payment history for landlords and tenants.",
  alternates: { canonical: "/rent-ledger" },
};

export default function RentLedgerPage() {
  const jsonLd = toolJsonLd("Rent Ledger & Payment Tracker", "/rent-ledger");

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
        Rent Ledger &amp; Payment Tracker
      </h1>
      <p className="mt-3 max-w-2xl font-sans text-ink/70">
        Log every rent payment for a tenancy and download a clean PDF ledger
        whenever you need it. No account, no monthly fee — your ledger is
        saved in your browser and nothing is uploaded.
      </p>
      <div className="mt-8">
        <RentLedger />
      </div>

      <div className="mt-16 max-w-3xl space-y-4 font-sans text-sm text-ink/80">
        <h2 className="font-serif text-2xl font-bold text-ink">
          Why keep a rent ledger
        </h2>
        <p>
          A rent ledger is simply a dated record of every payment a tenant
          makes over a tenancy. It sounds basic, but it&apos;s the document
          that settles arguments: whether rent was paid on time, how much is
          still owed, and what a security-deposit deduction for unpaid rent
          should actually be. If a dispute ever reaches small claims, a clear
          payment history is exactly what a judge wants to see.
        </p>
        <p>
          Most property-management apps put rent tracking behind a signup or a
          monthly subscription. This one is free and runs entirely in your
          browser — add each payment as it comes in, and export the full
          ledger as a PDF whenever you need a copy. Pair it with the{" "}
          <Link href="/rent-receipt-generator" className="underline hover:text-moss">
            rent receipt generator
          </Link>{" "}
          to give tenants a receipt for each payment you log.
        </p>
      </div>
      <Disclaimer />
    </div>
  );
}
