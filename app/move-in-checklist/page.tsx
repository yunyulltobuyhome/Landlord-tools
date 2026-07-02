import type { Metadata } from "next";
import ConditionChecklist from "@/components/ConditionChecklist";
import { toolJsonLd } from "@/lib/tool-schema";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Move-In / Move-Out Condition Checklist Generator",
  description:
    "Free move-in and move-out condition checklist generator for landlords — record room-by-room condition and download a signed PDF report, no signup.",
  alternates: { canonical: "/move-in-checklist" },
};

export default function MoveInChecklistPage() {
  const jsonLd = toolJsonLd(
    "Move-In / Move-Out Condition Checklist Generator",
    "/move-in-checklist"
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
        Move-In / Move-Out Condition Checklist
      </h1>
      <p className="mt-3 max-w-2xl font-sans text-ink/70">
        Record the condition of every room at move-in and move-out, then
        download a signed, dated PDF — the strongest evidence you can have
        if a security deposit deduction is ever disputed.
      </p>
      <div className="mt-8">
        <ConditionChecklist />
      </div>
      <div className="mt-16 max-w-3xl space-y-4 font-sans text-sm text-ink/80">
        <h2 className="font-serif text-2xl font-bold text-ink">
          Why a move-in checklist protects both sides
        </h2>
        <p>
          Most security deposit disputes come down to one question: was this
          damage already there when the tenant moved in? A checklist signed
          by both landlord and tenant at move-in — ideally backed by
          photos — settles that question before it becomes an argument.
        </p>
        <p>
          Run the same checklist again at move-out and compare it directly
          against the move-in copy. Anything marked &quot;Good&quot; at
          move-in but &quot;Poor&quot; at move-out is a legitimate,
          well-documented basis for a deduction — pair it with our{" "}
          <a href="/deduction-letter" className="underline hover:text-moss">
            itemized deduction letter generator
          </a>{" "}
          and{" "}
          <a href="/calculator" className="underline hover:text-moss">
            security deposit calculator
          </a>{" "}
          to finish the paperwork.
        </p>
      </div>
      <Disclaimer />
    </div>
  );
}
