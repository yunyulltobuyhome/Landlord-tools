import type { Metadata } from "next";
import Link from "next/link";
import ExpenseTracker from "@/components/ExpenseTracker";
import { toolJsonLd } from "@/lib/tool-schema";

export const metadata: Metadata = {
  title: "Rental Property Expense Tracker",
  description:
    "Track rental property expenses by IRS Schedule E category and export a clean PDF summary for your accountant. Free, no signup, saved in your browser.",
  alternates: { canonical: "/rental-expense-tracker" },
};

export default function ExpenseTrackerPage() {
  const jsonLd = toolJsonLd(
    "Rental Property Expense Tracker",
    "/rental-expense-tracker"
  );

  const faqs = [
    {
      q: "What expenses can a landlord write off?",
      a: "Landlords commonly record advertising, cleaning and maintenance, insurance, legal and professional fees, management fees, mortgage interest, repairs, supplies, property taxes, utilities they pay, and depreciation. Each maps to a line on IRS Schedule E. Whether a specific cost is deductible in your situation depends on your circumstances — confirm it with a tax professional.",
    },
    {
      q: "What form do landlords report rental income on?",
      a: "Rental income and expenses for most individual landlords are reported on Schedule E (Form 1040), Part I. This tracker is organized by those exact expense lines so the totals line up with what your preparer needs.",
    },
    {
      q: "What's the difference between a repair and an improvement?",
      a: "Repairs keep the property in working order — fixing a leak, patching drywall, replacing a broken part — and are generally expensed in the year they happen. Improvements that add value or extend the property's life are usually capitalized and depreciated over time instead. The line between them is a common source of confusion, so it's worth asking your tax preparer about anything large.",
    },
    {
      q: "How long should I keep receipts for rental expenses?",
      a: "Keep receipts, invoices, and bank records that support what you claimed. The IRS can generally examine a return for three years, and longer in some situations, so many landlords keep rental records for at least seven years.",
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
        Free tool
      </p>
      <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">
        Rental Property Expense Tracker
      </h1>
      <p className="mt-3 max-w-2xl font-sans text-ink/70">
        Every rental expense category, organized by the IRS Schedule E line it
        belongs to. Enter what you spent, see the running total, and export a
        clean PDF summary to hand your accountant at tax time.
      </p>
      <div className="mt-8">
        <ExpenseTracker />
      </div>

      <div className="mt-16 max-w-3xl space-y-4 font-sans text-sm text-ink/80">
        <h2 className="font-serif text-2xl font-bold text-ink">
          A worksheet, not another checklist
        </h2>
        <p>
          Search for rental deductions and you&apos;ll find plenty of articles
          listing what landlords can write off. What&apos;s missing is somewhere
          to actually put the numbers. This tracker takes the same categories
          and makes them usable: enter amounts as they come up through the year,
          and the totals stay grouped by the Schedule E line your preparer will
          need them under.
        </p>
        <p>
          Everything is saved in your browser, so you can add expenses as they
          happen rather than reconstructing the year each January. Nothing is
          uploaded and there&apos;s no account to create.
        </p>
        <p>
          Keeping the supporting records is just as important as the totals. The{" "}
          <Link href="/rent-ledger" className="underline hover:text-moss">
            rent ledger
          </Link>{" "}
          gives you the income side of the picture, and the{" "}
          <Link href="/rent-receipt-generator" className="underline hover:text-moss">
            rent receipt generator
          </Link>{" "}
          documents each payment you collected.
        </p>
        <p className="text-xs text-ink/50">
          This tool organizes figures you enter and provides general
          information, not tax or legal advice. Landlord Tools is not an
          accounting firm or a law firm, and using this tool does not create a
          professional relationship. Deductibility depends on your specific
          circumstances — have a qualified tax professional review your return.
        </p>
      </div>

      <section className="mt-14 max-w-3xl">
        <h2 className="font-serif text-2xl font-bold text-ink">
          Rental expense FAQ
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
