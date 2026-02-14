"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/home` } });
    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <p className="text-sm text-green-700 bg-green-50 rounded-lg p-3">
        Check your inbox for the sign-in link.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="you@sfsu.edu"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading ? "Sending…" : "Send sign-in link"}
      </button>
    </form>
  );
}
