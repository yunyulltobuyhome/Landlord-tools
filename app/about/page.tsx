import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE_NAME} — who we are, what these free landlord tools do, and how the state deposit-law information is put together.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
        About
      </p>
      <h1 className="mt-2 font-serif text-4xl font-bold">About Landlord Tools</h1>

      <div className="mt-8 space-y-6 font-sans text-sm leading-relaxed text-ink/80">
        <section>
          <h2 className="font-serif text-xl font-bold text-ink">
            What this site is
          </h2>
          <p className="mt-2">
            {SITE_NAME} is a small, independent set of free calculators and
            document generators for landlords — especially the millions of
            individual &quot;mom-and-pop&quot; owners in the United States
            who manage one or a handful of rental units themselves. We build
            the specific, practical tools those owners reach for around
            move-out and rent day: a security deposit return calculator, an
            itemized deduction letter generator, move-in and move-out
            condition checklists, a prorated rent calculator, a late fee
            calculator, and a rent receipt generator.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-ink">
            How we approach the information
          </h2>
          <p className="mt-2">
            Our state-by-state pages summarize publicly available
            landlord-tenant statutes — deposit caps, refund deadlines,
            interest requirements, and penalties — and cite the underlying
            statute for each state so you can verify it yourself. We review
            this information periodically, but laws change and local
            ordinances can be stricter, so we present it as a well-sourced
            starting point rather than the last word. Everything on the
            site is general information and self-help tooling, not legal
            advice.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-ink">
            How it stays free
          </h2>
          <p className="mt-2">
            The calculators run entirely in your browser — nothing you type
            is uploaded or stored on our servers. To cover hosting and keep
            the tools free, the site may show advertising and use
            privacy-respecting analytics. You control non-essential cookies
            through the consent banner and our{" "}
            <Link href="/cookies" className="underline hover:text-moss">
              Cookie Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-ink">Contact</h2>
          <p className="mt-2">
            Questions, corrections to a state summary, or suggestions for a
            new tool are genuinely welcome — reach us any time at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="underline hover:text-moss"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            or through the{" "}
            <Link href="/contact" className="underline hover:text-moss">
              contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
