import type { Metadata } from "next";
import Link from "next/link";
import DemandLetter from "@/components/DemandLetter";
import { toolJsonLd } from "@/lib/tool-schema";

export const metadata: Metadata = {
  title: "Security Deposit Demand Letter Generator (Free)",
  description:
    "Landlord won't return your security deposit? Generate a free demand letter citing your state's deadline and penalties — fill in your details and download a ready-to-send PDF.",
  alternates: { canonical: "/security-deposit-demand-letter" },
};

export default function DemandLetterPage() {
  const jsonLd = toolJsonLd(
    "Security Deposit Demand Letter Generator",
    "/security-deposit-demand-letter"
  );

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="font-sans text-xs font-bold uppercase tracking-widest text-clay">
        Free tool · for tenants
      </p>
      <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">
        Security Deposit Demand Letter
      </h1>
      <p className="mt-3 max-w-2xl font-sans text-ink/70">
        Didn&apos;t get your security deposit back? Fill in your details and
        download a professional demand letter that cites your state&apos;s
        return deadline and the penalties your landlord may face for wrongful
        withholding — the step that resolves most cases before small claims.
      </p>
      <div className="mt-8">
        <DemandLetter />
      </div>

      <div className="mt-16 max-w-3xl space-y-4 font-sans text-sm text-ink/80">
        <h2 className="font-serif text-2xl font-bold text-ink">
          How to get your security deposit back
        </h2>
        <p>
          When a landlord keeps a deposit past the legal deadline or without
          an itemized statement, a firm written demand letter is usually the
          most effective first move. It shows you know the law, creates a
          paper trail, and often prompts payment without anyone going to
          court. Many states also let you recover extra statutory damages —
          sometimes two or three times the amount — when a landlord withholds
          in bad faith, which your letter can put them on notice about.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Confirm the deadline for your state and whether it has passed —
            the tool does this from your move-out date.
          </li>
          <li>
            Generate and send the letter by certified mail with return
            receipt, so you can prove they got it.
          </li>
          <li>
            Give them the deadline you set (commonly 10–14 days). If they
            still don&apos;t pay, your documented demand strengthens a small
            claims case.
          </li>
        </ol>
        <p>
          Want to see the exact numbers first? Check your state&apos;s rules
          on the{" "}
          <Link href="/state" className="underline hover:text-moss">
            security deposit laws by state
          </Link>{" "}
          page, or read{" "}
          <Link
            href="/can-a-landlord-charge-for"
            className="underline hover:text-moss"
          >
            what a landlord can and can&apos;t deduct
          </Link>
          .
        </p>
        <p className="text-xs text-ink/50">
          This is a self-help tool that generates a template from the details
          you enter and general state rules. It is not legal advice and
          does not guarantee any outcome. For advice on your specific
          situation, consult a local attorney or your small claims court.
        </p>
      </div>
    </div>
  );
}
