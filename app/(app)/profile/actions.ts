"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type UpdateProfileState = { error?: string; success?: string };

export async function updateProfile(
  _prev: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const full_name = (formData.get("full_name") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const instagram_handle =
    (formData.get("instagram_handle") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const contact_email_visible = formData.get("contact_email_visible") === "on";
  const contact_phone_visible = formData.get("contact_phone_visible") === "on";
  const contact_instagram_visible =
    formData.get("contact_instagram_visible") === "on";

  if (!email) {
    return { error: "Email is required." };
  }
  if (contact_instagram_visible && !instagram_handle) {
    return { error: "Add your Instagram handle or hide it." };
  }

  const emailOk = contact_email_visible;
  const phoneOk = contact_phone_visible && !!phone;
  const instaOk = contact_instagram_visible && !!instagram_handle;

  if (!emailOk && !phoneOk && !instaOk) {
    return { error: "Keep at least one contact method visible." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (email !== user.email) {
    const { error } = await supabase.auth.updateUser({ email });
    if (error) {
      return { error: error.message || "Could not update email." };
    }
  }

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email,
      full_name,
      phone,
      instagram_handle,
      contact_email_visible,
      contact_phone_visible,
      contact_instagram_visible,
    },
    { onConflict: "id" }
  );

  if (profileError) {
    return { error: profileError.message || "Could not update profile." };
  }

  revalidatePath("/profile");
  revalidatePath("/home");

  return { success: "Profile updated." };
}
