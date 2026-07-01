"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { statesData } from "@/lib/states-data";

type Deduction = { id: number; label: string; amount: string };

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatMoney(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

let nextId = 1;

export default function Calculator() {
  const [stateSlug, setStateSlug] = useState("california");
  const [depositAmount, setDepositAmount] = useState("1500");
  const [moveInDate, setMoveInDate] = useState("");
  const [moveOutDate, setMoveOutDate] = useState("");
  const [deductions, setDeductions] = useState<Deduction[]>([
    { id: nextId++, label: "", amount: "" },
  ]);

  const state = statesData.find((s) => s.slug === stateSlug)!;

  const deposit = parseFloat(depositAmount) || 0;
  const totalDeductions = deductions.reduce(
    (sum, d) => sum + (parseFloat(d.amount) || 0),
    0
  );

  const interestOwed = useMemo(() => {
    if (!state.interestRequired || !moveInDate) return 0;
    const start = new Date(moveInDate);
    const end = moveOutDate ? new Date(moveOutDate) : new Date();
    const years = Math.max(
      0,
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    );
    const rateGuess = 0.05;
    return deposit * rateGuess * years;
  }, [state, moveInDate, moveOutDate, deposit]);

  const refund = Math.max(0, deposit + interestOwed - totalDeductions);

  const deadlineDate = moveOutDate
    ? addDays(new Date(moveOutDate), state.returnDeadlineDays)
    : null;

  function updateDeduction(id: number, field: "label" | "amount", value: string) {
    setDeductions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  }

  function addDeduction() {
    setDeductions((prev) => [...prev, { id: nextId++, label: "", amount: "" }]);
  }

  function removeDeduction(id: number) {
    setDeductions((prev) => prev.filter((d) => d.id !== id));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <div className="card-flat bg-white p-5">
          <label className="block font-sans text-xs font-bold uppercase tracking-widest text-moss">
            Rental property state
          </label>
          <select
            value={stateSlug}
            onChange={(e) => setStateSlug(e.target.value)}
            className="mt-2 w-full rounded-none border-2 border-ink bg-white px-3 py-2 font-sans text-sm"
          >
            {statesData.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-sans text-xs font-bold uppercase tracking-widest text-moss">
                Security deposit held
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="mt-2 w-full rounded-none border-2 border-ink bg-white px-3 py-2 font-sans text-sm"
                placeholder="1500"
              />
            </div>
            <div>
              <label className="block font-sans text-xs font-bold uppercase tracking-widest text-moss">
                Move-out date
              </label>
              <input
                type="date"
                value={moveOutDate}
                onChange={(e) => setMoveOutDate(e.target.value)}
                className="mt-2 w-full rounded-none border-2 border-ink bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
          </div>

          {state.interestRequired && (
            <div className="mt-4">
              <label className="block font-sans text-xs font-bold uppercase tracking-widest text-moss">
                Move-in date (for interest estimate)
              </label>
              <input
                type="date"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                className="mt-2 w-full rounded-none border-2 border-ink bg-white px-3 py-2 font-sans text-sm sm:w-1/2"
              />
              <p className="mt-1 font-sans text-xs text-ink/60">
                {state.name} generally requires interest on held deposits.
                This estimate uses a 5% simple annual rate — confirm the
                exact current rate for your state before finalizing.
              </p>
            </div>
          )}
        </div>

        <div className="card-flat bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
              Itemized deductions
            </p>
            <button
              onClick={addDeduction}
              type="button"
              className="font-sans text-sm font-semibold text-clay hover:underline"
            >
              + Add line
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {deductions.map((d) => (
              <div key={d.id} className="flex gap-2">
                <input
                  type="text"
                  value={d.label}
                  onChange={(e) => updateDeduction(d.id, "label", e.target.value)}
                  placeholder="e.g. Carpet cleaning"
                  className="flex-1 rounded-none border-2 border-ink bg-white px-3 py-2 font-sans text-sm"
                />
                <input
                  type="number"
                  inputMode="decimal"
                  value={d.amount}
                  onChange={(e) => updateDeduction(d.id, "amount", e.target.value)}
                  placeholder="0.00"
                  className="w-28 rounded-none border-2 border-ink bg-white px-3 py-2 font-sans text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeDeduction(d.id)}
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
            Result
          </p>
          <p className="mt-2 font-serif text-4xl font-bold">
            {formatMoney(refund)}
          </p>
          <p className="mt-1 font-sans text-sm text-paper/70">
            Amount owed back to the tenant
          </p>

          <dl className="mt-6 space-y-2 border-t border-paper/20 pt-4 font-sans text-sm">
            <div className="flex justify-between">
              <dt className="text-paper/70">Deposit held</dt>
              <dd>{formatMoney(deposit)}</dd>
            </div>
            {state.interestRequired && (
              <div className="flex justify-between">
                <dt className="text-paper/70">Estimated interest</dt>
                <dd>{formatMoney(interestOwed)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-paper/70">Total deductions</dt>
              <dd>−{formatMoney(totalDeductions)}</dd>
            </div>
          </dl>

          <div className="mt-6 border-t border-paper/20 pt-4">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-gold">
              Legal deadline in {state.name}
            </p>
            <p className="mt-2 font-sans text-sm">
              Return the deposit (or an itemized statement of deductions)
              within <strong>{state.returnDeadlineDays} days</strong> of
              move-out.
            </p>
            {deadlineDate && (
              <p className="mt-2 font-serif text-lg font-bold text-gold">
                Due by {formatDate(deadlineDate)}
              </p>
            )}
            {state.returnDeadlineNote && (
              <p className="mt-2 font-sans text-xs text-paper/70">
                {state.returnDeadlineNote}
              </p>
            )}
          </div>

          <Link
            href={`/state/${state.slug}`}
            className="mt-6 block border-2 border-paper py-2 text-center font-sans text-sm font-semibold hover:bg-paper hover:text-mossdark"
          >
            Full {state.name} deposit law guide →
          </Link>
          <Link
            href="/deduction-letter"
            className="mt-3 block bg-clay py-2 text-center font-sans text-sm font-semibold text-paper hover:bg-clay/90"
          >
            Generate itemized deduction letter →
          </Link>
        </div>
      </div>
    </div>
  );
}
