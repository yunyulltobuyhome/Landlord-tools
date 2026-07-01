"use client";

import { useMemo, useState } from "react";

function formatMoney(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function ProratedRentCalculator() {
  const [monthlyRent, setMonthlyRent] = useState("1500");
  const [mode, setMode] = useState<"move-in" | "move-out">("move-in");
  const [date, setDate] = useState("");

  const rent = parseFloat(monthlyRent) || 0;

  const result = useMemo(() => {
    if (!date) return null;
    const d = new Date(date + "T00:00:00");
    const year = d.getFullYear();
    const month = d.getMonth();
    const totalDays = daysInMonth(year, month);
    const dailyRate = rent / totalDays;

    const occupiedDays =
      mode === "move-in"
        ? totalDays - d.getDate() + 1
        : d.getDate();

    const amount = dailyRate * occupiedDays;

    return { totalDays, dailyRate, occupiedDays, amount };
  }, [date, rent, mode]);

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <div className="card-flat rounded-2xl bg-white p-5">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
            Situation
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setMode("move-in")}
              className={`flex-1 rounded-lg border px-4 py-2 font-sans text-sm font-semibold transition-colors ${
                mode === "move-in"
                  ? "border-moss bg-moss/10 text-moss"
                  : "border-line text-ink/60 hover:border-moss/50"
              }`}
            >
              Tenant is moving in
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
              Tenant is moving out
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-sans text-xs font-bold uppercase tracking-widest text-moss">
                Monthly rent
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                className="input-field mt-2 w-full bg-white px-3 py-2 font-sans text-sm"
                placeholder="1500"
              />
            </div>
            <div>
              <label className="block font-sans text-xs font-bold uppercase tracking-widest text-moss">
                {mode === "move-in" ? "Move-in date" : "Move-out date"}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field mt-2 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
          </div>
          <p className="mt-4 font-sans text-xs text-ink/50">
            Proration is calculated using the actual number of days in the
            selected month (a common method, though some leases specify a
            flat 30-day month — check your lease terms).
          </p>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="card-flat sticky top-6 rounded-2xl bg-mossdark p-7 text-paper">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-gold">
            Prorated rent
          </p>
          <p className="mt-2 font-serif text-4xl font-bold">
            {result ? formatMoney(result.amount) : formatMoney(0)}
          </p>
          <p className="mt-1 font-sans text-sm text-paper/70">
            {mode === "move-in"
              ? "Due for the partial first month"
              : "Owed for the partial final month"}
          </p>

          {result && (
            <dl className="mt-6 space-y-2 border-t border-white/10 pt-4 font-sans text-sm">
              <div className="flex justify-between">
                <dt className="text-paper/70">Days in month</dt>
                <dd>{result.totalDays}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-paper/70">Days charged</dt>
                <dd>{result.occupiedDays}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-paper/70">Daily rate</dt>
                <dd>{formatMoney(result.dailyRate)}</dd>
              </div>
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}
