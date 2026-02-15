import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, full_name, email, phone, instagram_handle, contact_email_visible, contact_phone_visible, contact_instagram_visible"
    )
    .eq("id", user.id)
    .maybeSingle();

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
          <h1 className="text-2xl font-semibold text-slate-800">Profile</h1>
          <p className="text-slate-500 text-sm mt-1">
            Update your contact info and visibility for accepted trips.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            By default, only your email is shared after a trip is accepted.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <ProfileForm
            initial={{
              full_name: profile?.full_name ?? null,
              email: profile?.email ?? user.email ?? "",
              phone: profile?.phone ?? null,
              instagram_handle: profile?.instagram_handle ?? null,
              contact_email_visible: profile?.contact_email_visible ?? true,
              contact_phone_visible: profile?.contact_phone_visible ?? false,
              contact_instagram_visible:
                profile?.contact_instagram_visible ?? false,
            }}
          />
        </div>
      </div>
    </div>
  );
}
