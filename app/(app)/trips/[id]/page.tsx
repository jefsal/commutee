import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RequestJoinForm } from "./RequestJoinForm";
import { DriverRequestsPanel } from "./DriverRequestsPanel";
import { DeleteTripButton } from "./DeleteTripButton";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const day = d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${day} • ${time}`;
}

function firstName(full: string | null): string {
  if (!full?.trim()) return "Driver";
  return full.trim().split(/\s+/)[0] ?? "Driver";
}

export default async function TripDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: trip } = await supabase
    .from("trips")
    .select(
      "id, from_text, to_text, depart_at, seats_total, seats_taken, notes, driver_id, driver:profiles(full_name, email, phone, instagram_handle, contact_email_visible, contact_phone_visible, contact_instagram_visible)"
    )
    .eq("id", params.id)
    .single();

  if (!trip) {
    notFound();
  }

  const isDriver = trip.driver_id === user.id;

  const { data: joinRequest } = await supabase
    .from("join_requests")
    .select("id, status")
    .eq("trip_id", params.id)
    .eq("passenger_id", user.id)
    .maybeSingle();

  const { data: pendingRequestsRaw } = isDriver
    ? await supabase
        .from("join_requests")
        .select("id, status, passenger:profiles(full_name, email)")
        .eq("trip_id", params.id)
        .eq("status", "pending")
        .order("created_at", { ascending: true })
    : { data: [] };

  const pendingRequests = (pendingRequestsRaw ?? []).map((r) => ({
    ...r,
    passenger: Array.isArray(r.passenger)
      ? r.passenger?.[0] ?? null
      : r.passenger ?? null,
  }));

  const isAccepted = joinRequest?.status === "accepted";
  const canSeeContacts = isDriver || isAccepted;

  const { data: acceptedPassengers } = canSeeContacts
    ? await supabase
        .from("join_requests")
        .select(
          "id, passenger_id, passenger:profiles(full_name, email, phone, instagram_handle, contact_email_visible, contact_phone_visible, contact_instagram_visible)"
        )
        .eq("trip_id", params.id)
        .eq("status", "accepted")
    : { data: [] };

  const driver = Array.isArray(trip.driver) ? trip.driver?.[0] : trip.driver;
  const seatsLeft = Math.max(trip.seats_total - trip.seats_taken, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <Link
          href="/home"
          className="text-sm text-slate-600 hover:text-slate-800 inline-flex items-center gap-1"
        >
          ← Home
        </Link>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-2xl font-semibold text-slate-800">
              {trip.from_text} → {trip.to_text}
            </h1>
            {isDriver && <DeleteTripButton tripId={trip.id} />}
          </div>
          <p className="text-slate-500 text-sm mt-2">
            {formatDateTime(trip.depart_at)} · {seatsLeft} seats left · Driver{" "}
            {firstName(driver?.full_name ?? null)}
          </p>
          <p className="text-xs text-slate-400 mt-2">Trip ID: {trip.id}</p>
          {trip.notes && (
            <p className="text-slate-700 text-sm mt-4 whitespace-pre-line">
              {trip.notes}
            </p>
          )}
        </div>

        {!isDriver && (
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-800">
              Join this trip
            </h2>
            {joinRequest ? (
              <p className="text-sm text-slate-600 mt-2">
                Request status:{" "}
                <span className="font-medium text-slate-800">
                  {joinRequest.status}
                </span>
              </p>
            ) : seatsLeft === 0 ? (
              <p className="text-sm text-slate-600 mt-2">This trip is full.</p>
            ) : (
              <div className="mt-3">
                <RequestJoinForm tripId={trip.id} />
              </div>
            )}
          </div>
        )}

        {isDriver && (
          <DriverRequestsPanel
            tripId={trip.id}
            requests={pendingRequests}
          />
        )}

        {canSeeContacts && (
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Contact info
            </h2>
            <div className="text-sm text-slate-700">
              <p className="font-medium text-slate-800">Driver</p>
              <p>{driver?.full_name ?? "Driver"}</p>
              <p className="text-xs text-slate-400">ID: {trip.driver_id}</p>
              <p>
                {(driver?.contact_email_visible ?? true)
                  ? driver?.email ?? "No email provided"
                  : "Email hidden"}
              </p>
              <p>
                {(driver?.contact_phone_visible ?? false)
                  ? driver?.phone ?? "No phone provided"
                  : "Phone hidden"}
              </p>
              <p>
                {(driver?.contact_instagram_visible ?? false)
                  ? driver?.instagram_handle ?? "No Instagram provided"
                  : "Instagram hidden"}
              </p>
            </div>

            <div className="text-sm text-slate-700">
              <p className="font-medium text-slate-800 mb-2">
                Accepted passengers
              </p>
              {acceptedPassengers && acceptedPassengers.length > 0 ? (
                <ul className="space-y-2">
                  {acceptedPassengers.map((r) => {
                    const passenger = Array.isArray(r.passenger)
                      ? r.passenger?.[0]
                      : r.passenger;
                    return (
                      <li key={r.id} className="rounded-lg bg-slate-50 p-3">
                        <p>{passenger?.full_name ?? "Passenger"}</p>
                        <p className="text-xs text-slate-400">
                          ID: {r.passenger_id}
                        </p>
                        <p>
                          {(passenger?.contact_email_visible ?? true)
                            ? passenger?.email ?? "No email provided"
                            : "Email hidden"}
                        </p>
                        <p>
                          {(passenger?.contact_phone_visible ?? false)
                            ? passenger?.phone ?? "No phone provided"
                            : "Phone hidden"}
                        </p>
                        <p>
                          {(passenger?.contact_instagram_visible ?? false)
                            ? passenger?.instagram_handle ?? "No Instagram provided"
                            : "Instagram hidden"}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-slate-500">No accepted passengers yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
