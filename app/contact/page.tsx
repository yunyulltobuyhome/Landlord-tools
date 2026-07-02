import type { Metadata } from "next";
import { SITE_NAME, CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${SITE_NAME} with questions, corrections to a state deposit-law summary, or suggestions for a new tool.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
        Contact
      </p>
      <h1 className="mt-2 font-serif text-4xl font-bold">Get in touch</h1>
      <p className="mt-3 font-sans text-ink/70">
        We read every message. Whether something looks wrong on a state
        page, a calculator isn&apos;t behaving, or there&apos;s a tool
        you&apos;d like us to build, we want to hear it.
      </p>

      <div className="mt-8 card-flat rounded-2xl bg-white p-7">
        <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
          Email
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-2 block font-serif text-2xl font-bold text-ink hover:text-moss"
        >
          {CONTACT_EMAIL}
        </a>
        <p className="mt-3 font-sans text-sm text-ink/60">
          We typically reply within a couple of business days.
        </p>
      </div>

      <div className="mt-8 space-y-4 font-sans text-sm leading-relaxed text-ink/80">
        <div>
          <h2 className="font-serif text-lg font-bold text-ink">
            Reporting an error in a state summary
          </h2>
          <p className="mt-1">
            Please include the state and the specific figure (for example,
            the refund deadline or deposit cap) along with a link to the
            statute if you have one. Accurate law summaries matter to us,
            and reader corrections are one of the best ways we catch
            changes.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-lg font-bold text-ink">
            A note on legal questions
          </h2>
          <p className="mt-1">
            We can&apos;t give legal advice or weigh in on a specific
            dispute with a tenant — for that, contact a licensed attorney
            in your state. But we&apos;re happy to fix anything inaccurate
            on the site.
          </p>
        </div>
      </div>
    </div>
  );
}
