import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Landlord Tools & Calculators",
  description:
    "All of Landlord Tools' free calculators and document generators in one place: security deposits, prorated rent, late fees, move-in/move-out checklists, and rent receipts.",
  alternates: { canonical: "/tools" },
};

const tools = [
  {
    href: "/move-out-packet",
    name: "Move-Out Packet (all-in-one)",
    description:
      "Calculator + itemized deduction letter + photo condition report, combined into one PDF.",
  },
  {
    href: "/calculator",
    name: "Security Deposit Calculator",
    description:
      "Refund amount, legal deadline, and interest owed by state.",
  },
  {
    href: "/security-deposit-interest-calculator",
    name: "Security Deposit Interest Calculator",
    description:
      "Interest a landlord owes on a deposit, with an editable, never-stale rate.",
  },
  {
    href: "/deduction-letter",
    name: "Itemized Deduction Letter",
    description: "Generate a PDF statement for any deposit deduction.",
  },
  {
    href: "/move-in-checklist",
    name: "Move-In / Move-Out Checklist",
    description: "Photo-documented condition report, signed and dated.",
  },
  {
    href: "/prorated-rent-calculator",
    name: "Prorated Rent Calculator",
    description: "Exact rent for a partial first or last month.",
  },
  {
    href: "/late-fee-calculator",
    name: "Late Rent Fee Calculator",
    description: "Flat, percentage, or per-day late fee after grace period.",
  },
  {
    href: "/rent-receipt-generator",
    name: "Rent Receipt Generator",
    description: "A clean, dated PDF receipt for any rent payment.",
  },
  {
    href: "/rent-ledger",
    name: "Rent Ledger & Payment Tracker",
    description: "Log every payment and export a PDF ledger. No signup.",
  },
  {
    href: "/security-deposit-demand-letter",
    name: "Deposit Demand Letter (for tenants)",
    description:
      "Landlord won't return your deposit? Generate a demand letter citing your state's deadline and penalties.",
  },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
        All tools
      </p>
      <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">
        Free Landlord Tools &amp; Calculators
      </h1>
      <p className="mt-3 max-w-2xl font-sans text-ink/70">
        Everything on this site in one place — every calculator and
        document generator runs entirely in your browser, free, with no
        signup.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="card-flat rounded-2xl bg-white p-7 transition-colors hover:border-moss"
          >
            <h2 className="font-serif text-lg font-bold">{tool.name}</h2>
            <p className="mt-2 font-sans text-sm text-ink/60">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
      <div className="mt-10">
        <Link
          href="/state"
          className="font-sans text-sm font-semibold text-moss hover:underline"
        >
          Looking for state deposit law instead? →
        </Link>
      </div>
    </div>
  );
}
