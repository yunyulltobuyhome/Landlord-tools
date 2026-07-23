"use client";

import { useMemo, useState } from "react";

type Method = "equal" | "income" | "room" | "weighted";
type Person = { id: number; name: string; income: string; sqft: string };

let nextId = 1;
function blankPerson(name = ""): Person {
  return { id: nextId++, name, income: "", sqft: "" };
}

function formatMoney(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

const METHODS: { key: Method; label: string }[] = [
  { key: "equal", label: "Split equally" },
  { key: "income", label: "By income" },
  { key: "room", label: "By room size" },
  { key: "weighted", label: "Income + room size" },
];

export default function RentSplitCalculator() {
  const [rent, setRent] = useState("2400");
  const [utilities, setUtilities] = useState("");
  const [utilitiesEqual, setUtilitiesEqual] = useState(true);
  const [method, setMethod] = useState<Method>("equal");
  const [weight, setWeight] = useState(50); // income weight % for "weighted"
  const [people, setPeople] = useState<Person[]>([
    blankPerson("Roommate 1"),
    blankPerson("Roommate 2"),
  ]);
  const [copied, setCopied] = useState(false);

  const rentN = parseFloat(rent) || 0;
  const utilN = parseFloat(utilities) || 0;

  const result = useMemo(() => {
    const n = people.length;
    if (n === 0) return [];
    const incomes = people.map((p) => parseFloat(p.income) || 0);
    const sqfts = people.map((p) => parseFloat(p.sqft) || 0);
    const sumIncome = incomes.reduce((a, b) => a + b, 0);
    const sumSqft = sqfts.reduce((a, b) => a + b, 0);

    const fractionsFor = (m: Method): number[] => {
      if (m === "equal") return people.map(() => 1 / n);
      if (m === "income")
        return sumIncome > 0 ? incomes.map((v) => v / sumIncome) : people.map(() => 1 / n);
      if (m === "room")
        return sumSqft > 0 ? sqfts.map((v) => v / sumSqft) : people.map(() => 1 / n);
      // weighted
      const w = weight / 100;
      return people.map((_, i) => {
        const inc = sumIncome > 0 ? incomes[i] / sumIncome : 1 / n;
        const sq = sumSqft > 0 ? sqfts[i] / sumSqft : 1 / n;
        return w * inc + (1 - w) * sq;
      });
    };

    const rentFractions = fractionsFor(method);
    const utilFractions = utilitiesEqual ? people.map(() => 1 / n) : rentFractions;

    return people.map((p, i) => {
      const rentShare = rentN * rentFractions[i];
      const utilShare = utilN * utilFractions[i];
      return {
        id: p.id,
        name: p.name || `Roommate ${i + 1}`,
        rentShare,
        utilShare,
        total: rentShare + utilShare,
        pct: rentFractions[i] * 100,
      };
    });
  }, [people, rentN, utilN, method, weight, utilitiesEqual]);

  const grandTotal = rentN + utilN;

  const needsIncome = method === "income" || method === "weighted";
  const needsRoom = method === "room" || method === "weighted";

  function updatePerson(id: number, field: "name" | "income" | "sqft", value: string) {
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    setCopied(false);
  }
  function addPerson() {
    setPeople((prev) => [...prev, blankPerson(`Roommate ${prev.length + 1}`)]);
  }
  function removePerson(id: number) {
    setPeople((prev) => (prev.length > 1 ? prev.filter((p) => p.id !== id) : prev));
  }

  async function copySummary() {
    const lines = result.map((r) => `${r.name}: ${formatMoney(r.total)}/mo`);
    const text = `Rent split (${formatMoney(grandTotal)}/mo total)\n${lines.join("\n")}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <div className="card-flat rounded-2xl bg-white p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-sans text-xs font-bold uppercase tracking-widest text-moss">
                Total monthly rent
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                className="input-field mt-2 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
            <div>
              <label className="block font-sans text-xs font-bold uppercase tracking-widest text-moss">
                Shared utilities (optional)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={utilities}
                onChange={(e) => setUtilities(e.target.value)}
                placeholder="0.00"
                className="input-field mt-2 w-full bg-white px-3 py-2 font-sans text-sm"
              />
            </div>
          </div>
          {utilN > 0 && (
            <label className="mt-3 flex items-center gap-2 font-sans text-sm text-ink/70">
              <input
                type="checkbox"
                checked={utilitiesEqual}
                onChange={(e) => setUtilitiesEqual(e.target.checked)}
                className="h-4 w-4 accent-[#0f7a5f]"
              />
              Split utilities equally (rent still uses the method below)
            </label>
          )}
        </div>

        <div className="card-flat rounded-2xl bg-white p-5">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
            Split method
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {METHODS.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setMethod(m.key)}
                className={`rounded-lg border px-3 py-2 font-sans text-sm font-semibold transition-colors ${
                  method === m.key
                    ? "border-moss bg-moss/10 text-moss"
                    : "border-line text-ink/60 hover:border-moss/50"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {method === "weighted" && (
            <div className="mt-4">
              <div className="flex justify-between font-sans text-xs text-ink/60">
                <span>More weight on room size</span>
                <span>More weight on income</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value, 10))}
                className="mt-1 w-full accent-[#0f7a5f]"
              />
              <p className="mt-1 text-center font-sans text-xs text-ink/60">
                {weight}% income · {100 - weight}% room size
              </p>
            </div>
          )}
        </div>

        <div className="card-flat rounded-2xl bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
              Roommates
            </p>
            <button
              type="button"
              onClick={addPerson}
              className="font-sans text-sm font-semibold text-moss hover:underline"
            >
              + Add roommate
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {people.map((p) => (
              <div key={p.id} className="flex flex-wrap gap-2 sm:flex-nowrap">
                <input
                  value={p.name}
                  onChange={(e) => updatePerson(p.id, "name", e.target.value)}
                  placeholder="Name"
                  className="input-field w-full bg-white px-3 py-2 font-sans text-sm sm:flex-1"
                />
                {needsIncome && (
                  <input
                    type="number"
                    inputMode="decimal"
                    value={p.income}
                    onChange={(e) => updatePerson(p.id, "income", e.target.value)}
                    placeholder="Monthly income"
                    className="input-field w-full bg-white px-3 py-2 font-sans text-sm sm:w-36"
                  />
                )}
                {needsRoom && (
                  <input
                    type="number"
                    inputMode="decimal"
                    value={p.sqft}
                    onChange={(e) => updatePerson(p.id, "sqft", e.target.value)}
                    placeholder="Room sq ft"
                    className="input-field w-full bg-white px-3 py-2 font-sans text-sm sm:w-28"
                  />
                )}
                <button
                  type="button"
                  onClick={() => removePerson(p.id)}
                  aria-label="Remove roommate"
                  className="w-9 shrink-0 rounded-lg border border-line font-sans text-lg text-ink/40 transition-colors hover:border-clay hover:text-clay"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {needsIncome && people.every((p) => !parseFloat(p.income)) && (
            <p className="mt-3 font-sans text-xs text-clay">
              Enter each person&apos;s income to split by income (otherwise it
              falls back to an equal split).
            </p>
          )}
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="card-flat sticky top-6 rounded-2xl bg-mossdark p-7 text-paper">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-gold">
            Each roommate pays
          </p>
          <ul className="mt-3 space-y-3">
            {result.map((r) => (
              <li key={r.id} className="border-b border-white/10 pb-3 last:border-0">
                <div className="flex items-baseline justify-between">
                  <span className="font-sans text-sm text-paper/80">{r.name}</span>
                  <span className="font-serif text-xl font-bold">
                    {formatMoney(r.total)}
                  </span>
                </div>
                <div className="mt-0.5 flex justify-between font-sans text-xs text-paper/50">
                  <span>{r.pct.toFixed(0)}% of rent</span>
                  {utilN > 0 && (
                    <span>
                      rent {formatMoney(r.rentShare)} · util {formatMoney(r.utilShare)}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex justify-between border-t border-white/10 pt-3 font-sans text-sm">
            <span className="text-paper/70">Total / month</span>
            <span className="font-semibold">{formatMoney(grandTotal)}</span>
          </div>

          <button
            type="button"
            onClick={copySummary}
            className="mt-6 w-full rounded-xl bg-clay py-3 text-center font-sans text-sm font-semibold text-white hover:bg-clay/90"
          >
            {copied ? "Copied!" : "Copy summary to share"}
          </button>
          <p className="mt-4 font-sans text-xs text-paper/60">
            Nothing is uploaded — the split is calculated in your browser.
          </p>
        </div>
      </div>
    </div>
  );
}
