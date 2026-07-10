import type { Metadata } from "next";
import MoveOutPacket from "@/components/MoveOutPacket";
import { toolJsonLd } from "@/lib/tool-schema";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Move-Out Packet Generator (Calculator + Deduction Letter + Photos)",
  description:
    "Generate one complete move-out PDF: deposit refund calculation, itemized deduction statement, and a photo-backed condition report — all in a single document. Free, no signup.",
  alternates: { canonical: "/move-out-packet" },
};

export default function MoveOutPacketPage() {
  const jsonLd = toolJsonLd("Move-Out Packet Generator", "/move-out-packet");

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="font-sans text-xs font-bold uppercase tracking-widest text-clay">
        Free tool · all-in-one
      </p>
      <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">
        Move-Out Packet Generator
      </h1>
      <p className="mt-3 max-w-2xl font-sans text-ink/70">
        Everything you need after a tenant moves out, in one flow: the
        deposit refund calculation, an itemized deduction statement, and a
        photo-backed condition report — combined into a single PDF you can
        send and keep on file.
      </p>
      <div className="mt-8">
        <MoveOutPacket />
      </div>

      <div className="mt-16 max-w-3xl space-y-4 font-sans text-sm text-ink/80">
        <h2 className="font-serif text-2xl font-bold text-ink">
          Why one packet instead of three tools
        </h2>
        <p>
          Handling a move-out properly usually means doing three things:
          figuring out the refund, writing up any deductions in an itemized
          statement, and documenting the unit&apos;s condition with photos.
          Normally that&apos;s three separate documents. This tool walks
          through all three in one place and produces a single PDF — a
          cover summary, the itemized deduction statement citing your
          state&apos;s deadline and statute, and the photo condition report —
          so there&apos;s one file to send and one file to keep.
        </p>
        <p>
          Prefer to use the tools separately? The{" "}
          <a href="/calculator" className="underline hover:text-moss">
            deposit calculator
          </a>
          , the{" "}
          <a href="/deduction-letter" className="underline hover:text-moss">
            deduction letter generator
          </a>
          , and the{" "}
          <a href="/move-in-checklist" className="underline hover:text-moss">
            photo condition checklist
          </a>{" "}
          are each also available on their own.
        </p>
      </div>
      <Disclaimer />
    </div>
  );
}
