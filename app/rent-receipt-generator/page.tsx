import type { Metadata } from "next";
import RentReceipt from "@/components/RentReceipt";
import { toolJsonLd } from "@/lib/tool-schema";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Free Rent Receipt Generator",
  description:
    "Generate a free rent payment receipt as a PDF in seconds — landlord, tenant, property, amount, method, and balance due, ready to print or email.",
  alternates: { canonical: "/rent-receipt-generator" },
};

export default function RentReceiptPage() {
  const jsonLd = toolJsonLd("Rent Receipt Generator", "/rent-receipt-generator");

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
        Rent Receipt Generator
      </h1>
      <p className="mt-3 max-w-2xl font-sans text-ink/70">
        Create a clean, dated rent payment receipt in under a minute and
        download it as a PDF to print, email, or text to a tenant.
      </p>
      <div className="mt-8">
        <RentReceipt />
      </div>
      <div className="mt-16 max-w-3xl space-y-4 font-sans text-sm text-ink/80">
        <h2 className="font-serif text-2xl font-bold text-ink">
          Why landlords should issue rent receipts
        </h2>
        <p>
          A handful of states legally require a written receipt whenever
          rent is paid in cash, and many tenants simply ask for one to keep
          for their own records (some need it for subsidized housing,
          taxes, or a future rental application). Beyond that, a receipt
          for every payment gives both sides a clear, dated record if a
          payment amount or date is ever disputed.
        </p>
        <p>
          Keep a copy of every receipt you generate — together they form a
          complete rent ledger for the tenancy, useful if you ever need to
          show a payment history in a dispute or a court filing.
        </p>
      </div>
      <Disclaimer />
    </div>
  );
}
