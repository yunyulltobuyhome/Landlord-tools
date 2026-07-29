"use client";

import { useMemo, useState } from "react";

type Mode = "afford" | "qualify";

function formatMoney(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default function AffordabilityCalculator() {
  const [mode, setMode] = useState<Mode>("afford");
  const [incomePeriod, setIncomePeriod] = useState<"monthly" | "annual">("monthly");
  const [income, setIncome] = useState("5000");
  const [debts, setDebts] = useState("");
  const [pctOfIncome, setPctOfIncome] = useState(30);
  const [targetRent, setTargetRent] = useState("1800");
  const [multiplier, setMultiplier] = useState(3);

  const grossMonthly = useMemo(() => {
    const v = parseFloat(income) || 0;
    return incomePeriod === "annual" ? v / 12 : v;
  }, [income, incomePeriod]);

  const monthlyDebts = parseFloat(debts) || 0;
  const rent = parseFloat(targetRent) || 0;

  // "How much can I afford" — percent-of-income rule, and a debt-aware variant.
  const maxByPercent = grossMonthly * (pctOfIncome / 100);
  // A common lender-style guardrail: rent + debts should stay within ~40% of gross.
  const maxWithDebts = Math.max(0, grossMonthly * 0.4 - monthlyDebts);
  const recommended = Math.min(maxByPercent, maxWithDebts || maxByPercent);
  const leftAfterRent = grossMonthly - recommended - monthlyDebts;

  // "Do I qualify" — landlord screening rules.
  const requiredMonthly = rent * multiplier;
  const requiredAnnual = rent * 40; // the 40x annual rule (common in NYC)
  const passesMultiplier = grossMonthly >= requiredMonthly && rent > 0;
  const passes40x = grossMonthly * 12 >= requiredAnnual && rent > 0;
  const shortfallMonthly = Math.max(0, requiredMonthly - grossMonthly);
  const rentAsPctOfIncome = grossMonthly > 0 ? (rent / grossMonthly) * 100 : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("afford")}
            className={`rounded-lg border px-4 py-2 font-sans text-sm font-semibold transition-colors ${
              mode === "afford"
                ? "border-moss bg-moss/10 text-moss"
                : "border-line text-ink/60 hover:border-moss/50"
            }`}
          >
            How much rent can I afford?
          </button>
          <button
            type="button"
            onClick={() => setMode("qualify")}
            className={`rounded-lg border px-4 py-2 font-sans text-sm font-semibold transition-colors ${
              mode === "qualify"
                ? "border-moss bg-moss/10 text-moss"
                : "border-line text-ink/60 hover:border-moss/50"
            }`}
          >
            Will a landlord approve me?
          </button>
        </div>

        <div className="card-flat rounded-2xl bg-white p-5">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
            Your income
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-sans text-xs text-ink/60">
                Gross income (before tax)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
            <div>
              <label className="block font-sans text-xs text-ink/60">Period</label>
              <select
                value={incomePeriod}
                onChange={(e) => setIncomePeriod(e.target.value as "monthly" | "annual")}
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              >
                <option value="monthly">Per month</option>
                <option value="annual">Per year</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block font-sans text-xs text-ink/60">
                Monthly debt payments (car, student loans, credit cards) — optional
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={debts}
                onChange={(e) => setDebts(e.target.value)}
                placeholder="0"
                className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
          </div>
          {grossMonthly > 0 && (
            <p className="mt-3 font-sans text-xs text-ink/50">
              That&apos;s {formatMoney(grossMonthly)}/month gross
              {incomePeriod === "monthly"
                ? ` (${formatMoney(grossMonthly * 12)}/year)`
                : ""}
              .
            </p>
          )}
        </div>

        {mode === "afford" ? (
          <div className="card-flat rounded-2xl bg-white p-5">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
              Share of income for rent
            </p>
            <input
              type="range"
              min={20}
              max={45}
              value={pctOfIncome}
              onChange={(e) => setPctOfIncome(parseInt(e.target.value, 10))}
              className="mt-3 w-full accent-[#0f7a5f]"
            />
            <div className="flex justify-between font-sans text-xs text-ink/50">
              <span>20% (conservative)</span>
              <span className="font-bold text-moss">{pctOfIncome}%</span>
              <span>45% (stretched)</span>
            </div>
            <p className="mt-3 font-sans text-xs text-ink/60">
              The classic guideline is 30% of gross income. Anything above
              roughly 30% is considered &quot;rent burdened&quot; by HUD; above
              50% is &quot;severely rent burdened.&quot;
            </p>
          </div>
        ) : (
          <div className="card-flat rounded-2xl bg-white p-5">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
              The apartment
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-sans text-xs text-ink/60">
                  Monthly rent
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={targetRent}
                  onChange={(e) => setTargetRent(e.target.value)}
                  className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
                />
              </div>
              <div>
                <label className="block font-sans text-xs text-ink/60">
                  Landlord&apos;s income requirement
                </label>
                <select
                  value={multiplier}
                  onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                  className="input-field mt-1 w-full bg-white px-3 py-2 font-sans text-sm"
                >
                  <option value={2.5}>2.5× monthly rent</option>
                  <option value={3}>3× monthly rent (most common)</option>
                  <option value={3.5}>3.5× monthly rent</option>
                </select>
              </div>
            </div>
            <p className="mt-3 font-sans text-xs text-ink/60">
              Most landlords and property managers screen applicants by
              requiring gross monthly income of at least 3× the rent. In New
              York and some other markets the equivalent test is annual income
              of 40× the monthly rent.
            </p>
          </div>
        )}
      </div>

      <div className="lg:col-span-2">
        <div className="card-flat sticky top-6 rounded-2xl bg-mossdark p-7 text-paper">
          {mode === "afford" ? (
            <>
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-gold">
                Rent you can afford
              </p>
              <p className="mt-2 font-serif text-4xl font-bold">
                {formatMoney(recommended)}
                <span className="font-sans text-lg font-normal text-paper/60">/mo</span>
              </p>
              <p className="mt-1 font-sans text-sm text-paper/70">
                At {pctOfIncome}% of gross income
                {monthlyDebts > 0 && recommended < maxByPercent
                  ? ", reduced for your debt payments"
                  : ""}
              </p>

              <dl className="mt-6 space-y-2 border-t border-white/10 pt-4 font-sans text-sm">
                <div className="flex justify-between">
                  <dt className="text-paper/70">{pctOfIncome}% of income</dt>
                  <dd>{formatMoney(maxByPercent)}</dd>
                </div>
                {monthlyDebts > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-paper/70">Limit incl. debts</dt>
                    <dd>{formatMoney(maxWithDebts)}</dd>
                  </div>
                )}
                <div className="flex justify-between border-t border-white/10 pt-2">
                  <dt className="text-paper/70">Left after rent &amp; debts</dt>
                  <dd>{formatMoney(Math.max(0, leftAfterRent))}</dd>
                </div>
              </dl>

              <div className="mt-6 rounded-xl bg-white/5 px-4 py-3 font-sans text-xs text-paper/75">
                To pass a typical <span className="font-semibold text-paper">3× rent</span>{" "}
                screening at this rent, a landlord would want to see about{" "}
                <span className="font-semibold text-paper">
                  {formatMoney(recommended * 3)}
                </span>{" "}
                gross monthly income — you have{" "}
                <span className="font-semibold text-paper">
                  {formatMoney(grossMonthly)}
                </span>
                .
              </div>
            </>
          ) : (
            <>
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-gold">
                Screening result
              </p>
              <p
                className={`mt-2 font-serif text-3xl font-bold ${
                  passesMultiplier ? "text-white" : "text-[#f0a58a]"
                }`}
              >
                {rent <= 0
                  ? "Enter a rent"
                  : passesMultiplier
                    ? "Likely qualifies"
                    : "Likely falls short"}
              </p>
              <p className="mt-1 font-sans text-sm text-paper/70">
                {rent > 0 &&
                  `Rent is ${rentAsPctOfIncome.toFixed(0)}% of your gross income.`}
              </p>

              <dl className="mt-6 space-y-3 border-t border-white/10 pt-4 font-sans text-sm">
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-paper/70">
                    {multiplier}× monthly rent test
                  </dt>
                  <dd className="text-right">
                    <span
                      className={
                        passesMultiplier ? "font-semibold" : "font-semibold text-[#f0a58a]"
                      }
                    >
                      {passesMultiplier ? "Pass" : "Fail"}
                    </span>
                    <br />
                    <span className="text-xs text-paper/50">
                      needs {formatMoney(requiredMonthly)}/mo
                    </span>
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-paper/70">40× annual rent test</dt>
                  <dd className="text-right">
                    <span
                      className={
                        passes40x ? "font-semibold" : "font-semibold text-[#f0a58a]"
                      }
                    >
                      {passes40x ? "Pass" : "Fail"}
                    </span>
                    <br />
                    <span className="text-xs text-paper/50">
                      needs {formatMoney(requiredAnnual)}/yr
                    </span>
                  </dd>
                </div>
              </dl>

              {shortfallMonthly > 0 && rent > 0 && (
                <div className="mt-6 rounded-xl bg-white/5 px-4 py-3 font-sans text-xs text-paper/75">
                  You&apos;re about{" "}
                  <span className="font-semibold text-paper">
                    {formatMoney(shortfallMonthly)}/mo
                  </span>{" "}
                  short. Options landlords commonly accept: a co-signer or
                  guarantor, a larger deposit where state law allows it, or
                  proof of savings.
                </div>
              )}
            </>
          )}

          <p className="mt-4 font-sans text-xs text-paper/60">
            Estimates only — every landlord sets its own screening criteria.
            Calculated in your browser; nothing is uploaded.
          </p>
        </div>
      </div>
    </div>
  );
}
