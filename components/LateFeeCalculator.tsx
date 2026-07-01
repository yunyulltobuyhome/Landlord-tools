"use client";

import { useMemo, useState } from "react";

function formatMoney(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function LateFeeCalculator() {
  const [monthlyRent, setMonthlyRent] = useState("1500");
  const [feeType, setFeeType] = useState<"flat" | "percent" | "daily">("flat");
  const [flatFee, setFlatFee] = useState("50");
  const [percentFee, setPercentFee] = useState("5");
  const [dailyFee, setDailyFee] = useState("10");
  const [gracePeriod, setGracePeriod] = useState("3");
  const [daysLate, setDaysLate] = useState("5");

  const rent = parseFloat(monthlyRent) || 0;
  const grace = parseInt(gracePeriod, 10) || 0;
  const late = parseInt(daysLate, 10) || 0;
  const daysPastGrace = Math.max(0, late - grace);

  const fee = useMemo(() => {
    if (daysPastGrace <= 0) return 0;
    if (feeType === "flat") return parseFloat(flatFee) || 0;
    if (feeType === "percent") return (rent * (parseFloat(percentFee) || 0)) / 100;
    return daysPastGrace * (parseFloat(dailyFee) || 0);
  }, [feeType, flatFee, percentFee, dailyFee, rent, daysPastGrace]);

  const percentOfRent = rent > 0 ? (fee / rent) * 100 : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <div className="card-flat rounded-2xl bg-white p-5">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
            Rent &amp; timing
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Monthly rent
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Grace period (days)
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={gracePeriod}
                onChange={(e) => setGracePeriod(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Days rent is late
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={daysLate}
                onChange={(e) => setDaysLate(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
          </div>
        </div>

        <div className="card-flat rounded-2xl bg-white p-5">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
            Fee structure
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                { key: "flat", label: "Flat fee" },
                { key: "percent", label: "% of rent" },
                { key: "daily", label: "Per day late" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setFeeType(opt.key)}
                className={`rounded-lg border px-4 py-2 font-sans text-sm font-semibold transition-colors ${
                  feeType === opt.key
                    ? "border-moss bg-moss/10 text-moss"
                    : "border-line text-ink/60 hover:border-moss/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {feeType === "flat" && (
              <div>
                <label className="block font-sans text-xs text-ink/60">
                  Flat late fee amount
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={flatFee}
                  onChange={(e) => setFlatFee(e.target.value)}
                  className="input-field mt-1 w-full max-w-xs bg-white px-3 py-2 font-sans text-sm"
                />
              </div>
            )}
            {feeType === "percent" && (
              <div>
                <label className="block font-sans text-xs text-ink/60">
                  Percent of monthly rent
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={percentFee}
                  onChange={(e) => setPercentFee(e.target.value)}
                  className="input-field mt-1 w-full max-w-xs bg-white px-3 py-2 font-sans text-sm"
                />
              </div>
            )}
            {feeType === "daily" && (
              <div>
                <label className="block font-sans text-xs text-ink/60">
                  Fee per day late (after grace period)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={dailyFee}
                  onChange={(e) => setDailyFee(e.target.value)}
                  className="input-field mt-1 w-full max-w-xs bg-white px-3 py-2 font-sans text-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="card-flat sticky top-6 rounded-2xl bg-mossdark p-7 text-paper">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-gold">
            Late fee owed
          </p>
          <p className="mt-2 font-serif text-4xl font-bold">
            {formatMoney(fee)}
          </p>
          <p className="mt-1 font-sans text-sm text-paper/70">
            {daysPastGrace > 0
              ? `${daysPastGrace} day(s) past the grace period`
              : "Still within the grace period — no fee due"}
          </p>

          <div className="mt-6 border-t border-white/10 pt-4 font-sans text-sm">
            <div className="flex justify-between">
              <span className="text-paper/70">Fee as % of rent</span>
              <span>{percentOfRent.toFixed(1)}%</span>
            </div>
          </div>

          <p className="mt-6 font-sans text-xs text-paper/60">
            Many states cap late fees at a "reasonable" amount — often cited
            informally as around 5% of monthly rent — or require the fee to
            be specified in the lease. Some states set no cap at all. Check
            your state and local rules, and your lease, before charging a
            late fee above this range.
          </p>
        </div>
      </div>
    </div>
  );
}
