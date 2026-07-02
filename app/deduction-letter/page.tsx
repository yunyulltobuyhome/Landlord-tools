import type { Metadata } from "next";
import DeductionLetter from "@/components/DeductionLetter";
import { toolJsonLd } from "@/lib/tool-schema";

export const metadata: Metadata = {
  title: "Itemized Security Deposit Deduction Letter Generator",
  description:
    "Create a free itemized security deposit deduction statement and download it as a PDF — built to match state notice requirements after a tenant moves out.",
  alternates: { canonical: "/deduction-letter" },
};

export default function DeductionLetterPage() {
  const jsonLd = toolJsonLd(
    "Itemized Security Deposit Deduction Letter Generator",
    "/deduction-letter"
  );

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
        Itemized Deduction Letter Generator
      </h1>
      <p className="mt-3 max-w-2xl font-sans text-ink/70">
        Fill in the deposit amount and any deductions to generate a clean,
        printable PDF statement you can mail or email to a former tenant.
      </p>
      <div className="mt-8">
        <DeductionLetter />
      </div>
      <div className="mt-16 max-w-3xl space-y-4 font-sans text-sm text-ink/80">
        <h2 className="font-serif text-2xl font-bold text-ink">
          Why an itemized statement matters
        </h2>
        <p>
          Nearly every state requires landlords to explain any deposit
          deduction in writing, usually within the same deadline as the
          refund itself. Landlords who withhold money without sending an
          itemized statement risk losing the right to keep any of the
          deposit — regardless of how legitimate the damage was.
        </p>
        <p>
          This generator produces a simple, dated statement listing the
          original deposit, each deduction, and the balance due back to the
          tenant, with a citation to your state&apos;s deposit statute. Pair
          it with photos of the unit&apos;s condition and receipts for any
          repairs to support your accounting if it&apos;s ever disputed.
        </p>
        <p>
          Not sure whether something is a fair deduction or just normal wear
          and tear? See our{" "}
          <a
            href="/can-a-landlord-charge-for"
            className="underline hover:text-moss"
          >
            wear and tear vs. damage guide
          </a>{" "}
          for the most-disputed items — carpet, paint, cleaning, pet damage,
          and more.
        </p>
      </div>
    </div>
  );
}
