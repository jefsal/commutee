"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type ReportState = { error?: string; success?: string };

export async function submitReport(
  _prev: ReportState,
  formData: FormData
): Promise<ReportState> {
  const reason = (formData.get("reason") as string)?.trim();
  const notes = (formData.get("notes") as string)?.trim() || null;
  const trip_id = (formData.get("trip_id") as string)?.trim() || null;
  const reported_user_id =
    (formData.get("reported_user_id") as string)?.trim() || null;

  if (!reason) return { error: "Please provide a reason." };
  if (!trip_id && !reported_user_id) {
    return { error: "Provide a Trip ID or Reported User ID." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.from("reports").insert({
    reporter_id: user.id,
    trip_id,
    reported_user_id,
    reason,
    notes,
  });

  if (error) {
    return { error: error.message || "Could not submit report." };
  }

  revalidatePath("/report");
  return { success: "Report submitted. Thank you." };
}
