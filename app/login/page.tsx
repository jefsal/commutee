import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) redirect("/home");
  } catch {
    // Supabase not configured or network error – still show login
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-lg border border-slate-200 p-8 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-[#231161]">
            welcome to commutee
          </h1>
          <p className="text-slate-500 text-sm">
            Sign in with your @sfsu.edu email
          </p>
        </div>

        <LoginForm />

        <div className="pt-1 space-y-2">
          <p className="text-slate-400 text-xs text-center">
            Currently available to SFSU students only.
          </p>
          <details className="text-xs text-slate-500">
            <summary className="cursor-pointer text-center">
              What is commutee?
            </summary>
            <p className="mt-2 text-slate-500">
               Drivers post trips, passengers request to join, and contact info is shared
              only after acceptance. commutee helps SFSU students find safe carpool companions.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
