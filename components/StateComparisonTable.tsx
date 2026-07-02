"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { statesData } from "@/lib/states-data";

export default function StateComparisonTable() {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return statesData;
    return statesData.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.abbr.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div>
      <div className="mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a state…"
          className="input-field w-full max-w-xs bg-white px-3 py-2 font-sans text-sm"
          aria-label="Search states"
        />
      </div>

      <div className="card-flat overflow-hidden rounded-2xl bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-sans text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="px-4 py-3 font-bold">State</th>
                <th className="px-4 py-3 font-bold">Deposit cap</th>
                <th className="whitespace-nowrap px-4 py-3 font-bold">
                  Return deadline
                </th>
                <th className="px-4 py-3 font-bold">Interest?</th>
                <th className="px-4 py-3 font-bold">Statute</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr
                  key={s.slug}
                  className="border-b border-line/60 align-top last:border-0 hover:bg-sand/60"
                >
                  <td className="px-4 py-3 font-semibold">
                    <Link
                      href={`/state/${s.slug}`}
                      className="text-ink transition-colors hover:text-moss"
                    >
                      {s.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink/70">{s.depositCap}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink/70">
                    {s.returnDeadlineDays} days
                  </td>
                  <td className="px-4 py-3 text-ink/70">
                    {s.interestRequired ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3 text-ink/60">{s.statute}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-ink/50">
                    No state matches “{query}”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
