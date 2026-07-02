"use client";

import { useMemo, useState } from "react";
import { statesData } from "@/lib/states-data";

function formatMoney(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function longDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DemandLetter() {
  const [tenantName, setTenantName] = useState("");
  const [tenantAddress, setTenantAddress] = useState("");
  const [landlordName, setLandlordName] = useState("");
  const [landlordAddress, setLandlordAddress] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [stateSlug, setStateSlug] = useState("california");
  const [moveOutDate, setMoveOutDate] = useState("");
  const [depositAmount, setDepositAmount] = useState("1500");
  const [returnedAmount, setReturnedAmount] = useState("0");
  const [responseDays, setResponseDays] = useState("14");
  const [generating, setGenerating] = useState(false);

  const state = statesData.find((s) => s.slug === stateSlug)!;
  const deposit = parseFloat(depositAmount) || 0;
  const returned = parseFloat(returnedAmount) || 0;
  const outstanding = Math.max(0, deposit - returned);

  const deadline = useMemo(
    () => (moveOutDate ? addDays(new Date(moveOutDate + "T00:00:00"), state.returnDeadlineDays) : null),
    [moveOutDate, state]
  );
  const deadlinePassed = deadline ? new Date() > deadline : false;

  async function downloadPdf() {
    setGenerating(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "letter" });
      const margin = 64;
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxW = pageWidth - margin * 2;
      let y = margin;
      const lh = 15;

      const write = (
        text: string,
        opts: { bold?: boolean; size?: number; gap?: number } = {}
      ) => {
        doc.setFont("times", opts.bold ? "bold" : "normal");
        doc.setFontSize(opts.size ?? 11);
        const lines = doc.splitTextToSize(text, maxW);
        lines.forEach((ln: string) => {
          doc.text(ln, margin, y);
          y += lh;
        });
        if (opts.gap) y += opts.gap;
      };

      const today = longDate(new Date());

      write(today, { gap: lh });

      if (tenantName) write(tenantName);
      if (tenantAddress) write(tenantAddress);
      y += lh;

      if (landlordName) write(landlordName);
      if (landlordAddress) write(landlordAddress);
      y += lh;

      write(
        `Re: Demand for return of security deposit — ${propertyAddress || "the rental property"}`,
        { bold: true, gap: lh }
      );

      write(`Dear ${landlordName || "Landlord"},`, { gap: lh });

      const moveOutLong = moveOutDate
        ? longDate(new Date(moveOutDate + "T00:00:00"))
        : "[move-out date]";

      write(
        `I was a tenant at ${propertyAddress || "the above property"} and vacated the unit on ${moveOutLong}. At the start of my tenancy I paid a security deposit of ${formatMoney(
          deposit
        )}.`,
        { gap: lh }
      );

      const deadlineLong = deadline ? longDate(deadline) : "[deadline]";
      write(
        `Under ${state.statute}, a landlord in ${state.name} must return a tenant's security deposit, or provide a written itemized statement of any deductions, within ${state.returnDeadlineDays} days of move-out — in my case, by ${deadlineLong}.`,
        { gap: lh }
      );

      if (returned > 0) {
        write(
          `To date, you have returned ${formatMoney(
            returned
          )} of my deposit, leaving ${formatMoney(
            outstanding
          )} outstanding, without a proper itemized accounting for the amount withheld.`,
          { gap: lh }
        );
      } else {
        write(
          `To date, you have not returned my deposit or provided the required itemized statement.`,
          { gap: lh }
        );
      }

      write(
        `Please be aware that ${state.penalty} I am requesting that you return the ${formatMoney(
          outstanding
        )} owed to me within ${parseInt(responseDays, 10) || 14} days of the date of this letter.`,
        { gap: lh }
      );

      write(
        `If I do not receive the amount owed within that time, I intend to pursue all remedies available to me under ${state.name} law, which may include filing a claim in small claims court to recover the deposit along with any statutory damages, interest, and costs permitted by law.`,
        { gap: lh }
      );

      write(`Please send the amount owed to me at: ${tenantAddress || "[your address]"}.`, {
        gap: lh,
      });

      write("Sincerely,", { gap: lh * 2 });
      write(tenantName || "[Your name]");

      y += lh * 2;
      doc.setFont("times", "italic");
      doc.setFontSize(8.5);
      const disc =
        "This self-help letter is provided as a template based on the information you entered and general state deposit rules. It is not legal advice and does not guarantee any outcome. Deposit laws vary by state and locality; consider consulting a local attorney or your local small claims court for guidance specific to your situation.";
      doc.splitTextToSize(disc, maxW).forEach((ln: string) => {
        doc.text(ln, margin, y);
        y += 11;
      });

      doc.save("security-deposit-demand-letter.pdf");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <div className="card-flat rounded-2xl bg-white p-5">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
            You (the tenant)
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-sans text-xs text-ink/60">Your name</label>
              <input
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Your current mailing address
              </label>
              <input
                value={tenantAddress}
                onChange={(e) => setTenantAddress(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
          </div>
        </div>

        <div className="card-flat rounded-2xl bg-white p-5">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
            Landlord &amp; property
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Landlord / property manager name
              </label>
              <input
                value={landlordName}
                onChange={(e) => setLandlordName(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Landlord mailing address
              </label>
              <input
                value={landlordAddress}
                onChange={(e) => setLandlordAddress(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-sans text-xs text-ink/60">
                Rental property address
              </label>
              <input
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
          </div>
        </div>

        <div className="card-flat rounded-2xl bg-white p-5">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
            Deposit details
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-sans text-xs text-ink/60">State</label>
              <select
                value={stateSlug}
                onChange={(e) => setStateSlug(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              >
                {statesData.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Move-out date
              </label>
              <input
                type="date"
                value={moveOutDate}
                onChange={(e) => setMoveOutDate(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Deposit you paid
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Amount returned so far
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={returnedAmount}
                onChange={(e) => setReturnedAmount(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Days you&apos;ll give them to respond
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={responseDays}
                onChange={(e) => setResponseDays(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="card-flat sticky top-6 rounded-2xl bg-mossdark p-7 text-paper">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-gold">
            Amount they owe you
          </p>
          <p className="mt-2 font-serif text-4xl font-bold">
            {formatMoney(outstanding)}
          </p>

          {deadline && (
            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-gold">
                {state.name} deadline
              </p>
              <p className="mt-1 font-serif text-lg font-bold">
                {longDate(deadline)}
              </p>
              <p className="mt-1 font-sans text-sm text-paper/70">
                {deadlinePassed
                  ? "This deadline has passed — your landlord may already be in violation."
                  : `Your landlord has until this date (${state.returnDeadlineDays} days after move-out).`}
              </p>
            </div>
          )}

          <div className="mt-6 border-t border-white/10 pt-4">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-gold">
              Your leverage in {state.name}
            </p>
            <p className="mt-1 font-sans text-sm text-paper/80">{state.penalty}</p>
          </div>

          <button
            type="button"
            onClick={downloadPdf}
            disabled={generating}
            className="mt-7 w-full rounded-xl bg-clay py-3 text-center font-sans text-sm font-semibold text-white hover:bg-clay/90 disabled:opacity-60"
          >
            {generating ? "Generating…" : "Download demand letter (PDF)"}
          </button>
          <p className="mt-3 font-sans text-xs text-paper/60">
            Send it by certified mail so you have proof of delivery. This is a
            self-help template, not legal advice.
          </p>
        </div>
      </div>
    </div>
  );
}
