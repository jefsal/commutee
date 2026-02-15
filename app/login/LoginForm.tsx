"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [passwordMode, setPasswordMode] = useState<"signin" | "signup">(
    "signin"
  );
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const allowPasswordLogin =
    (process.env.NEXT_PUBLIC_ALLOW_PASSWORD_LOGIN || "").toLowerCase() ===
    "true";

  const canUsePassword = useMemo(
    () => allowPasswordLogin && mode === "password",
    [allowPasswordLogin, mode]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const supabase = createClient();
      if (canUsePassword) {
        if (!password || password.length < 6) {
          setErrorMsg("Password must be at least 6 characters.");
          return;
        }

        if (passwordMode === "signin") {
          const { error } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password,
          });
          if (error) {
            setErrorMsg(error.message || "Could not sign in.");
            return;
          }
          setSent(true);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
        });
        if (error) {
          setErrorMsg(error.message || "Could not sign up.");
          return;
        }
        setSent(true);
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });

      if (error) {
        setErrorMsg(error.message || "Could not send sign-in link.");
        return;
      }

      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <p className="text-sm text-green-700 bg-green-50 rounded-lg p-3">
        {canUsePassword
          ? "Signed in. You can close this message."
          : "Check your inbox for the sign-in link."}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {allowPasswordLogin && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("magic")}
            className={`px-3 py-1.5 text-sm rounded-lg border ${
              mode === "magic"
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-slate-700 border-slate-200"
            }`}
          >
            Magic link
          </button>
          <button
            type="button"
            onClick={() => setMode("password")}
            className={`px-3 py-1.5 text-sm rounded-lg border ${
              mode === "password"
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-slate-700 border-slate-200"
            }`}
          >
            Password
          </button>
        </div>
      )}

      <input
        type="email"
        placeholder="you@sfsu.edu"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
      />

      {canUsePassword && (
        <>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <div className="flex gap-2 text-sm">
            <button
              type="button"
              onClick={() => setPasswordMode("signin")}
              className={`px-3 py-1.5 rounded-lg border ${
                passwordMode === "signin"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-slate-200"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setPasswordMode("signup")}
              className={`px-3 py-1.5 rounded-lg border ${
                passwordMode === "signup"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-slate-200"
              }`}
            >
              Sign up
            </button>
          </div>
        </>
      )}
      {errorMsg && (
        <p className="text-sm text-red-700 bg-red-50 rounded-lg p-3">
          {errorMsg}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading
          ? "Working…"
          : canUsePassword
          ? passwordMode === "signin"
            ? "Sign in"
            : "Sign up"
          : "Send sign-in link"}
      </button>
    </form>
  );
}
