"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { statesData } from "@/lib/states-data";
import {
  DEFAULT_NOTICE_DAYS,
  getRentIncreaseRule,
} from "@/lib/rent-increase-data";

type Mode = "percent" | "amount";

function formatMoney(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}
function longDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function RentIncreaseCalculator() {
  const [stateSlug, setStateSlug] = useState("california");
  const [currentRent, setCurrentRent] = useState("1800");
  const [mode, setMode] = useState<Mode>("percent");
  const [percent, setPercent] = useState("5");
  const [amount, setAmount] = useState("100");
  const [cpi, setCpi] = useState("");
  const [noticeDate, setNoticeDate] = useState("");

  const state = statesData.find((s) => s.slug === stateSlug)!;
  const rule = getRentIncreaseRule(stateSlug);

  const rent = parseFloat(currentRent) || 0;
  const pct = parseFloat(percent) || 0;
  const amt = parseFloat(amount) || 0;

  const increaseAmount = mode === "percent" ? rent * (pct / 100) : amt;
  const increasePercent = rent > 0 ? (increaseAmount / rent) * 100 : 0;
  const newRent = rent + increaseAmount;

  // Statewide cap, where the state has one.
  const cpiNum = parseFloat(cpi);
  const allowedPercent = useMemo(() => {
    if (!rule?.cap) return null;
    if (Number.isNaN(cpiNum)) return null;
    return Math.min(rule.cap.basePercent + cpiNum, rule.cap.ceilingPercent);
  }, [rule, cpiNum]);

  const exceedsCap =
    allowedPercent !== null && increasePercent > allowedPercent + 1e-9;
  const maxAllowedRent =
    allowedPercent !== null ? rent * (1 + allowedPercent / 100) : null;

  // Required notice and the earliest date the new rent can start.
  const requiredNoticeDays = useMemo(() => {
    if (!rule) return DEFAULT_NOTICE_DAYS;
    const large = rule.notice.largeIncrease;
    if (large && increasePercent > large.overPercent) return large.days;
    return rule.notice.days;
  }, [rule, increasePercent]);

  const effectiveDate = noticeDate
    ? addDays(new Date(noticeDate + "T00:00:00"), requiredNoticeDays)
    : null;

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <div className="card-flat rounded-2xl bg-white p-5">
          <div className="grid gap-4 sm:grid-cols-2">
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
              <label className="block font-sans text-xs text-ink/60">
                Current monthly rent
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={currentRent}
                onChange={(e) => setCurrentRent(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
          </div>

          <div
            className={`mt-4 rounded-xl border px-4 py-3 font-sans text-sm ${
              rule?.cap
                ? "border-moss/30 bg-moss/5 text-ink/80"
                : "border-line bg-sand/60 text-ink/70"
            }`}
          >
            {rule?.cap ? (
              <>
                <span className="font-semibold">
                  {state.name} caps annual rent increases:
                </span>{" "}
                {rule.cap.label}. {rule.notice.label}.
                {rule.note && (
                  <span className="mt-1 block text-xs text-ink/60">{rule.note}</span>
                )}
              </>
            ) : (
              <>
                <span className="font-semibold">
                  {state.name} has no statewide cap on rent increases.
                </span>{" "}
                A landlord can generally raise the rent by any amount at the end
                of a lease term, as long as proper written notice is given and
                the increase isn&apos;t retaliatory or discriminatory.
                <span className="mt-1 block text-xs text-ink/60">
                  Local rent control can still apply — several cities cap
                  increases even where the state does not. Check your city and
                  county rules.
                </span>
              </>
            )}
          </div>
        </div>

        <div className="card-flat rounded-2xl bg-white p-5">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
            The increase
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setMode("percent")}
              className={`flex-1 rounded-lg border px-4 py-2 font-sans text-sm font-semibold transition-colors ${
                mode === "percent"
                  ? "border-moss bg-moss/10 text-moss"
                  : "border-line text-ink/60 hover:border-moss/50"
              }`}
            >
              By percentage
            </button>
            <button
              type="button"
              onClick={() => setMode("amount")}
              className={`flex-1 rounded-lg border px-4 py-2 font-sans text-sm font-semibold transition-colors ${
                mode === "amount"
                  ? "border-moss bg-moss/10 text-moss"
                  : "border-line text-ink/60 hover:border-moss/50"
              }`}
            >
              By dollar amount
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {mode === "percent" ? (
              <div>
                <label className="block font-sans text-xs text-ink/60">
                  Increase (%)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  value={percent}
                  onChange={(e) => setPercent(e.target.value)}
                  className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
                />
              </div>
            ) : (
              <div>
                <label className="block font-sans text-xs text-ink/60">
                  Increase ($ per month)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
                />
              </div>
            )}
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Date notice is given (optional)
              </label>
              <input
                type="date"
                value={noticeDate}
                onChange={(e) => setNoticeDate(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
            {rule?.cap && (
              <div className="sm:col-span-2">
                <label className="block font-sans text-xs text-ink/60">
                  Local CPI for the past year (%) — needed to check the cap
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  value={cpi}
                  onChange={(e) => setCpi(e.target.value)}
                  placeholder="e.g. 3.1"
                  className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
                />
                <p className="mt-1 font-sans text-[11px] text-ink/50">
                  {state.name}&apos;s cap is {rule.cap.label}. CPI is republished
                  every year, so enter the current figure for your region rather
                  than relying on a number baked into a calculator.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="card-flat sticky top-6 rounded-2xl bg-mossdark p-7 text-paper">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-gold">
            New monthly rent
          </p>
          <p className="mt-2 font-serif text-4xl font-bold">
            {formatMoney(newRent)}
          </p>
          <p className="mt-1 font-sans text-sm text-paper/70">
            +{formatMoney(increaseAmount)} ({increasePercent.toFixed(1)}%)
          </p>

          <dl className="mt-6 space-y-2 border-t border-white/10 pt-4 font-sans text-sm">
            <div className="flex justify-between">
              <dt className="text-paper/70">Current rent</dt>
              <dd>{formatMoney(rent)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-paper/70">Extra per year</dt>
              <dd>{formatMoney(increaseAmount * 12)}</dd>
            </div>
          </dl>

          {allowedPercent !== null && (
            <div
              className={`mt-4 rounded-xl px-4 py-3 font-sans text-xs ${
                exceedsCap ? "bg-clay/25 text-paper" : "bg-white/5 text-paper/75"
              }`}
            >
              <span className="font-semibold text-paper">
                {exceedsCap ? "Over the statewide cap" : "Within the statewide cap"}
              </span>
              <br />
              {state.name} allows up to{" "}
              <span className="font-semibold text-paper">
                {allowedPercent.toFixed(1)}%
              </span>{" "}
              this year
              {maxAllowedRent !== null && (
                <>
                  {" "}
                  — a maximum of{" "}
                  <span className="font-semibold text-paper">
                    {formatMoney(maxAllowedRent)}
                  </span>
                </>
              )}
              .
            </div>
          )}

          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-gold">
              Notice required
            </p>
            <p className="mt-1 font-serif text-lg font-bold">
              {rule ? `${requiredNoticeDays} days` : `${DEFAULT_NOTICE_DAYS} days (typical)`}
            </p>
            {effectiveDate ? (
              <p className="mt-1 font-sans text-sm text-paper/70">
                Earliest effective date: {longDate(effectiveDate)}
              </p>
            ) : (
              <p className="mt-1 font-sans text-sm text-paper/70">
                Add the notice date to see when the new rent can start.
              </p>
            )}
            {!rule && (
              <p className="mt-2 font-sans text-xs text-paper/60">
                Most states require at least 30 days&apos; written notice, but
                the exact rule varies — confirm {state.name}&apos;s requirement
                before sending notice.
              </p>
            )}
          </div>

          <Link
            href={`/state/${state.slug}`}
            className="mt-6 block w-full rounded-xl bg-clay py-3 text-center font-sans text-sm font-semibold text-white hover:bg-clay/90"
          >
            See {state.name} rental law →
          </Link>
        </div>
      </div>
    </div>
  );
}
