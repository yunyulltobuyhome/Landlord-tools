"use client";

import { useEffect, useRef, useState } from "react";

type Condition = "Good" | "Fair" | "Poor" | "N/A";
type Photo = { dataUrl: string; w: number; h: number };
type Row = {
  id: number;
  area: string;
  condition: Condition;
  notes: string;
  photos: Photo[];
};

const CONDITIONS: Condition[] = ["Good", "Fair", "Poor", "N/A"];
const STORAGE_KEY = "lt-condition-checklist";

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
  ].map((area) => ({
    id: nextId++,
    area,
    condition: "Good" as Condition,
    notes: "",
    photos: [],
  }));
}

// Downscale a selected image to a max dimension and re-encode as JPEG so the
// generated PDF stays small. Runs entirely in the browser — nothing uploads.
function fileToScaledJpeg(file: File, maxDim = 1100): Promise<Photo> {
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
        resolve({ dataUrl: canvas.toDataURL("image/jpeg", 0.72), w: width, h: height });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function ConditionChecklist() {
  const [mode, setMode] = useState<"move-in" | "move-out">("move-in");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
  const [rows, setRows] = useState<Row[]>(defaultRows());
  const [generating, setGenerating] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const fileInputs = useRef<Record<number, HTMLInputElement | null>>({});

  const photoCount = rows.reduce((n, r) => n + r.photos.length, 0);

  // Restore a saved draft (text fields only — photos are never persisted).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.mode === "move-in" || d.mode === "move-out") setMode(d.mode);
        if (typeof d.propertyAddress === "string") setPropertyAddress(d.propertyAddress);
        if (typeof d.tenantName === "string") setTenantName(d.tenantName);
        if (typeof d.inspectionDate === "string") setInspectionDate(d.inspectionDate);
        if (Array.isArray(d.rows) && d.rows.length) {
          const restored: Row[] = d.rows.map((r: Partial<Row>) => ({
            id: typeof r.id === "number" ? r.id : nextId++,
            area: r.area ?? "",
            condition: (r.condition as Condition) ?? "Good",
            notes: r.notes ?? "",
            photos: [],
          }));
          nextId = Math.max(nextId, ...restored.map((r) => r.id)) + 1;
          setRows(restored);
        }
      }
    } catch {
      /* ignore malformed drafts */
    }
    setHydrated(true);
  }, []);

  // Autosave text fields whenever they change (post-hydration).
  useEffect(() => {
    if (!hydrated) return;
    try {
      const toSave = {
        mode,
        propertyAddress,
        tenantName,
        inspectionDate,
        rows: rows.map(({ id, area, condition, notes }) => ({
          id,
          area,
          condition,
          notes,
        })),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      /* storage full or unavailable — ignore */
    }
  }, [hydrated, mode, propertyAddress, tenantName, inspectionDate, rows]);

  function updateRow(id: number, field: "area" | "condition" | "notes", value: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }
  function addRow() {
    setRows((prev) => [
      ...prev,
      { id: nextId++, area: "", condition: "Good", notes: "", photos: [] },
    ]);
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
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, photos: [...r.photos, ...good] } : r))
      );
    }
  }
  function removePhoto(id: number, idx: number) {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, photos: r.photos.filter((_, i) => i !== idx) } : r
      )
    );
  }
  function clearDraft() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    nextId = 1;
    setMode("move-in");
    setPropertyAddress("");
    setTenantName("");
    setInspectionDate("");
    setRows(defaultRows());
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
        mode === "move-in" ? "Move-In Condition Checklist" : "Move-Out Condition Checklist",
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
        const label = r.photos.length ? `${r.area || "-"} (${r.photos.length} photo${r.photos.length === 1 ? "" : "s"})` : r.area || "-";
        const noteLines = doc.splitTextToSize(r.notes || "-", pageWidth - margin - (margin + 310));
        ensureSpace(lineHeight * Math.max(1, noteLines.length));
        doc.text(label, margin, y);
        doc.text(r.condition, margin + 220, y);
        doc.text(noteLines, margin + 310, y);
        y += lineHeight * Math.max(1, noteLines.length);
      });

      // Photo documentation section
      const withPhotos = rows.filter((r) => r.photos.length);
      if (withPhotos.length) {
        y += lineHeight * 1.5;
        ensureSpace(lineHeight * 3);
        doc.setFont("times", "bold");
        doc.setFontSize(13);
        doc.text("Photo documentation", margin, y);
        y += lineHeight * 1.4;

        const gap = 16;
        const boxW = (pageWidth - margin * 2 - gap) / 2;
        const boxH = 200;

        withPhotos.forEach((r) => {
          doc.setFont("times", "bold");
          doc.setFontSize(11);
          ensureSpace(lineHeight * 2);
          doc.text(`${r.area || "Area"} — ${r.condition}`, margin, y);
          y += lineHeight;

          let col = 0;
          r.photos.forEach((p) => {
            if (col === 0) ensureSpace(boxH + lineHeight);
            const ratio = Math.min(boxW / p.w, boxH / p.h);
            const w = p.w * ratio;
            const h = p.h * ratio;
            const x = margin + col * (boxW + gap);
            try {
              doc.addImage(p.dataUrl, "JPEG", x, y, w, h);
            } catch {
              /* skip an image that fails to embed */
            }
            col++;
            if (col === 2) {
              y += boxH + 12;
              col = 0;
            }
          });
          if (col === 1) y += boxH + 12;
          y += lineHeight * 0.5;
        });
      }

      y += lineHeight * 2;
      ensureSpace(lineHeight * 8);
      doc.setFont("times", "normal");
      doc.setFontSize(11);
      doc.text("_____________________________", margin, y);
      doc.text("_____________________________", margin + 260, y);
      y += lineHeight;
      doc.text("Landlord signature / date", margin, y);
      doc.text("Tenant signature / date", margin + 260, y);

      y += lineHeight * 2;
      ensureSpace(lineHeight * 4);
      doc.setFont("times", "italic");
      doc.setFontSize(8.5);
      const disclaimer =
        "This checklist is a self-help template for documenting a unit's condition, not legal advice, and Landlord Tools is not a law firm. It does not guarantee any outcome in a deposit dispute. Landlord-tenant rules vary by state and locality; consult the applicable statute or a licensed attorney with questions.";
      doc.splitTextToSize(disclaimer, pageWidth - margin * 2).forEach((ln: string) => {
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
              <label className="block font-sans text-xs text-ink/60">Property address</label>
              <input
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
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
              <label className="block font-sans text-xs text-ink/60">Inspection date</label>
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
              Room-by-room condition &amp; photos
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
                    placeholder="Notes (scuffs, stains, damage...)"
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
                  <input
                    ref={(el) => {
                      fileInputs.current[r.id] = el;
                    }}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      addPhotos(r.id, e.target.files);
                      e.target.value = "";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputs.current[r.id]?.click()}
                    className="rounded-lg border border-dashed border-line px-3 py-2 font-sans text-xs font-semibold text-ink/60 transition-colors hover:border-moss hover:text-moss"
                  >
                    + Add photos
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="font-sans text-xs text-ink/40">
              Auto-saved in your browser. Photos stay on your device.
            </p>
            <button
              type="button"
              onClick={clearDraft}
              className="font-sans text-xs font-semibold text-ink/40 hover:text-clay"
            >
              Clear &amp; reset
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="card-flat sticky top-6 rounded-2xl bg-mossdark p-7 text-paper">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-gold">
            {mode === "move-in" ? "Move-in report" : "Move-out report"}
          </p>
          <p className="mt-2 font-serif text-2xl font-bold">
            {rows.length} area{rows.length === 1 ? "" : "s"}
            {photoCount > 0 ? ` · ${photoCount} photo${photoCount === 1 ? "" : "s"}` : ""}
          </p>
          <p className="mt-1 font-sans text-sm text-paper/70">
            Download a signed, dated PDF with your photos embedded as evidence.
          </p>
          <button
            type="button"
            onClick={downloadPdf}
            disabled={generating}
            className="mt-7 w-full rounded-xl bg-clay py-3 text-center font-sans text-sm font-semibold text-white hover:bg-clay/90 disabled:opacity-60"
          >
            {generating ? "Generating…" : "Download photo report (PDF)"}
          </button>
          <p className="mt-4 font-sans text-xs text-paper/60">
            A dated, photo-backed condition report is the single strongest
            piece of evidence in a deposit dispute. Photos are processed in
            your browser and never uploaded.
          </p>
        </div>
      </div>
    </div>
  );
}
