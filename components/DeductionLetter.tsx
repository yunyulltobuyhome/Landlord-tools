"use client";

import { useState } from "react";
import { statesData } from "@/lib/states-data";

type Line = { id: number; label: string; amount: string };
let nextId = 1;

function formatMoney(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function DeductionLetter() {
  const [landlordName, setLandlordName] = useState("");
  const [landlordAddress, setLandlordAddress] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [stateSlug, setStateSlug] = useState("california");
  const [moveOutDate, setMoveOutDate] = useState("");
  const [depositAmount, setDepositAmount] = useState("1500");
  const [lines, setLines] = useState<Line[]>([
    { id: nextId++, label: "", amount: "" },
  ]);
  const [generating, setGenerating] = useState(false);

  const state = statesData.find((s) => s.slug === stateSlug)!;
  const deposit = parseFloat(depositAmount) || 0;
  const totalDeductions = lines.reduce(
    (sum, l) => sum + (parseFloat(l.amount) || 0),
    0
  );
  const refund = deposit - totalDeductions;

  function updateLine(id: number, field: "label" | "amount", value: string) {
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  }
  function addLine() {
    setLines((prev) => [...prev, { id: nextId++, label: "", amount: "" }]);
  }
  function removeLine(id: number) {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }

  async function downloadPdf() {
    setGenerating(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "letter" });
      const margin = 56;
      let y = margin;
      const lineHeight = 16;
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFont("times", "bold");
      doc.setFontSize(16);
      doc.text("Itemized Security Deposit Statement", margin, y);
      y += lineHeight * 1.5;

      doc.setFont("times", "normal");
      doc.setFontSize(11);

      const today = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      doc.text(`Date: ${today}`, margin, y);
      y += lineHeight;

      if (landlordName) {
        doc.text(`From: ${landlordName}`, margin, y);
        y += lineHeight;
      }
      if (landlordAddress) {
        doc.text(landlordAddress, margin, y);
        y += lineHeight;
      }
      y += lineHeight * 0.5;

      if (tenantName) {
        doc.text(`To: ${tenantName}`, margin, y);
        y += lineHeight;
      }
      if (propertyAddress) {
        doc.text(`Rental property: ${propertyAddress}`, margin, y);
        y += lineHeight;
      }
      if (moveOutDate) {
        const d = new Date(moveOutDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        doc.text(`Move-out date: ${d}`, margin, y);
        y += lineHeight;
      }
      y += lineHeight;

      doc.setFont("times", "italic");
      doc.text(
        `Pursuant to ${state.statute}, the security deposit held for this`,
        margin,
        y
      );
      y += lineHeight;
      doc.text(
        "tenancy is accounted for below.",
        margin,
        y
      );
      y += lineHeight * 1.5;

      doc.setFont("times", "bold");
      doc.text("Description", margin, y);
      doc.text("Amount", pageWidth - margin - 60, y);
      y += 6;
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += lineHeight;

      doc.setFont("times", "normal");
      doc.text("Security deposit received", margin, y);
      doc.text(formatMoney(deposit), pageWidth - margin - 60, y);
      y += lineHeight;

      lines
        .filter((l) => l.label || l.amount)
        .forEach((l) => {
          doc.text(`Deduction: ${l.label || "Untitled"}`, margin, y);
          doc.text(
            `-${formatMoney(parseFloat(l.amount) || 0)}`,
            pageWidth - margin - 60,
            y
          );
          y += lineHeight;
        });

      y += 6;
      doc.line(margin, y, pageWidth - margin, y);
      y += lineHeight;

      doc.setFont("times", "bold");
      doc.text("Amount due to tenant", margin, y);
      doc.text(formatMoney(refund), pageWidth - margin - 60, y);
      y += lineHeight * 2;

      doc.setFont("times", "normal");
      doc.setFontSize(10);
      const disclaimer =
        "This statement is provided as a good-faith accounting of the security deposit and is not a legal document prepared by an attorney. Deposit deduction rules vary by state and locality; consult your state statute or a local attorney with questions.";
      const split = doc.splitTextToSize(disclaimer, pageWidth - margin * 2);
      doc.text(split, margin, y);
      y += split.length * 12 + lineHeight * 2;

      doc.setFontSize(11);
      doc.text("_____________________________", margin, y);
      y += lineHeight;
      doc.text("Landlord signature", margin, y);

      doc.save("itemized-deposit-statement.pdf");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <div className="card-flat bg-white p-5">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
            Parties
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Landlord / property manager name
              </label>
              <input
                value={landlordName}
                onChange={(e) => setLandlordName(e.target.value)}
                className="mt-1 w-full rounded-none border-2 border-ink px-3 py-2 font-sans text-sm"
              />
            </div>
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Landlord mailing address
              </label>
              <input
                value={landlordAddress}
                onChange={(e) => setLandlordAddress(e.target.value)}
                className="mt-1 w-full rounded-none border-2 border-ink px-3 py-2 font-sans text-sm"
              />
            </div>
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Tenant name
              </label>
              <input
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                className="mt-1 w-full rounded-none border-2 border-ink px-3 py-2 font-sans text-sm"
              />
            </div>
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Rental property address
              </label>
              <input
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                className="mt-1 w-full rounded-none border-2 border-ink px-3 py-2 font-sans text-sm"
              />
            </div>
          </div>
        </div>

        <div className="card-flat bg-white p-5">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
            Details
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block font-sans text-xs text-ink/60">
                State
              </label>
              <select
                value={stateSlug}
                onChange={(e) => setStateSlug(e.target.value)}
                className="mt-1 w-full rounded-none border-2 border-ink bg-white px-3 py-2 font-sans text-sm"
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
                className="mt-1 w-full rounded-none border-2 border-ink px-3 py-2 font-sans text-sm"
              />
            </div>
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Deposit held
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="mt-1 w-full rounded-none border-2 border-ink px-3 py-2 font-sans text-sm"
              />
            </div>
          </div>
        </div>

        <div className="card-flat bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
              Deductions
            </p>
            <button
              type="button"
              onClick={addLine}
              className="font-sans text-sm font-semibold text-clay hover:underline"
            >
              + Add line
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {lines.map((l) => (
              <div key={l.id} className="flex gap-2">
                <input
                  value={l.label}
                  onChange={(e) => updateLine(l.id, "label", e.target.value)}
                  placeholder="e.g. Replace broken blinds"
                  className="flex-1 rounded-none border-2 border-ink px-3 py-2 font-sans text-sm"
                />
                <input
                  type="number"
                  inputMode="decimal"
                  value={l.amount}
                  onChange={(e) => updateLine(l.id, "amount", e.target.value)}
                  placeholder="0.00"
                  className="w-28 rounded-none border-2 border-ink px-3 py-2 font-sans text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeLine(l.id)}
                  aria-label="Remove line"
                  className="w-9 shrink-0 border-2 border-ink font-sans text-lg text-ink/60 hover:bg-sand"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="card-flat sticky top-6 bg-mossdark p-6 text-paper">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-gold">
            Summary
          </p>
          <dl className="mt-3 space-y-2 font-sans text-sm">
            <div className="flex justify-between">
              <dt className="text-paper/70">Deposit held</dt>
              <dd>{formatMoney(deposit)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-paper/70">Total deductions</dt>
              <dd>−{formatMoney(totalDeductions)}</dd>
            </div>
          </dl>
          <div className="mt-4 border-t border-paper/20 pt-4">
            <p className="font-sans text-xs text-paper/70">Refund due</p>
            <p className="font-serif text-3xl font-bold">
              {formatMoney(Math.max(0, refund))}
            </p>
          </div>
          <button
            type="button"
            onClick={downloadPdf}
            disabled={generating}
            className="mt-6 w-full bg-clay py-3 text-center font-sans text-sm font-semibold text-paper hover:bg-clay/90 disabled:opacity-60"
          >
            {generating ? "Generating…" : "Download PDF statement"}
          </button>
          <p className="mt-3 font-sans text-xs text-paper/60">
            {state.name} requires an itemized statement within{" "}
            {state.returnDeadlineDays} days of move-out ({state.statute}).
          </p>
        </div>
      </div>
    </div>
  );
}
