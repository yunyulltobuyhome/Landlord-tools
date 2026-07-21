import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStateBySlug, statesData } from "@/lib/states-data";
import { SITE_URL } from "@/lib/site";
import Calculator from "@/components/Calculator";

export function generateStaticParams() {
  return statesData.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const state = getStateBySlug(params.slug);
  if (!state) return {};
  return {
    title: `${state.name} Security Deposit Law (${new Date().getFullYear()}): Limits, Deadlines & Interest`,
    description: `${state.name} security deposit rules for landlords: deposit cap (${state.depositCap}), a ${state.returnDeadlineDays}-day refund deadline, interest requirements, and penalties for wrongful withholding — with a free ${state.name} refund calculator.`,
    alternates: { canonical: `/state/${state.slug}` },
  };
}

export default function StatePage({ params }: { params: { slug: string } }) {
  const state = getStateBySlug(params.slug);
  if (!state) notFound();

  const year = new Date().getFullYear();

  const faqs = [
    {
      q: `How much can a landlord charge for a security deposit in ${state.name}?`,
      a: `${state.depositCap}.`,
    },
    {
      q: `How long does a landlord have to return a security deposit in ${state.name}?`,
      a: `A landlord generally has ${state.returnDeadlineDays} days after the tenant moves out to return the deposit or send an itemized statement of deductions.${state.returnDeadlineNote ? ` ${state.returnDeadlineNote}` : ""}`,
    },
    {
      q: `Is interest required on security deposits in ${state.name}?`,
      a: state.interestNote,
    },
    {
      q: `Does ${state.name} require the deposit to be held in a separate account?`,
      a: state.separateAccountRequired
        ? `Yes. In ${state.name}, landlords are generally required to keep security deposits in a separate account rather than commingling them with personal funds.`
        : `${state.name} does not impose a statewide separate-account requirement, though keeping deposits separate is still good practice.`,
    },
    {
      q: `What happens if a landlord wrongfully withholds a deposit in ${state.name}?`,
      a: state.penalty,
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

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "State Laws", item: `${SITE_URL}/state` },
      {
        "@type": "ListItem",
        position: 2,
        name: `${state.name} Security Deposit Law`,
        item: `${SITE_URL}/state/${state.slug}`,
      },
    ],
  };

  // Nearby suggestions: a few other states for internal linking.
  const otherStates = statesData
    .filter((s) => s.slug !== state.slug)
    .slice(0, 8);

  const steps = [
    {
      title: "Inspect and document the unit",
      body: `As soon as the tenant moves out, photograph every room and compare it against the move-in condition. In ${state.name}, deductions generally must reflect actual damage beyond normal wear and tear.`,
    },
    {
      title: "Itemize every deduction in writing",
      body: `List each deduction with a dollar amount. ${state.name} — like nearly every state — can bar a landlord from keeping any of the deposit if deductions aren't itemized in a written statement.`,
    },
    state.interestRequired
      ? {
          title: "Add any interest owed",
          body: `${state.name} requires interest on held deposits. ${state.interestNote} Include the interest in the amount returned.`,
        }
      : {
          title: "Confirm no interest is required",
          body: `${state.interestNote} That means you generally return the deposit minus documented deductions, with no added interest.`,
        },
    {
      title: `Return the balance within ${state.returnDeadlineDays} days`,
      body: `Send the remaining balance and the itemized statement to the tenant's forwarding address within ${state.returnDeadlineDays} days of move-out.${state.returnDeadlineNote ? ` ${state.returnDeadlineNote}` : ""} Missing this deadline is the single most common way landlords lose a deposit dispute.`,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <nav className="font-sans text-xs text-ink/50">
        <Link href="/state" className="transition-colors hover:text-moss">
          State Laws
        </Link>{" "}
        / {state.name}
      </nav>
      <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">
        {state.name} Security Deposit Law
      </h1>
      <p className="mt-3 max-w-2xl font-sans text-ink/70">
        A {year} guide for {state.name} landlords: how much you can hold, the{" "}
        {state.returnDeadlineDays}-day deadline to return it, whether interest
        is required, and the penalties for getting it wrong — plus a free
        calculator set to {state.name}&apos;s rules.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="card-flat rounded-2xl bg-white p-5">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
            Deposit cap
          </p>
          <p className="mt-2 font-serif text-xl font-bold">
            {state.depositCap}
          </p>
        </div>
        <div className="card-flat rounded-2xl bg-white p-5">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
            Refund deadline
          </p>
          <p className="mt-2 font-serif text-xl font-bold">
            {state.returnDeadlineDays} days
          </p>
          {state.returnDeadlineNote && (
            <p className="mt-1 font-sans text-xs text-ink/60">
              {state.returnDeadlineNote}
            </p>
          )}
        </div>
        <div className="card-flat rounded-2xl bg-white p-5">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
            Interest required?
          </p>
          <p className="mt-2 font-serif text-xl font-bold">
            {state.interestRequired ? "Yes" : "No"}
          </p>
          <p className="mt-1 font-sans text-xs text-ink/60">
            {state.interestNote}
          </p>
          {state.interestRequired && (
            <Link
              href="/security-deposit-interest-calculator"
              className="mt-2 inline-block font-sans text-xs font-semibold text-moss hover:underline"
            >
              Calculate the interest owed →
            </Link>
          )}
        </div>
        <div className="card-flat rounded-2xl bg-white p-5">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
            Separate account?
          </p>
          <p className="mt-2 font-serif text-xl font-bold">
            {state.separateAccountRequired ? "Yes" : "Not required"}
          </p>
        </div>
      </div>

      <div className="card-flat mt-4 rounded-2xl bg-white p-5">
        <p className="font-sans text-xs font-bold uppercase tracking-widest text-clay">
          Penalty for noncompliance
        </p>
        <p className="mt-2 font-sans text-sm">{state.penalty}</p>
        <p className="mt-3 font-sans text-xs text-ink/50">
          Statute: {state.statute}
        </p>
      </div>

      {/* Embedded, state-specific calculator */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl font-bold">
          {state.name} security deposit refund calculator
        </h2>
        <p className="mt-2 max-w-2xl font-sans text-sm text-ink/70">
          Pre-set to {state.name}&apos;s {state.returnDeadlineDays}-day deadline
          {state.interestRequired ? " and interest rule" : ""}. Enter the
          deposit and any deductions to see the refund and the exact due date.
        </p>
        <div className="mt-6">
          <Calculator initialState={state.slug} />
        </div>
      </section>

      {/* Derived step-by-step guide */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl font-bold">
          How to return a security deposit in {state.name}
        </h2>
        <ol className="mt-5 space-y-4">
          {steps.map((step, i) => (
            <li key={i} className="card-flat rounded-2xl bg-white p-5">
              <div className="flex gap-4">
                <span className="font-serif text-2xl font-bold text-moss">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-serif text-lg font-bold">{step.title}</h3>
                  <p className="mt-1 font-sans text-sm text-ink/70">
                    {step.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Visible FAQ (mirrors FAQ schema) */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl font-bold">
          {state.name} security deposit FAQ
        </h2>
        <div className="mt-5 space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="card-flat rounded-2xl bg-white p-5 [&_summary]:cursor-pointer"
            >
              <summary className="font-serif text-base font-bold">
                {f.q}
              </summary>
              <p className="mt-2 font-sans text-sm text-ink/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Related tools */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl font-bold">Related free tools</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Link
            href="/deduction-letter"
            className="card-flat rounded-2xl bg-white p-5 transition-colors hover:border-moss"
          >
            <h3 className="font-serif text-base font-bold">
              Itemized Deduction Letter
            </h3>
            <p className="mt-1 font-sans text-sm text-ink/60">
              Generate the written statement {state.name} requires.
            </p>
          </Link>
          <Link
            href="/move-in-checklist"
            className="card-flat rounded-2xl bg-white p-5 transition-colors hover:border-moss"
          >
            <h3 className="font-serif text-base font-bold">
              Move-In / Move-Out Checklist
            </h3>
            <p className="mt-1 font-sans text-sm text-ink/60">
              Document condition to justify every deduction.
            </p>
          </Link>
        </div>
      </section>

      {/* Other states — internal linking */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl font-bold">
          Deposit laws in other states
        </h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {otherStates.map((s) => (
            <Link
              key={s.slug}
              href={`/state/${s.slug}`}
              className="rounded-lg border border-line bg-white px-3 py-1.5 font-sans text-sm transition-colors hover:border-moss hover:text-moss"
            >
              {s.name}
            </Link>
          ))}
          <Link
            href="/state"
            className="rounded-lg border border-line bg-white px-3 py-1.5 font-sans text-sm font-semibold text-moss transition-colors hover:border-moss"
          >
            All 50 states + DC →
          </Link>
        </div>
      </section>

      <div className="mt-12 font-sans text-xs text-ink/50">
        <p>
          This page summarizes general state-level rules as of {year} and does
          not cover city or county ordinances, which can be stricter. Verify
          against the statute cited above ({state.statute}) or with a local
          attorney before relying on it.
        </p>
      </div>
    </div>
  );
}
