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
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-lg border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-800 text-center mb-2">
          Commutee
        </h1>
        <p className="text-slate-500 text-center text-sm mb-6">
          Sign in with your @sfsu.edu email
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
