import Link from "next/link";

export function SafetyStrip() {
  return (
    <section className="rounded-2xl bg-slate-100 border border-slate-200 p-4 space-y-3">
      <p className="text-sm text-slate-600">
        Carpool at your own risk. Meet in public places. Verify identity before sharing contact info.
      </p>
      <Link
        href="/report"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-900"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        Report a Trip / User
      </Link>
    </section>
  );
}
