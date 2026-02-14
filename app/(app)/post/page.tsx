import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PostTripForm } from "./PostTripForm";

export default async function PostTripPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <Link
          href="/home"
          className="text-sm text-slate-600 hover:text-slate-800 inline-flex items-center gap-1"
        >
          ← Home
        </Link>
        <h1 className="text-2xl font-semibold text-slate-800 mt-4 mb-1">
          Post a Trip
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          Add your route and seats. Others can request to join from the trip page.
        </p>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <PostTripForm />
        </div>
      </div>
    </div>
  );
}
