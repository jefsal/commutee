import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TripsList } from "./TripsList";

export default async function TripsPage() {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data: tripsRaw } = await supabase
    .from("trips")
    .select(
      "id, from_text, to_text, depart_at, seats_total, seats_taken, driver:profiles(full_name)"
    )
    .gte("depart_at", now)
    .order("depart_at", { ascending: true })
    .limit(50);
  const trips = (tripsRaw ?? []).map((t) => ({
    ...t,
    driver: Array.isArray(t.driver) ? t.driver?.[0] ?? null : t.driver ?? null,
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link
          href="/home"
          className="text-sm text-slate-600 hover:text-slate-800 inline-flex items-center gap-1"
        >
          ← Home
        </Link>
        <h1 className="text-2xl font-semibold text-slate-800 mt-4 mb-1">
          Browse Trips
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          Find a ride that matches your route and schedule.
        </p>

        <TripsList initialTrips={trips} />
      </div>
    </div>
  );
}
