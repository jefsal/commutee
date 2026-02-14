"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type TripRow = {
  id: string;
  from_text: string;
  to_text: string;
  depart_at: string;
  seats_total: number;
  seats_taken: number;
  driver: { full_name: string | null } | null;
};

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const day = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${day} • ${time}`;
}

function firstName(full: string | null): string {
  if (!full?.trim()) return "Driver";
  return full.trim().split(/\s+/)[0] ?? "Driver";
}

export function RecentTripsFeed({ initialTrips }: { initialTrips: TripRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return initialTrips;
    const q = query.trim().toLowerCase();
    return initialTrips.filter(
      (t) =>
        t.from_text.toLowerCase().includes(q) || t.to_text.toLowerCase().includes(q)
    );
  }, [initialTrips, query]);

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Recent Trips</h2>

      <input
        type="text"
        placeholder="Search from or to..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
      />

      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-slate-500 text-sm">
            {initialTrips.length === 0
              ? "No upcoming trips yet. Post a trip to get started!"
              : "No trips match your search."}
          </p>
          {initialTrips.length === 0 && (
            <Link
              href="/post"
              className="inline-block mt-3 text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              Post a trip →
            </Link>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((t) => {
            const driver = Array.isArray(t.driver) ? t.driver?.[0] : t.driver;
            return (
              <li
                key={t.id}
                className="rounded-xl bg-white border border-slate-200 shadow-sm p-4 flex flex-wrap items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800">
                    {t.from_text} → {t.to_text}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formatDateTime(t.depart_at)} · {t.seats_total - t.seats_taken} seats left · {firstName(driver?.full_name ?? null)}
                  </p>
                </div>
                <Link
                  href={`/trips/${t.id}`}
                  className="shrink-0 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  View
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
