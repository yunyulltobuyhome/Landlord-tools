"use client";

import { useState } from "react";

const METHODS = ["Cash", "Check", "Money order", "Bank transfer", "Online payment", "Other"];

function formatMoney(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function RentReceipt() {
  const [landlordName, setLandlordName] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [amountPaid, setAmountPaid] = useState("1500");
  const [balanceDue, setBalanceDue] = useState("0");
  const [method, setMethod] = useState(METHODS[0]);
  const [generating, setGenerating] = useState(false);

  async function downloadPdf() {
    setGenerating(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "letter" });
      const margin = 56;
      let y = margin;
      const lineHeight = 18;
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFont("times", "bold");
      doc.setFontSize(18);
      doc.text("Rent Payment Receipt", margin, y);
      y += lineHeight * 1.7;

      doc.setFont("times", "normal");
      doc.setFontSize(11);

      const fmtDate = (v: string) =>
        v
          ? new Date(v + "T00:00:00").toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "";

      const rows: [string, string][] = [
        ["Received from (tenant)", tenantName || "—"],
        ["Received by (landlord)", landlordName || "—"],
        ["Property address", propertyAddress || "—"],
        ["Rental period", periodStart ? fmtDate(periodStart) : "—"],
        ["Payment date", paymentDate ? fmtDate(paymentDate) : "—"],
        ["Payment method", method],
      ];

      rows.forEach(([label, value]) => {
        doc.setFont("times", "bold");
        doc.text(`${label}:`, margin, y);
        doc.setFont("times", "normal");
        doc.text(value, margin + 170, y);
        y += lineHeight;
      });

      y += 6;
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += lineHeight * 1.3;

      doc.setFont("times", "bold");
      doc.setFontSize(14);
      doc.text("Amount paid", margin, y);
      doc.text(formatMoney(parseFloat(amountPaid) || 0), pageWidth - margin - 100, y);
      y += lineHeight * 1.4;

      const balance = parseFloat(balanceDue) || 0;
      if (balance > 0) {
        doc.setFont("times", "normal");
        doc.setFontSize(11);
        doc.text("Remaining balance due", margin, y);
        doc.text(formatMoney(balance), pageWidth - margin - 100, y);
        y += lineHeight * 1.4;
      }

      y += lineHeight;
      doc.setFont("times", "normal");
      doc.setFontSize(10);
      doc.text("_____________________________", margin, y);
      y += lineHeight;
      doc.text("Landlord signature", margin, y);

      doc.save("rent-receipt.pdf");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <div className="card-flat rounded-2xl bg-white p-5">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
            Parties &amp; property
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Landlord name
              </label>
              <input
                value={landlordName}
                onChange={(e) => setLandlordName(e.target.value)}
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
            <div className="sm:col-span-2">
              <label className="block font-sans text-xs text-ink/60">
                Property address
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
            Payment details
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Rental period (month of)
              </label>
              <input
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Payment date
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Amount paid
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Remaining balance (if partial)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={balanceDue}
                onChange={(e) => setBalanceDue(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-sans text-xs text-ink/60">
                Payment method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              >
                {METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="card-flat sticky top-6 rounded-2xl bg-mossdark p-7 text-paper">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-gold">
            Amount paid
          </p>
          <p className="mt-2 font-serif text-4xl font-bold">
            {formatMoney(parseFloat(amountPaid) || 0)}
          </p>
          <p className="mt-1 font-sans text-sm text-paper/70">
            via {method.toLowerCase()}
          </p>
          <button
            type="button"
            onClick={downloadPdf}
            disabled={generating}
            className="mt-7 w-full rounded-xl bg-clay py-3 text-center font-sans text-sm font-semibold text-white hover:bg-clay/90 disabled:opacity-60"
          >
            {generating ? "Generating…" : "Download PDF receipt"}
          </button>
          <p className="mt-4 font-sans text-xs text-paper/60">
            A dated receipt for every payment protects both sides if a
            payment date or amount is ever disputed later.
          </p>
        </div>
      </div>
    </div>
  );
}
