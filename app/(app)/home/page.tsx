// app/(app)/home/page.tsx – Post-auth Home / Dashboard

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { HomeHeader } from "./HomeHeader";
import { ActionCards } from "./ActionCards";
import { ActivitySection } from "./ActivitySection";
import { RecentTripsFeed } from "./RecentTripsFeed";
import { SafetyStrip } from "./SafetyStrip";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const now = new Date().toISOString();

  const [profileRes, driverTripsRes, requestsRes, recentTripsRes] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, email, phone, is_admin")
        .eq("id", user.id)
        .single(),
      supabase
        .from("trips")
        .select("id, from_text, to_text, depart_at, seats_total, seats_taken, notes")
        .eq("driver_id", user.id)
        .gte("depart_at", now)
        .order("depart_at", { ascending: true })
        .limit(3),
      supabase
        .from("join_requests")
        .select(
          "id, status, created_at, trip:trips(id, from_text, to_text, depart_at)"
        )
        .eq("passenger_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3),
      supabase
        .from("trips")
        .select(
          "id, from_text, to_text, depart_at, seats_total, seats_taken, driver:profiles(full_name)"
        )
        .gte("depart_at", now)
        .order("depart_at", { ascending: true })
        .limit(8),
    ]);

  const profile = profileRes.data;
  const driverTrips = driverTripsRes.data ?? [];
  const rawRequests = requestsRes.data ?? [];
  const myRequests = rawRequests.map((r) => ({
    ...r,
    trip: Array.isArray(r.trip) ? r.trip?.[0] ?? null : r.trip ?? null,
  }));
  const rawRecentTrips = recentTripsRes.data ?? [];
  const recentTrips = rawRecentTrips.map((t) => ({
    ...t,
    driver: Array.isArray(t.driver) ? t.driver?.[0] ?? null : t.driver ?? null,
  }));

  const tripIds = driverTrips.map((t) => t.id);
  let pendingCountMap: Record<string, number> = {};
  if (tripIds.length > 0) {
    const { data: pending } = await supabase
      .from("join_requests")
      .select("trip_id")
      .in("trip_id", tripIds)
      .eq("status", "pending");
    pendingCountMap = (pending ?? []).reduce(
      (acc, r) => {
        acc[r.trip_id] = (acc[r.trip_id] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }

  const driverTripsWithCounts = driverTrips.map((t) => ({
    ...t,
    pending_requests_count: pendingCountMap[t.id] ?? 0,
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      <HomeHeader
        profile={{
          full_name: profile?.full_name ?? "Student",
          email: profile?.email ?? user.email ?? "",
          is_admin: profile?.is_admin ?? false,
        }}
      />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        <ActionCards />

        <ActivitySection
          driverTrips={driverTripsWithCounts}
          passengerRequests={myRequests}
        />

        <RecentTripsFeed initialTrips={recentTrips} />

        <SafetyStrip />

        {profile?.is_admin && (
          <div className="flex justify-end">
            <Link
              href="/admin/reports"
              className="text-sm text-amber-700 hover:text-amber-800 font-medium"
            >
              Admin: Reports →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
