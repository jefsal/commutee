import Link from "next/link";

export function ActionCards() {
  return (
    <section className="grid sm:grid-cols-2 gap-4">
      <Link
        href="/post"
        className="block p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all text-left group"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-slate-800 mb-1">Post a Trip</h2>
        <p className="text-sm text-slate-500 mb-4">
          Driving somewhere? Post your route and available seats so others can join.
        </p>
        <span className="text-sm font-medium text-emerald-600 group-hover:text-emerald-700">
          Post your trip →
        </span>
      </Link>

      <Link
        href="/trips"
        className="block p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all text-left group"
      >
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mb-4 group-hover:bg-slate-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-slate-800 mb-1">Find a Trip</h2>
        <p className="text-sm text-slate-500 mb-4">
          Need a ride? Browse upcoming trips and request to join.
        </p>
        <span className="text-sm font-medium text-slate-600 group-hover:text-slate-700">
          Browse trips →
        </span>
      </Link>
    </section>
  );
}
