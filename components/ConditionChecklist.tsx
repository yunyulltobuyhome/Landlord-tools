"use client";

import { useState } from "react";

type Condition = "Good" | "Fair" | "Poor" | "N/A";
type Row = { id: number; area: string; condition: Condition; notes: string };

let nextId = 1;
function defaultRows(): Row[] {
  return [
    "Living room — walls & floors",
    "Kitchen — appliances",
    "Kitchen — cabinets & counters",
    "Bedroom 1",
    "Bedroom 2",
    "Bathroom 1",
    "Windows & doors",
    "Smoke / CO detectors",
    "Entryway / hallway",
    "Exterior / yard",
  ].map((area) => ({ id: nextId++, area, condition: "Good" as Condition, notes: "" }));
}

const CONDITIONS: Condition[] = ["Good", "Fair", "Poor", "N/A"];

export default function ConditionChecklist() {
  const [mode, setMode] = useState<"move-in" | "move-out">("move-in");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
  const [rows, setRows] = useState<Row[]>(defaultRows());
  const [generating, setGenerating] = useState(false);

  function updateRow(id: number, field: "area" | "condition" | "notes", value: string) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  }
  function addRow() {
    setRows((prev) => [
      ...prev,
      { id: nextId++, area: "", condition: "Good", notes: "" },
    ]);
  }
  function removeRow(id: number) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  async function downloadPdf() {
    setGenerating(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "letter" });
      const margin = 48;
      let y = margin;
      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();
      const lineHeight = 15;

      function ensureSpace(extra: number) {
        if (y + extra > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
      }

      doc.setFont("times", "bold");
      doc.setFontSize(16);
      doc.text(
        mode === "move-in"
          ? "Move-In Condition Checklist"
          : "Move-Out Condition Checklist",
        margin,
        y
      );
      y += lineHeight * 1.6;

      doc.setFont("times", "normal");
      doc.setFontSize(11);
      const today = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      doc.text(`Prepared: ${today}`, margin, y);
      y += lineHeight;
      if (propertyAddress) {
        doc.text(`Property: ${propertyAddress}`, margin, y);
        y += lineHeight;
      }
      if (tenantName) {
        doc.text(`Tenant: ${tenantName}`, margin, y);
        y += lineHeight;
      }
      if (inspectionDate) {
        const d = new Date(inspectionDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        doc.text(`Inspection date: ${d}`, margin, y);
        y += lineHeight;
      }
      y += lineHeight * 0.5;

      doc.setFont("times", "bold");
      doc.text("Area", margin, y);
      doc.text("Condition", margin + 220, y);
      doc.text("Notes", margin + 310, y);
      y += 6;
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += lineHeight;

      doc.setFont("times", "normal");
      rows.forEach((r) => {
        const noteLines = doc.splitTextToSize(r.notes || "-", pageWidth - margin - (margin + 310));
        ensureSpace(lineHeight * Math.max(1, noteLines.length));
        doc.text(r.area || "-", margin, y);
        doc.text(r.condition, margin + 220, y);
        doc.text(noteLines, margin + 310, y);
        y += lineHeight * Math.max(1, noteLines.length);
      });

      y += lineHeight * 2;
      ensureSpace(lineHeight * 8);
      doc.text("_____________________________", margin, y);
      doc.text("_____________________________", margin + 260, y);
      y += lineHeight;
      doc.text("Landlord signature / date", margin, y);
      doc.text("Tenant signature / date", margin + 260, y);

      y += lineHeight * 2;
      doc.setFont("times", "italic");
      doc.setFontSize(8.5);
      const disclaimer =
        "This checklist is a self-help template for documenting a unit's condition, not legal advice, and Landlord Tools is not a law firm. It does not guarantee any outcome in a deposit dispute. Landlord-tenant rules vary by state and locality; consult the applicable statute or a licensed attorney with questions.";
      doc
        .splitTextToSize(disclaimer, pageWidth - margin * 2)
        .forEach((ln: string) => {
          doc.text(ln, margin, y);
          y += 11;
        });

      doc.save(
        mode === "move-in"
          ? "move-in-condition-checklist.pdf"
          : "move-out-condition-checklist.pdf"
      );
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <div className="card-flat rounded-2xl bg-white p-5">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("move-in")}
              className={`flex-1 rounded-lg border px-4 py-2 font-sans text-sm font-semibold transition-colors ${
                mode === "move-in"
                  ? "border-moss bg-moss/10 text-moss"
                  : "border-line text-ink/60 hover:border-moss/50"
              }`}
            >
              Move-in
            </button>
            <button
              type="button"
              onClick={() => setMode("move-out")}
              className={`flex-1 rounded-lg border px-4 py-2 font-sans text-sm font-semibold transition-colors ${
                mode === "move-out"
                  ? "border-moss bg-moss/10 text-moss"
                  : "border-line text-ink/60 hover:border-moss/50"
              }`}
            >
              Move-out
            </button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Property address
              </label>
              <input
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Tenant name
              </label>
              <input
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Inspection date
              </label>
              <input
                type="date"
                value={inspectionDate}
                onChange={(e) => setInspectionDate(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
          </div>
        </div>

        <div className="card-flat rounded-2xl bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
              Room-by-room condition
            </p>
            <button
              type="button"
              onClick={addRow}
              className="font-sans text-sm font-semibold text-moss hover:underline"
            >
              + Add area
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {rows.map((r) => (
              <div key={r.id} className="flex flex-wrap gap-2 sm:flex-nowrap">
                <input
                  value={r.area}
                  onChange={(e) => updateRow(r.id, "area", e.target.value)}
                  placeholder="Area"
                  className="input-field w-full bg-white px-3 py-2 font-sans text-sm sm:w-1/3"
                />
                <select
                  value={r.condition}
                  onChange={(e) => updateRow(r.id, "condition", e.target.value)}
                  className="input-field bg-white px-3 py-2 font-sans text-sm"
                >
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  value={r.notes}
                  onChange={(e) => updateRow(r.id, "notes", e.target.value)}
                  placeholder="Notes (scuffs, stains, damage...)"
                  className="input-field flex-1 bg-white px-3 py-2 font-sans text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeRow(r.id)}
                  aria-label="Remove row"
                  className="w-9 shrink-0 rounded-lg border border-line font-sans text-lg text-ink/40 transition-colors hover:border-clay hover:text-clay"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="card-flat sticky top-6 rounded-2xl bg-mossdark p-7 text-paper">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-gold">
            {mode === "move-in" ? "Move-in report" : "Move-out report"}
          </p>
          <p className="mt-2 font-serif text-2xl font-bold">
            {rows.length} area{rows.length === 1 ? "" : "s"} recorded
          </p>
          <p className="mt-1 font-sans text-sm text-paper/70">
            Download a signed, dated PDF to keep on file alongside photos.
          </p>
          <button
            type="button"
            onClick={downloadPdf}
            disabled={generating}
            className="mt-7 w-full rounded-xl bg-clay py-3 text-center font-sans text-sm font-semibold text-white hover:bg-clay/90 disabled:opacity-60"
          >
            {generating ? "Generating…" : "Download PDF checklist"}
          </button>
          <p className="mt-4 font-sans text-xs text-paper/60">
            A signed move-in checklist is the single strongest piece of
            evidence in a deposit dispute — it proves what condition the
            unit was in before the tenant moved in.
          </p>
        </div>
      </div>
    </div>
  );
}
