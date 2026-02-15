"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type RequestJoinState = { error?: string; success?: string };

export type DriverDecisionState = { error?: string; success?: string };
export type DeleteTripState = { error?: string; success?: string };

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

export async function decideRequest(
  _prev: DriverDecisionState,
  formData: FormData
): Promise<DriverDecisionState> {
  const tripId = (formData.get("trip_id") as string)?.trim();
  const requestId = (formData.get("request_id") as string)?.trim();
  const decision = (formData.get("decision") as string)?.trim();

  if (!tripId || !requestId || !decision) {
    return { error: "Missing request data." };
  }

  if (decision !== "accepted" && decision !== "declined") {
    return { error: "Invalid decision." };
  }

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

  if (trip.driver_id !== user.id) {
    return { error: "Only the driver can decide requests." };
  }

  const { data: reqRow, error: reqError } = await supabase
    .from("join_requests")
    .select("id, status")
    .eq("id", requestId)
    .eq("trip_id", tripId)
    .single();

  if (reqError || !reqRow) {
    return { error: "Request not found." };
  }

  if (reqRow.status !== "pending") {
    return { error: "Request already decided." };
  }

  if (decision === "accepted" && trip.seats_taken >= trip.seats_total) {
    return { error: "No seats remaining." };
  }

  const { error: updateError } = await supabase
    .from("join_requests")
    .update({ status: decision })
    .eq("id", requestId)
    .eq("status", "pending");

  if (updateError) {
    return { error: updateError.message || "Could not update request." };
  }

  if (decision === "accepted") {
    const { error: seatError } = await supabase
      .from("trips")
      .update({ seats_taken: trip.seats_taken + 1 })
      .eq("id", tripId);

    if (seatError) {
      return { error: seatError.message || "Could not update seats." };
    }
  }

  revalidatePath(`/trips/${tripId}`);

  return { success: `Request ${decision}.` };
}

export async function deleteTrip(
  _prev: DeleteTripState,
  formData: FormData
): Promise<DeleteTripState> {
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
    .select("id, driver_id")
    .eq("id", tripId)
    .single();

  if (tripError || !trip) {
    return { error: "Trip not found." };
  }

  if (trip.driver_id !== user.id) {
    return { error: "Only the driver can delete this trip." };
  }

  const { error: joinError } = await supabase
    .from("join_requests")
    .delete()
    .eq("trip_id", tripId);

  if (joinError) {
    return { error: joinError.message || "Could not remove requests." };
  }

  const { error: deleteError } = await supabase
    .from("trips")
    .delete()
    .eq("id", tripId);

  if (deleteError) {
    return { error: deleteError.message || "Could not delete trip." };
  }

  revalidatePath("/home");
  revalidatePath("/trips");

  return { success: "Trip deleted." };
}
