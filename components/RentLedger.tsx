"use client";

import { useEffect, useState } from "react";

type Payment = {
  id: number;
  date: string;
  period: string;
  amount: string;
  method: string;
  notes: string;
};

const METHODS = ["Cash", "Check", "Money order", "Bank transfer", "Online", "Other"];
const STORAGE_KEY = "lt-rent-ledger";

let nextId = 1;
function blankPayment(): Payment {
  return { id: nextId++, date: "", period: "", amount: "", method: METHODS[0], notes: "" };
}

function formatMoney(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function RentLedger() {
  const [landlordName, setLandlordName] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [payments, setPayments] = useState<Payment[]>([blankPayment()]);
  const [generating, setGenerating] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const total = payments.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
  const logged = payments.filter((p) => parseFloat(p.amount) > 0).length;
  const rent = parseFloat(monthlyRent) || 0;
  const monthsCovered = rent > 0 ? total / rent : 0;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (typeof d.landlordName === "string") setLandlordName(d.landlordName);
        if (typeof d.tenantName === "string") setTenantName(d.tenantName);
        if (typeof d.propertyAddress === "string") setPropertyAddress(d.propertyAddress);
        if (typeof d.monthlyRent === "string") setMonthlyRent(d.monthlyRent);
        if (Array.isArray(d.payments) && d.payments.length) {
          const restored: Payment[] = d.payments.map((p: Partial<Payment>) => ({
            id: typeof p.id === "number" ? p.id : nextId++,
            date: p.date ?? "",
            period: p.period ?? "",
            amount: p.amount ?? "",
            method: p.method ?? METHODS[0],
            notes: p.notes ?? "",
          }));
          nextId = Math.max(nextId, ...restored.map((p) => p.id)) + 1;
          setPayments(restored);
        }
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ landlordName, tenantName, propertyAddress, monthlyRent, payments })
      );
    } catch {
      /* ignore */
    }
  }, [hydrated, landlordName, tenantName, propertyAddress, monthlyRent, payments]);

  function updatePayment(id: number, field: keyof Payment, value: string) {
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  }
  function addPayment() {
    setPayments((prev) => [...prev, blankPayment()]);
  }
  function removePayment(id: number) {
    setPayments((prev) => (prev.length > 1 ? prev.filter((p) => p.id !== id) : prev));
  }
  function clearAll() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    nextId = 1;
    setLandlordName("");
    setTenantName("");
    setPropertyAddress("");
    setMonthlyRent("");
    setPayments([blankPayment()]);
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
      const lh = 15;

      const ensure = (extra: number) => {
        if (y + extra > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
      };
      const fmtDate = (v: string) =>
        v
          ? new Date(v + "T00:00:00").toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "—";

      doc.setFont("times", "bold");
      doc.setFontSize(16);
      doc.text("Rent Payment Ledger", margin, y);
      y += lh * 1.6;

      doc.setFont("times", "normal");
      doc.setFontSize(11);
      const prepared = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      doc.text(`Prepared: ${prepared}`, margin, y);
      y += lh;
      if (propertyAddress) {
        doc.text(`Property: ${propertyAddress}`, margin, y);
        y += lh;
      }
      if (tenantName) {
        doc.text(`Tenant: ${tenantName}`, margin, y);
        y += lh;
      }
      if (landlordName) {
        doc.text(`Landlord: ${landlordName}`, margin, y);
        y += lh;
      }
      if (rent > 0) {
        doc.text(`Monthly rent: ${formatMoney(rent)}`, margin, y);
        y += lh;
      }
      y += lh * 0.5;

      // columns
      const cDate = margin;
      const cPeriod = margin + 90;
      const cAmount = margin + 230;
      const cMethod = margin + 320;
      const cNotes = margin + 410;

      doc.setFont("times", "bold");
      doc.text("Date", cDate, y);
      doc.text("Period", cPeriod, y);
      doc.text("Amount", cAmount, y);
      doc.text("Method", cMethod, y);
      doc.text("Notes", cNotes, y);
      y += 5;
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += lh;

      doc.setFont("times", "normal");
      payments
        .filter((p) => p.date || p.amount || p.period || p.notes)
        .forEach((p) => {
          const noteLines = doc.splitTextToSize(p.notes || "—", pageWidth - margin - cNotes);
          ensure(lh * Math.max(1, noteLines.length));
          doc.text(fmtDate(p.date), cDate, y);
          doc.text(p.period || "—", cPeriod, y);
          doc.text(formatMoney(parseFloat(p.amount) || 0), cAmount, y);
          doc.text(p.method, cMethod, y);
          doc.text(noteLines, cNotes, y);
          y += lh * Math.max(1, noteLines.length);
        });

      y += 5;
      doc.line(margin, y, pageWidth - margin, y);
      y += lh;
      doc.setFont("times", "bold");
      doc.text("Total collected", cDate, y);
      doc.text(formatMoney(total), cAmount, y);
      y += lh;
      if (rent > 0) {
        doc.setFont("times", "normal");
        doc.text(
          `Equivalent to ${monthsCovered.toFixed(1)} months at the stated rent.`,
          cDate,
          y
        );
        y += lh;
      }

      y += lh * 2;
      ensure(lh * 4);
      doc.setFont("times", "italic");
      doc.setFontSize(8.5);
      const disc =
        "This ledger is a self-help record generated from the entries above. It is not legal or tax advice, and Landlord Tools is not a law firm or an accountant. Keep your own supporting records (receipts, bank statements); consult a professional for advice specific to your situation.";
      doc.splitTextToSize(disc, pageWidth - margin * 2).forEach((ln: string) => {
        doc.text(ln, margin, y);
        y += 11;
      });

      doc.save("rent-payment-ledger.pdf");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <div className="card-flat rounded-2xl bg-white p-5">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
            Tenancy
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
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
            <div>
              <label className="block font-sans text-xs text-ink/60">Property address</label>
              <input
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Monthly rent (optional)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
          </div>
        </div>

        <div className="card-flat rounded-2xl bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
              Payments
            </p>
            <button
              type="button"
              onClick={addPayment}
              className="font-sans text-sm font-semibold text-moss hover:underline"
            >
              + Add payment
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {payments.map((p) => (
              <div key={p.id} className="rounded-xl border border-line p-3">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-wide text-ink/40">
                      Date
                    </label>
                    <input
                      type="date"
                      value={p.date}
                      onChange={(e) => updatePayment(p.id, "date", e.target.value)}
                      className="input-field mt-0.5 w-full bg-white px-2 py-1.5 font-sans text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-wide text-ink/40">
                      Period
                    </label>
                    <input
                      value={p.period}
                      onChange={(e) => updatePayment(p.id, "period", e.target.value)}
                      placeholder="e.g. June"
                      className="input-field mt-0.5 w-full bg-white px-2 py-1.5 font-sans text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-wide text-ink/40">
                      Amount
                    </label>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={p.amount}
                      onChange={(e) => updatePayment(p.id, "amount", e.target.value)}
                      placeholder="0.00"
                      className="input-field mt-0.5 w-full bg-white px-2 py-1.5 font-sans text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-wide text-ink/40">
                      Method
                    </label>
                    <select
                      value={p.method}
                      onChange={(e) => updatePayment(p.id, "method", e.target.value)}
                      className="input-field mt-0.5 w-full bg-white px-2 py-1.5 font-sans text-sm"
                    >
                      {METHODS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <input
                    value={p.notes}
                    onChange={(e) => updatePayment(p.id, "notes", e.target.value)}
                    placeholder="Notes (partial payment, late fee included, etc.)"
                    className="input-field flex-1 bg-white px-3 py-1.5 font-sans text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removePayment(p.id)}
                    aria-label="Remove payment"
                    className="w-9 shrink-0 rounded-lg border border-line font-sans text-lg text-ink/40 transition-colors hover:border-clay hover:text-clay"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="font-sans text-xs text-ink/40">Auto-saved in your browser.</p>
            <button
              type="button"
              onClick={clearAll}
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
            Total collected
          </p>
          <p className="mt-2 font-serif text-4xl font-bold">{formatMoney(total)}</p>
          <p className="mt-1 font-sans text-sm text-paper/70">
            {logged} payment{logged === 1 ? "" : "s"} logged
          </p>

          {rent > 0 && (
            <div className="mt-6 border-t border-white/10 pt-4 font-sans text-sm">
              <div className="flex justify-between">
                <span className="text-paper/70">Months of rent covered</span>
                <span>{monthsCovered.toFixed(1)}</span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={downloadPdf}
            disabled={generating}
            className="mt-7 w-full rounded-xl bg-clay py-3 text-center font-sans text-sm font-semibold text-white hover:bg-clay/90 disabled:opacity-60"
          >
            {generating ? "Generating…" : "Download ledger (PDF)"}
          </button>
          <p className="mt-4 font-sans text-xs text-paper/60">
            A running rent ledger is your paper trail if a payment history is
            ever questioned. Everything stays in your browser — no account,
            nothing uploaded.
          </p>
        </div>
      </div>
    </div>
  );
}
