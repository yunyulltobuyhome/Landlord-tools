import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStateBySlug, statesData } from "@/lib/states-data";
import { SITE_URL } from "@/lib/site";

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
    title: `${state.name} Security Deposit Law: Limits, Deadlines & Interest`,
    description: `${state.name} security deposit rules for landlords: deposit cap, ${state.returnDeadlineDays}-day refund deadline, interest requirements, and penalties for noncompliance.`,
    alternates: { canonical: `/state/${state.slug}` },
  };
}

export default function StatePage({ params }: { params: { slug: string } }) {
  const state = getStateBySlug(params.slug);
  if (!state) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How much can a landlord charge for a security deposit in ${state.name}?`,
        acceptedAnswer: { "@type": "Answer", text: state.depositCap },
      },
      {
        "@type": "Question",
        name: `How long does a landlord have to return a security deposit in ${state.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${state.returnDeadlineDays} days after the tenant moves out. ${state.returnDeadlineNote ?? ""}`,
        },
      },
      {
        "@type": "Question",
        name: `Is interest required on security deposits in ${state.name}?`,
        acceptedAnswer: { "@type": "Answer", text: state.interestNote },
      },
      {
        "@type": "Question",
        name: `What happens if a landlord wrongfully withholds a deposit in ${state.name}?`,
        acceptedAnswer: { "@type": "Answer", text: state.penalty },
      },
    ],
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
      <p className="mt-3 font-sans text-ink/70">
        What landlords in {state.name} need to know about deposit limits,
        refund deadlines, interest, and penalties for getting it wrong.
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

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/calculator"
          className="card-flat flex-1 rounded-2xl bg-mossdark px-5 py-4 text-center font-sans text-sm font-semibold text-white hover:bg-mossdark/90"
        >
          Calculate the refund due →
        </Link>
        <Link
          href="/deduction-letter"
          className="card-flat flex-1 rounded-2xl bg-clay px-5 py-4 text-center font-sans text-sm font-semibold text-white hover:bg-clay/90"
        >
          Generate a deduction letter →
        </Link>
      </div>

      <div className="mt-12 font-sans text-xs text-ink/50">
        <p>
          This page summarizes general state-level rules as of{" "}
          {new Date().getFullYear()} and does not cover city or county
          ordinances, which can be stricter. Verify against the statute
          cited above or with a local attorney before relying on it. See{" "}
          <a
            href={`${SITE_URL}/state`}
            className="underline transition-colors hover:text-moss"
          >
            all states
          </a>
          .
        </p>
      </div>
    </div>
  );
}
