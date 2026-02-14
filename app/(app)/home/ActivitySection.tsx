import Link from "next/link";

type DriverTrip = {
  id: string;
  from_text: string;
  to_text: string;
  depart_at: string;
  seats_total: number;
  seats_taken: number;
  pending_requests_count: number;
};

type RequestRow = {
  id: string;
  status: string;
  created_at: string;
  trip: {
    id: string;
    from_text: string;
    to_text: string;
    depart_at: string;
  } | null;
};

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const day = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${day} • ${time}`;
}

function StatusChip({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    accepted: "bg-emerald-100 text-emerald-800 border-emerald-200",
    declined: "bg-slate-100 text-slate-600 border-slate-200",
    cancelled: "bg-slate-100 text-slate-500 border-slate-200",
  };
  const s = styles[status] ?? "bg-slate-100 text-slate-600";
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${s}`}>
      {status}
    </span>
  );
}

export function ActivitySection({
  driverTrips,
  passengerRequests,
}: {
  driverTrips: DriverTrip[];
  passengerRequests: RequestRow[];
}) {
  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-800">Upcoming / Recent Activity</h2>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-semibold text-slate-700">My Trips (as Driver)</h3>
          </div>
          <ul className="divide-y divide-slate-100">
            {driverTrips.length === 0 ? (
              <li className="px-4 py-6 text-center">
                <p className="text-sm text-slate-500 mb-3">No trips posted yet</p>
                <Link
                  href="/post"
                  className="inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Post your first trip →
                </Link>
              </li>
            ) : (
              driverTrips.map((t) => (
                <li key={t.id} className="px-4 py-3">
                  <Link href={`/trips/${t.id}`} className="block hover:bg-slate-50 -mx-4 px-4 py-2 rounded-lg">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {t.from_text} → {t.to_text}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatDateTime(t.depart_at)} · {t.seats_total - t.seats_taken} seats left
                      {t.pending_requests_count > 0 && (
                        <span className="text-amber-600 ml-1">
                          · {t.pending_requests_count} pending request{t.pending_requests_count !== 1 ? "s" : ""}
                        </span>
                      )}
                    </p>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-semibold text-slate-700">My Requests (as Passenger)</h3>
          </div>
          <ul className="divide-y divide-slate-100">
            {passengerRequests.length === 0 ? (
              <li className="px-4 py-6 text-center">
                <p className="text-sm text-slate-500 mb-3">No join requests yet</p>
                <Link
                  href="/trips"
                  className="inline-block text-sm font-medium text-slate-600 hover:text-slate-700"
                >
                  Browse trips →
                </Link>
              </li>
            ) : (
              passengerRequests.map((r) => (
                <li key={r.id} className="px-4 py-3">
                  <Link href={r.trip ? `/trips/${r.trip.id}` : "#"} className="block hover:bg-slate-50 -mx-4 px-4 py-2 rounded-lg">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-slate-800 truncate">
                        {r.trip ? `${r.trip.from_text} → ${r.trip.to_text}` : "Trip"}
                      </span>
                      <StatusChip status={r.status} />
                    </div>
                    {r.trip && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {formatDateTime(r.trip.depart_at)}
                      </p>
                    )}
                    {r.status === "accepted" && (
                      <p className="text-xs text-emerald-600 mt-1">
                        Contact info available in trip details
                      </p>
                    )}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
