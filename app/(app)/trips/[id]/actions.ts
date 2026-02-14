"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type RequestJoinState = { error?: string; success?: string };

export async function requestToJoin(
  _prev: RequestJoinState,
  formData: FormData
): Promise<RequestJoinState> {
  const tripId = (formData.get("trip_id") as string)?.trim();
  if (!tripId) return { error: "Missing trip id." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .select("id, driver_id, seats_total, seats_taken")
    .eq("id", tripId)
    .single();

  if (tripError || !trip) {
    return { error: "Trip not found." };
  }

  if (trip.driver_id === user.id) {
    return { error: "You are the driver for this trip." };
  }

  if (trip.seats_taken >= trip.seats_total) {
    return { error: "This trip is full." };
  }

  const { data: existing } = await supabase
    .from("join_requests")
    .select("id, status")
    .eq("trip_id", tripId)
    .eq("passenger_id", user.id)
    .maybeSingle();

  if (existing && existing.status !== "cancelled") {
    return { error: `You already have a ${existing.status} request.` };
  }

  const { error } = await supabase.from("join_requests").insert({
    trip_id: tripId,
    passenger_id: user.id,
    status: "pending",
  });

  if (error) {
    return { error: error.message || "Could not request to join." };
  }

  revalidatePath(`/trips/${tripId}`);

  return { success: "Request sent. The driver will review it soon." };
}
