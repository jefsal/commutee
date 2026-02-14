"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type CreateTripState = { error?: string };

function parseDepartAt(depart_date: string, depart_time: string): Date | null {
  const time = depart_time.trim().toUpperCase();

  // HTML <input type="time"> submits as 24h HH:mm, but support AM/PM too.
  const twentyFourHour = /^([01]\d|2[0-3]):([0-5]\d)$/;
  const amPm = /^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/;

  if (twentyFourHour.test(time)) {
    const d = new Date(`${depart_date}T${time}`);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const match = time.match(amPm);
  if (!match) return null;

  const hour12 = parseInt(match[1], 10);
  const minute = match[2];
  const meridiem = match[3];
  const hour24 = (hour12 % 12) + (meridiem === "PM" ? 12 : 0);
  const normalized = `${String(hour24).padStart(2, "0")}:${minute}`;
  const d = new Date(`${depart_date}T${normalized}`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function createTrip(
  _prev: CreateTripState,
  formData: FormData
): Promise<CreateTripState> {
  const from_text = (formData.get("from_text") as string)?.trim();
  const to_text = (formData.get("to_text") as string)?.trim();
  const depart_date = formData.get("depart_date") as string;
  const depart_time = formData.get("depart_time") as string;
  const seats_total = parseInt(formData.get("seats_total") as string, 10);
  const notes = (formData.get("notes") as string)?.trim() || null;

  if (!from_text || !to_text || !depart_date || !depart_time) {
    return { error: "Please fill in starting point, end point, date, and time." };
  }

  if (!Number.isFinite(seats_total) || seats_total < 1 || seats_total > 10) {
    return { error: "Seats must be between 1 and 10." };
  }

  const depart_at = parseDepartAt(depart_date, depart_time);
  if (!depart_at) {
    return { error: "Invalid time. Use HH:mm or h:mm AM/PM." };
  }
  if (depart_at <= new Date()) {
    return { error: "Departure must be in the future." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: trip, error } = await supabase
    .from("trips")
    .insert({ //Potentially insert as database fields if .insert does not do so already
      driver_id: user.id,
      from_text,
      to_text,
      depart_at: depart_at.toISOString(),
      seats_total,
      seats_taken: 0,
      notes: notes || null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("createTrip error:", error);
    return { error: error.message || "Failed to create trip." };
  }

  redirect(trip ? `/trips/${trip.id}` : "/home");
}
