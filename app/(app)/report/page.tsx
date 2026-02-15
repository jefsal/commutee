import Link from "next/link";
import { ReportForm } from "./ReportForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

function formatDateShort(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default async function ReportPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [driverTripsRes, passengerTripsRes] = await Promise.all([
    supabase
      .from("trips")
      .select("id, from_text, to_text, depart_at, driver_id")
      .eq("driver_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("join_requests")
      .select(
        "id, trip:trips(id, from_text, to_text, depart_at, driver_id)"
      )
      .eq("passenger_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const driverTrips = (driverTripsRes.data ?? []).map((t) => ({
    role: "Driver" as const,
    trip_id: t.id,
    label: `${t.from_text} → ${t.to_text} · ${formatDateShort(t.depart_at)}`,
    driver_id: t.driver_id,
  }));

  const passengerTrips = (passengerTripsRes.data ?? []).map((r) => {
    const trip = Array.isArray(r.trip) ? r.trip?.[0] ?? null : r.trip ?? null;
    return trip
      ? {
          role: "Passenger" as const,
          trip_id: trip.id,
          label: `${trip.from_text} → ${trip.to_text} · ${formatDateShort(
            trip.depart_at
          )}`,
          driver_id: trip.driver_id,
        }
      : null;
  }).filter(Boolean) as {
    role: "Passenger";
    trip_id: string;
    label: string;
    driver_id: string | null;
  }[];

  const recentTrips = [...driverTrips, ...passengerTrips].slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
        <Link
          href="/home"
          className="text-sm text-slate-600 hover:text-slate-800 inline-flex items-center gap-1"
        >
          ← Home
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Report a Trip or User
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            If you ever feel in danger, please contact authorities at 911.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <ReportForm recentTrips={recentTrips} />
        </div>
      </div>
    </div>
  );
}
