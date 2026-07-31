import type { Metadata } from "next";
import Link from "next/link";
import { statesData } from "@/lib/states-data";
import { deductionsData } from "@/lib/deductions-data";

export const metadata: Metadata = {
  title: "All Pages",
  description:
    "A complete directory of every calculator, document generator, state security deposit law guide, and article on Landlord Tools.",
  alternates: { canonical: "/all-pages" },
};

const tools = [
  ["/move-out-packet", "Move-Out Packet (all-in-one)"],
  ["/calculator", "Security Deposit Calculator"],
  ["/security-deposit-interest-calculator", "Security Deposit Interest Calculator"],
  ["/deduction-letter", "Itemized Deduction Letter Generator"],
  ["/move-in-checklist", "Move-In / Move-Out Checklist with Photos"],
  ["/security-deposit-demand-letter", "Security Deposit Demand Letter (tenants)"],
  ["/rent-affordability-calculator", "Rent Affordability Calculator"],
  ["/rent-split-calculator", "Rent Split Calculator"],
  ["/prorated-rent-calculator", "Prorated Rent Calculator"],
  ["/late-fee-calculator", "Late Rent Fee Calculator"],
  ["/rent-receipt-generator", "Rent Receipt Generator"],
  ["/rent-ledger", "Rent Ledger & Payment Tracker"],
] as const;

const siteLinks = [
  ["/", "Home"],
  ["/tools", "All Tools"],
  ["/state", "Security Deposit Laws by State"],
  ["/can-a-landlord-charge-for", "Wear and Tear vs. Damage"],
  ["/about", "About"],
  ["/contact", "Contact"],
  ["/privacy", "Privacy Policy"],
  ["/cookies", "Cookie Policy"],
  ["/terms", "Terms of Service"],
  ["/disclaimer", "Legal Disclaimer"],
] as const;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-serif text-2xl font-bold text-ink">{title}</h2>
      {children}
    </section>
  );
}

export default function AllPagesPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
        Directory
      </p>
      <h1 className="mt-2 font-serif text-4xl font-bold">All pages</h1>
      <p className="mt-3 max-w-2xl font-sans text-ink/70">
        Every tool, state guide, and article on Landlord Tools, in one place.
      </p>

      <Section title="Free tools">
        <ul className="mt-4 grid gap-x-8 gap-y-2 font-sans text-sm sm:grid-cols-2">
          {tools.map(([href, label]) => (
            <li key={href}>
              <Link href={href} className="text-ink/80 hover:text-moss hover:underline">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Security deposit law by state">
        <ul className="mt-4 grid gap-x-8 gap-y-2 font-sans text-sm sm:grid-cols-3">
          {statesData.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/state/${s.slug}`}
                className="text-ink/80 hover:text-moss hover:underline"
              >
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Wear and tear vs. damage">
        <ul className="mt-4 grid gap-x-8 gap-y-2 font-sans text-sm sm:grid-cols-2">
          {deductionsData.map((d) => (
            <li key={d.slug}>
              <Link
                href={`/can-a-landlord-charge-for/${d.slug}`}
                className="text-ink/80 hover:text-moss hover:underline"
              >
                {d.question}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Site">
        <ul className="mt-4 grid gap-x-8 gap-y-2 font-sans text-sm sm:grid-cols-2">
          {siteLinks.map(([href, label]) => (
            <li key={href}>
              <Link href={href} className="text-ink/80 hover:text-moss hover:underline">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
