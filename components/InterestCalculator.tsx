"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { statesData } from "@/lib/states-data";

function formatMoney(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function InterestCalculator() {
  const interestStates = useMemo(
    () => statesData.filter((s) => s.interestRequired),
    []
  );

  const [stateSlug, setStateSlug] = useState(interestStates[0]?.slug ?? "massachusetts");
  const [deposit, setDeposit] = useState("1500");
  const [moveIn, setMoveIn] = useState("");
  const [moveOut, setMoveOut] = useState("");
  const [rate, setRate] = useState("");

  const state = statesData.find((s) => s.slug === stateSlug)!;

  // When the state changes, prefill the rate only where a fixed statutory
  // rate exists; otherwise clear it so the user supplies the current figure.
  useEffect(() => {
    setRate(state.interestRate != null ? String(state.interestRate) : "");
  }, [state]);

  const principal = parseFloat(deposit) || 0;
  const ratePct = parseFloat(rate) || 0;

  const years = useMemo(() => {
    if (!moveIn) return 0;
    const start = new Date(moveIn + "T00:00:00");
    const end = moveOut ? new Date(moveOut + "T00:00:00") : new Date();
    return Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  }, [moveIn, moveOut]);

  const simpleInterest = principal * (ratePct / 100) * years;
  const compoundInterest = principal * (Math.pow(1 + ratePct / 100, years) - 1);

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <div className="card-flat rounded-2xl bg-white p-5">
          <label className="block font-sans text-xs font-bold uppercase tracking-widest text-moss">
            State
          </label>
          <select
            value={stateSlug}
            onChange={(e) => setStateSlug(e.target.value)}
            className="input-field mt-2 w-full bg-white px-3 py-2 font-sans text-sm"
          >
            <optgroup label="States that require deposit interest">
              {interestStates.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Other states (no statewide interest requirement)">
              {statesData
                .filter((s) => !s.interestRequired)
                .map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
            </optgroup>
          </select>

          <div
            className={`mt-3 rounded-xl border px-4 py-3 font-sans text-sm ${
              state.interestRequired
                ? "border-moss/30 bg-moss/5 text-ink/80"
                : "border-line bg-sand/60 text-ink/70"
            }`}
          >
            <span className="font-semibold">
              {state.interestRequired
                ? `${state.name} requires interest on deposits.`
                : `${state.name} has no statewide interest requirement.`}
            </span>{" "}
            {state.interestNote}{" "}
            <Link href={`/state/${state.slug}`} className="underline hover:text-moss">
              See {state.name} deposit law →
            </Link>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Security deposit held
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Annual interest rate (%)
              </label>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="e.g. 5"
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
              <p className="mt-1 font-sans text-[11px] text-ink/50">
                {state.interestRate != null
                  ? `${state.name}'s statutory rate is prefilled. Confirm it still applies.`
                  : "This state's rate is tied to a bank/treasury index and changes over time — enter the current rate."}
              </p>
            </div>
            <div>
              <label className="block font-sans text-xs text-ink/60">Move-in date</label>
              <input
                type="date"
                value={moveIn}
                onChange={(e) => setMoveIn(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Move-out date (or leave blank for today)
              </label>
              <input
                type="date"
                value={moveOut}
                onChange={(e) => setMoveOut(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="card-flat sticky top-6 rounded-2xl bg-mossdark p-7 text-paper">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-gold">
            Interest owed (simple)
          </p>
          <p className="mt-2 font-serif text-4xl font-bold">
            {formatMoney(simpleInterest)}
          </p>
          <p className="mt-1 font-sans text-sm text-paper/70">
            {years > 0 ? `Over ${years.toFixed(2)} years held` : "Enter the move-in date"}
          </p>

          <dl className="mt-6 space-y-2 border-t border-white/10 pt-4 font-sans text-sm">
            <div className="flex justify-between">
              <dt className="text-paper/70">Deposit</dt>
              <dd>{formatMoney(principal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-paper/70">+ Simple interest</dt>
              <dd>{formatMoney(simpleInterest)}</dd>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2 font-semibold">
              <dt>Total to return</dt>
              <dd>{formatMoney(principal + simpleInterest)}</dd>
            </div>
          </dl>

          <div className="mt-4 rounded-xl bg-white/5 px-4 py-3 font-sans text-xs text-paper/70">
            If compounded annually instead, interest would be{" "}
            <span className="font-semibold text-paper">
              {formatMoney(compoundInterest)}
            </span>
            . Most statutes specify <span className="font-semibold text-paper">simple</span>{" "}
            interest — check your state&apos;s rule.
          </div>

          <p className="mt-4 font-sans text-xs text-paper/60">
            Rates for most states change yearly and are tied to bank or
            treasury indices. Always confirm the current rate before relying
            on this figure.
          </p>
        </div>
      </div>
    </div>
  );
}
