"use client";

import { useEffect, useMemo, useState } from "react";
import { scheduleECategories } from "@/lib/schedule-e-data";

const STORAGE_KEY = "lt-expense-tracker";

function formatMoney(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default function ExpenseTracker() {
  const [propertyAddress, setPropertyAddress] = useState("");
  const [taxYear, setTaxYear] = useState(String(new Date().getFullYear() - 1));
  const [rentalIncome, setRentalIncome] = useState("");
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [hydrated, setHydrated] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (typeof d.propertyAddress === "string") setPropertyAddress(d.propertyAddress);
        if (typeof d.taxYear === "string") setTaxYear(d.taxYear);
        if (typeof d.rentalIncome === "string") setRentalIncome(d.rentalIncome);
        if (d.amounts && typeof d.amounts === "object") setAmounts(d.amounts);
      }
    } catch {
      /* ignore malformed drafts */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ propertyAddress, taxYear, rentalIncome, amounts })
      );
    } catch {
      /* storage unavailable */
    }
  }, [hydrated, propertyAddress, taxYear, rentalIncome, amounts]);

  const totalExpenses = useMemo(
    () =>
      scheduleECategories.reduce(
        (sum, c) => sum + (parseFloat(amounts[c.line]) || 0),
        0
      ),
    [amounts]
  );
  const income = parseFloat(rentalIncome) || 0;
  const net = income - totalExpenses;
  const trackedCount = scheduleECategories.filter(
    (c) => (parseFloat(amounts[c.line]) || 0) > 0
  ).length;

  function setAmount(line: string, value: string) {
    setAmounts((prev) => ({ ...prev, [line]: value }));
  }
  function clearAll() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setPropertyAddress("");
    setRentalIncome("");
    setAmounts({});
  }

  async function downloadPdf() {
    setGenerating(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "letter" });
      const margin = 52;
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

      doc.setFont("times", "bold");
      doc.setFontSize(16);
      doc.text(`Rental Expense Summary — ${taxYear}`, margin, y);
      y += lh * 1.6;

      doc.setFont("times", "normal");
      doc.setFontSize(11);
      if (propertyAddress) {
        doc.text(`Property: ${propertyAddress}`, margin, y);
        y += lh;
      }
      doc.text(
        `Prepared: ${new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`,
        margin,
        y
      );
      y += lh;
      doc.text("Organized by IRS Schedule E (Form 1040), Part I expense lines.", margin, y);
      y += lh * 1.5;

      doc.setFont("times", "bold");
      doc.text("Line", margin, y);
      doc.text("Category", margin + 44, y);
      doc.text("Amount", pageWidth - margin - 70, y);
      y += 5;
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += lh;

      doc.setFont("times", "normal");
      scheduleECategories.forEach((c) => {
        const v = parseFloat(amounts[c.line]) || 0;
        if (v <= 0) return;
        ensure(lh);
        doc.text(c.line, margin, y);
        doc.text(c.name, margin + 44, y);
        doc.text(formatMoney(v), pageWidth - margin - 70, y);
        y += lh;
      });

      y += 5;
      ensure(lh * 4);
      doc.line(margin, y, pageWidth - margin, y);
      y += lh;
      doc.setFont("times", "bold");
      doc.text("Total expenses", margin + 44, y);
      doc.text(formatMoney(totalExpenses), pageWidth - margin - 70, y);
      y += lh;
      if (income > 0) {
        doc.setFont("times", "normal");
        doc.text("Rental income received", margin + 44, y);
        doc.text(formatMoney(income), pageWidth - margin - 70, y);
        y += lh;
        doc.setFont("times", "bold");
        doc.text("Net (income − expenses)", margin + 44, y);
        doc.text(formatMoney(net), pageWidth - margin - 70, y);
        y += lh;
      }

      y += lh * 2;
      ensure(lh * 5);
      doc.setFont("times", "italic");
      doc.setFontSize(8.5);
      const disc =
        "This worksheet organizes figures you entered using the expense line structure of IRS Schedule E (Form 1040). It is not tax advice, is not a tax return, and Landlord Tools is neither a law firm nor an accounting firm. Whether a particular expense is deductible depends on your circumstances. Keep receipts and supporting records, and have a qualified tax professional review your return.";
      doc.splitTextToSize(disc, pageWidth - margin * 2).forEach((ln: string) => {
        doc.text(ln, margin, y);
        y += 11;
      });

      doc.save(`rental-expense-summary-${taxYear}.pdf`);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <div className="card-flat rounded-2xl bg-white p-5">
          <div className="grid gap-4 sm:grid-cols-3">
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
            <div>
              <label className="block font-sans text-xs text-ink/60">Tax year</label>
              <input
                value={taxYear}
                onChange={(e) => setTaxYear(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block font-sans text-xs text-ink/60">
                Total rental income received this year (optional)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={rentalIncome}
                onChange={(e) => setRentalIncome(e.target.value)}
                placeholder="0"
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
          </div>
        </div>

        <div className="card-flat rounded-2xl bg-white p-5">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
            Expenses by Schedule E line
          </p>
          <div className="mt-4 space-y-4">
            {scheduleECategories.map((c) => (
              <div key={c.line} className="border-b border-line/60 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-sans text-sm font-semibold text-ink">
                      <span className="text-ink/40">Line {c.line} · </span>
                      {c.name}
                    </p>
                    <p className="mt-0.5 font-sans text-xs text-ink/55">{c.examples}</p>
                  </div>
                  <div className="shrink-0">
                    <input
                      type="number"
                      inputMode="decimal"
                      value={amounts[c.line] ?? ""}
                      onChange={(e) => setAmount(c.line, e.target.value)}
                      placeholder="0"
                      aria-label={`${c.name} amount`}
                      className="input-field w-28 bg-white px-3 py-2 text-right font-sans text-sm"
                    />
                  </div>
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
            Total expenses
          </p>
          <p className="mt-2 font-serif text-4xl font-bold">
            {formatMoney(totalExpenses)}
          </p>
          <p className="mt-1 font-sans text-sm text-paper/70">
            {trackedCount} of {scheduleECategories.length} categories used
          </p>

          {income > 0 && (
            <dl className="mt-6 space-y-2 border-t border-white/10 pt-4 font-sans text-sm">
              <div className="flex justify-between">
                <dt className="text-paper/70">Rental income</dt>
                <dd>{formatMoney(income)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-paper/70">Less expenses</dt>
                <dd>−{formatMoney(totalExpenses)}</dd>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2 font-semibold">
                <dt>Net</dt>
                <dd className={net < 0 ? "text-[#f0a58a]" : undefined}>
                  {formatMoney(net)}
                </dd>
              </div>
            </dl>
          )}

          <button
            type="button"
            onClick={downloadPdf}
            disabled={generating}
            className="mt-7 w-full rounded-xl bg-clay py-3 text-center font-sans text-sm font-semibold text-white hover:bg-clay/90 disabled:opacity-60"
          >
            {generating ? "Generating…" : "Download summary (PDF)"}
          </button>
          <p className="mt-4 font-sans text-xs text-paper/60">
            Hand the PDF to your accountant, or keep it with your receipts.
            Everything stays in your browser — no account, nothing uploaded.
          </p>
        </div>
      </div>
    </div>
  );
}
