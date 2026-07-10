"use client";

import { useMemo, useState } from "react";
import { statesData } from "@/lib/states-data";

type Condition = "Good" | "Fair" | "Poor" | "N/A";
type Photo = { dataUrl: string; w: number; h: number };
type ConditionRow = {
  id: number;
  area: string;
  condition: Condition;
  notes: string;
  photos: Photo[];
};
type Deduction = { id: number; label: string; amount: string };

const CONDITIONS: Condition[] = ["Good", "Fair", "Poor", "N/A"];
let nextId = 1;

function defaultRows(): ConditionRow[] {
  return [
    "Living room — walls & floors",
    "Kitchen",
    "Bedroom(s)",
    "Bathroom(s)",
    "Windows & doors",
    "Exterior / yard",
  ].map((area) => ({
    id: nextId++,
    area,
    condition: "Good" as Condition,
    notes: "",
    photos: [],
  }));
}

function formatMoney(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
function longDate(d: Date) {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function fileToScaledJpeg(file: File, maxDim = 1000): Promise<Photo> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("decode failed"));
      img.onload = () => {
        let { width, height } = img;
        const scale = Math.min(1, maxDim / Math.max(width, height));
        width = Math.max(1, Math.round(width * scale));
        height = Math.max(1, Math.round(height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no canvas"));
        ctx.drawImage(img, 0, 0, width, height);
        resolve({ dataUrl: canvas.toDataURL("image/jpeg", 0.7), w: width, h: height });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

const STEPS = ["Details", "Deductions", "Condition & photos", "Review & download"] as const;

export default function MoveOutPacket() {
  const [step, setStep] = useState(0);

  // Shared details
  const [stateSlug, setStateSlug] = useState("california");
  const [landlordName, setLandlordName] = useState("");
  const [landlordAddress, setLandlordAddress] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [moveOutDate, setMoveOutDate] = useState("");
  const [depositAmount, setDepositAmount] = useState("1500");

  // Deductions
  const [deductions, setDeductions] = useState<Deduction[]>([
    { id: nextId++, label: "", amount: "" },
  ]);

  // Condition
  const [rows, setRows] = useState<ConditionRow[]>(defaultRows());

  const [generating, setGenerating] = useState(false);

  const state = statesData.find((s) => s.slug === stateSlug)!;
  const deposit = parseFloat(depositAmount) || 0;
  const totalDeductions = deductions.reduce((s, d) => s + (parseFloat(d.amount) || 0), 0);
  const refund = Math.max(0, deposit - totalDeductions);
  const deadline = useMemo(
    () => (moveOutDate ? addDays(new Date(moveOutDate + "T00:00:00"), state.returnDeadlineDays) : null),
    [moveOutDate, state]
  );
  const photoCount = rows.reduce((n, r) => n + r.photos.length, 0);

  function updateDeduction(id: number, field: "label" | "amount", value: string) {
    setDeductions((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  }
  function addDeduction() {
    setDeductions((prev) => [...prev, { id: nextId++, label: "", amount: "" }]);
  }
  function removeDeduction(id: number) {
    setDeductions((prev) => prev.filter((d) => d.id !== id));
  }

  function updateRow(id: number, field: "area" | "condition" | "notes", value: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }
  function addRow() {
    setRows((prev) => [...prev, { id: nextId++, area: "", condition: "Good", notes: "", photos: [] }]);
  }
  function removeRow(id: number) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }
  async function addPhotos(id: number, files: FileList | null) {
    if (!files || !files.length) return;
    const scaled = await Promise.all(
      Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .map((f) => fileToScaledJpeg(f).catch(() => null))
    );
    const good = scaled.filter((p): p is Photo => p !== null);
    if (good.length) {
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, photos: [...r.photos, ...good] } : r)));
    }
  }
  function removePhoto(id: number, idx: number) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, photos: r.photos.filter((_, i) => i !== idx) } : r))
    );
  }

  async function downloadPacket() {
    setGenerating(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "letter" });
      const margin = 56;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const lh = 15;
      let y = margin;

      const ensure = (extra: number) => {
        if (y + extra > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
      };
      const heading = (text: string) => {
        ensure(lh * 2.5);
        doc.setFont("times", "bold");
        doc.setFontSize(15);
        doc.text(text, margin, y);
        y += lh * 1.6;
      };
      const body = (text: string, opts: { bold?: boolean; size?: number } = {}) => {
        doc.setFont("times", opts.bold ? "bold" : "normal");
        doc.setFontSize(opts.size ?? 11);
        doc.splitTextToSize(text, pageWidth - margin * 2).forEach((ln: string) => {
          ensure(lh);
          doc.text(ln, margin, y);
          y += lh;
        });
      };

      const today = longDate(new Date());
      const moveOutLong = moveOutDate ? longDate(new Date(moveOutDate + "T00:00:00")) : "—";
      const deadlineLong = deadline ? longDate(deadline) : "—";

      // ---- Cover / summary ----
      doc.setFont("times", "bold");
      doc.setFontSize(20);
      doc.text("Move-Out Packet", margin, y);
      y += lh * 2;
      body(`Prepared: ${today}`);
      if (propertyAddress) body(`Property: ${propertyAddress}`);
      if (tenantName) body(`Tenant: ${tenantName}`);
      if (landlordName) body(`Landlord: ${landlordName}`);
      body(`State: ${state.name}`);
      body(`Move-out date: ${moveOutLong}`);
      y += lh * 0.5;

      heading("Deposit summary");
      body(`Security deposit held: ${formatMoney(deposit)}`);
      body(`Total deductions: ${formatMoney(totalDeductions)}`, { bold: true });
      body(`Refund due to tenant: ${formatMoney(refund)}`, { bold: true, size: 13 });
      y += lh * 0.3;
      body(
        `Under ${state.statute}, the deposit (or an itemized statement) is due within ${state.returnDeadlineDays} days of move-out — by ${deadlineLong}.`
      );
      body(state.penalty);

      // ---- Itemized deduction statement ----
      doc.addPage();
      y = margin;
      heading("Itemized Deduction Statement");
      body(`Security deposit received: ${formatMoney(deposit)}`, { bold: true });
      y += lh * 0.3;
      const filledDeductions = deductions.filter((d) => d.label || d.amount);
      if (filledDeductions.length) {
        filledDeductions.forEach((d) => {
          body(`${d.label || "Untitled deduction"}: -${formatMoney(parseFloat(d.amount) || 0)}`);
        });
      } else {
        body("No deductions itemized.");
      }
      y += lh * 0.3;
      body(`Balance due to tenant: ${formatMoney(refund)}`, { bold: true, size: 13 });
      y += lh * 1.5;
      ensure(lh * 4);
      doc.setLineWidth(0.5);
      doc.line(margin, y, margin + 220, y);
      doc.line(margin + 260, y, margin + 480, y);
      y += lh;
      body("Landlord signature / date");

      // ---- Condition & photo report ----
      doc.addPage();
      y = margin;
      heading("Move-Out Condition Report");
      const filledRows = rows.filter((r) => r.area || r.notes || r.photos.length);
      filledRows.forEach((r) => {
        ensure(lh * 2);
        doc.setFont("times", "bold");
        doc.setFontSize(11);
        doc.text(`${r.area || "Area"} — ${r.condition}`, margin, y);
        y += lh;
        if (r.notes) body(r.notes);

        const gap = 16;
        const boxW = (pageWidth - margin * 2 - gap) / 2;
        const boxH = 190;
        let col = 0;
        r.photos.forEach((p) => {
          if (col === 0) ensure(boxH + lh);
          const ratio = Math.min(boxW / p.w, boxH / p.h);
          const w = p.w * ratio;
          const h = p.h * ratio;
          const x = margin + col * (boxW + gap);
          try {
            doc.addImage(p.dataUrl, "JPEG", x, y, w, h);
          } catch {
            /* skip image that fails to embed */
          }
          col++;
          if (col === 2) {
            y += boxH + 12;
            col = 0;
          }
        });
        if (col === 1) y += boxH + 12;
        y += lh * 0.6;
      });
      y += lh;
      ensure(lh * 4);
      doc.setLineWidth(0.5);
      doc.line(margin, y, margin + 220, y);
      doc.line(margin + 260, y, margin + 480, y);
      y += lh;
      body("Landlord signature / date");
      doc.text("Tenant signature / date", margin + 260, y - lh);

      // ---- Disclaimer ----
      y += lh * 2;
      ensure(lh * 5);
      doc.setFont("times", "italic");
      doc.setFontSize(8.5);
      const disc =
        "This Move-Out Packet is a self-help template combining a deposit calculation, an itemized deduction statement, and a condition report generated from the information and photos you entered. It is not legal advice, and Landlord Tools is not a law firm. It does not guarantee any outcome. Landlord-tenant rules vary by state and locality and change over time — confirm current requirements with the applicable statute or a licensed attorney.";
      doc.splitTextToSize(disc, pageWidth - margin * 2).forEach((ln: string) => {
        doc.text(ln, margin, y);
        y += 11;
      });

      doc.save("move-out-packet.pdf");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        {/* Step nav */}
        <div className="flex flex-wrap gap-2">
          {STEPS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(i)}
              className={`rounded-lg border px-3 py-2 font-sans text-xs font-semibold transition-colors ${
                step === i
                  ? "border-moss bg-moss/10 text-moss"
                  : "border-line text-ink/60 hover:border-moss/50"
              }`}
            >
              {i + 1}. {label}
            </button>
          ))}
        </div>

        {step === 0 && (
          <div className="card-flat rounded-2xl bg-white p-5">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
              Details
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
                <label className="block font-sans text-xs text-ink/60">Move-out date</label>
                <input
                  type="date"
                  value={moveOutDate}
                  onChange={(e) => setMoveOutDate(e.target.value)}
                  className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
                />
              </div>
              <div>
                <label className="block font-sans text-xs text-ink/60">Tenant name</label>
                <input
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
                />
              </div>
              <div>
                <label className="block font-sans text-xs text-ink/60">Landlord name</label>
                <input
                  value={landlordName}
                  onChange={(e) => setLandlordName(e.target.value)}
                  className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-sans text-xs text-ink/60">Property address</label>
                <input
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-sans text-xs text-ink/60">Landlord mailing address</label>
                <input
                  value={landlordAddress}
                  onChange={(e) => setLandlordAddress(e.target.value)}
                  className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
                />
              </div>
              <div>
                <label className="block font-sans text-xs text-ink/60">Security deposit held</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="card-flat rounded-2xl bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
                Deductions
              </p>
              <button
                type="button"
                onClick={addDeduction}
                className="font-sans text-sm font-semibold text-moss hover:underline"
              >
                + Add line
              </button>
            </div>
            <div className="mt-3 space-y-3">
              {deductions.map((d) => (
                <div key={d.id} className="flex gap-2">
                  <input
                    value={d.label}
                    onChange={(e) => updateDeduction(d.id, "label", e.target.value)}
                    placeholder="e.g. Carpet cleaning"
                    className="input-field flex-1 bg-white px-3 py-2 font-sans text-sm"
                  />
                  <input
                    type="number"
                    inputMode="decimal"
                    value={d.amount}
                    onChange={(e) => updateDeduction(d.id, "amount", e.target.value)}
                    placeholder="0.00"
                    className="input-field w-28 bg-white px-3 py-2 font-sans text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeDeduction(d.id)}
                    aria-label="Remove line"
                    className="w-9 shrink-0 rounded-lg border border-line font-sans text-lg text-ink/40 transition-colors hover:border-clay hover:text-clay"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-4 font-sans text-xs text-ink/50">
              Not sure what&apos;s a fair deduction?{" "}
              <a href="/can-a-landlord-charge-for" className="underline hover:text-moss">
                See the wear-and-tear guide
              </a>
              .
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="card-flat rounded-2xl bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
                Condition &amp; photos
              </p>
              <button
                type="button"
                onClick={addRow}
                className="font-sans text-sm font-semibold text-moss hover:underline"
              >
                + Add area
              </button>
            </div>
            <div className="mt-3 space-y-4">
              {rows.map((r) => (
                <div key={r.id} className="rounded-xl border border-line p-3">
                  <div className="flex flex-wrap gap-2 sm:flex-nowrap">
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
                      placeholder="Notes"
                      className="input-field flex-1 bg-white px-3 py-2 font-sans text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeRow(r.id)}
                      aria-label="Remove area"
                      className="w-9 shrink-0 rounded-lg border border-line font-sans text-lg text-ink/40 transition-colors hover:border-clay hover:text-clay"
                    >
                      ×
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {r.photos.map((p, i) => (
                      <div key={i} className="group relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.dataUrl}
                          alt={`${r.area} photo ${i + 1}`}
                          className="h-14 w-14 rounded-lg border border-line object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(r.id, i)}
                          aria-label="Remove photo"
                          className="absolute -right-1.5 -top-1.5 h-5 w-5 rounded-full bg-ink text-xs font-bold text-white opacity-90"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <label className="cursor-pointer rounded-lg border border-dashed border-line px-3 py-2 font-sans text-xs font-semibold text-ink/60 transition-colors hover:border-moss hover:text-moss">
                      + Add photos
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          addPhotos(r.id, e.target.files);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="card-flat rounded-2xl bg-white p-5">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
              Review
            </p>
            <dl className="mt-3 space-y-2 font-sans text-sm">
              <div className="flex justify-between border-b border-line/60 py-2">
                <dt className="text-ink/60">State</dt>
                <dd>{state.name}</dd>
              </div>
              <div className="flex justify-between border-b border-line/60 py-2">
                <dt className="text-ink/60">Deposit held</dt>
                <dd>{formatMoney(deposit)}</dd>
              </div>
              <div className="flex justify-between border-b border-line/60 py-2">
                <dt className="text-ink/60">Deductions itemized</dt>
                <dd>{deductions.filter((d) => d.label || d.amount).length}</dd>
              </div>
              <div className="flex justify-between border-b border-line/60 py-2">
                <dt className="text-ink/60">Areas documented</dt>
                <dd>{rows.filter((r) => r.area).length}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-ink/60">Photos attached</dt>
                <dd>{photoCount}</dd>
              </div>
            </dl>
            <p className="mt-4 font-sans text-xs text-ink/50">
              Your packet will include: a summary cover page, the itemized
              deduction statement, and the photo condition report — all in
              one PDF.
            </p>
          </div>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-lg border border-line px-4 py-2 font-sans text-sm font-semibold text-ink/60 transition-colors hover:border-moss disabled:opacity-40"
          >
            ← Back
          </button>
          {step < STEPS.length - 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="rounded-lg bg-ink px-4 py-2 font-sans text-sm font-semibold text-white hover:bg-ink/90"
            >
              Next →
            </button>
          )}
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="card-flat sticky top-6 rounded-2xl bg-mossdark p-7 text-paper">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-gold">
            Refund due
          </p>
          <p className="mt-2 font-serif text-4xl font-bold">{formatMoney(refund)}</p>
          <dl className="mt-6 space-y-2 border-t border-white/10 pt-4 font-sans text-sm">
            <div className="flex justify-between">
              <dt className="text-paper/70">Deposit held</dt>
              <dd>{formatMoney(deposit)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-paper/70">Total deductions</dt>
              <dd>−{formatMoney(totalDeductions)}</dd>
            </div>
          </dl>
          {deadline && (
            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-gold">
                {state.name} deadline
              </p>
              <p className="mt-1 font-serif text-lg font-bold">{longDate(deadline)}</p>
            </div>
          )}
          <div className="mt-6 border-t border-white/10 pt-4 font-sans text-sm">
            <div className="flex justify-between">
              <span className="text-paper/70">Areas documented</span>
              <span>{rows.filter((r) => r.area).length}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-paper/70">Photos attached</span>
              <span>{photoCount}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={downloadPacket}
            disabled={generating}
            className="mt-7 w-full rounded-xl bg-clay py-3 text-center font-sans text-sm font-semibold text-white hover:bg-clay/90 disabled:opacity-60"
          >
            {generating ? "Generating…" : "Download Move-Out Packet (PDF)"}
          </button>
          <p className="mt-4 font-sans text-xs text-paper/60">
            One PDF: deposit summary, itemized deduction statement, and
            photo-backed condition report. Everything is generated in your
            browser — nothing is uploaded.
          </p>
        </div>
      </div>
    </div>
  );
}
