import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deductionsData, getDeductionBySlug } from "@/lib/deductions-data";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return deductionsData.map((d) => ({ slug: d.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const item = getDeductionBySlug(params.slug);
  if (!item) return {};
  return {
    title: item.question,
    description: `${item.shortAnswer} A clear wear-and-tear vs. damage guide for landlords and tenants.`,
    alternates: { canonical: `/can-a-landlord-charge-for/${item.slug}` },
  };
}

export default function DeductionPage({
  params,
}: {
  params: { slug: string };
}) {
  const item = getDeductionBySlug(params.slug);
  if (!item) notFound();

  const others = deductionsData.filter((d) => d.slug !== item.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${item.verdict}. ${item.shortAnswer}`,
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Wear and Tear vs. Damage",
        item: `${SITE_URL}/can-a-landlord-charge-for`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: item.question,
        item: `${SITE_URL}/can-a-landlord-charge-for/${item.slug}`,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <nav className="font-sans text-xs text-ink/50">
        <Link
          href="/can-a-landlord-charge-for"
          className="transition-colors hover:text-moss"
        >
          Wear &amp; Tear vs. Damage
        </Link>{" "}
        / {item.item}
      </nav>
      <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">
        {item.question}
      </h1>

      <div className="card-flat mt-6 rounded-2xl bg-mossdark p-6 text-paper">
        <p className="font-sans text-xs font-bold uppercase tracking-widest text-gold">
          Short answer
        </p>
        <p className="mt-2 font-serif text-xl font-bold">{item.verdict}</p>
        <p className="mt-2 font-sans text-sm text-paper/80">
          {item.shortAnswer}
        </p>
      </div>

      <div className="mt-8 space-y-4 font-sans text-sm leading-relaxed text-ink/80">
        {item.detail.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="card-flat rounded-2xl bg-white p-5">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
            Usually normal wear &amp; tear
          </p>
          <ul className="mt-3 space-y-2 font-sans text-sm text-ink/70">
            {item.wearExamples.map((w) => (
              <li key={w} className="flex gap-2">
                <span className="text-moss">✓</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
        <div className="card-flat rounded-2xl bg-white p-5">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-clay">
            Often chargeable damage
          </p>
          <ul className="mt-3 space-y-2 font-sans text-sm text-ink/70">
            {item.damageExamples.map((d) => (
              <li key={d} className="flex gap-2">
                <span className="text-clay">•</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/deduction-letter"
          className="card-flat flex-1 rounded-2xl bg-clay px-5 py-4 text-center font-sans text-sm font-semibold text-white hover:bg-clay/90"
        >
          Generate an itemized deduction letter →
        </Link>
        <Link
          href="/calculator"
          className="card-flat flex-1 rounded-2xl bg-mossdark px-5 py-4 text-center font-sans text-sm font-semibold text-white hover:bg-mossdark/90"
        >
          Calculate the deposit refund →
        </Link>
      </div>

      <section className="mt-14">
        <h2 className="font-serif text-2xl font-bold">More deduction questions</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {others.map((d) => (
            <Link
              key={d.slug}
              href={`/can-a-landlord-charge-for/${d.slug}`}
              className="rounded-lg border border-line bg-white px-3 py-1.5 font-sans text-sm capitalize transition-colors hover:border-moss hover:text-moss"
            >
              {d.item}
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-12 font-sans text-xs text-ink/50">
        <p>
          This is general educational information about how normal wear and
          tear is typically distinguished from tenant damage — not legal
          advice. Deposit rules vary by state and locality; confirm your
          state&apos;s rules or consult a local attorney before relying on
          any specific deduction.
        </p>
      </div>
    </div>
  );
}
