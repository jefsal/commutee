"use client";

import { useFormState } from "react-dom";
import { decideRequest } from "./actions";

type RequestRow = {
  id: string;
  status: string;
  passenger: { full_name: string | null; email: string | null } | null;
};

export function DriverRequestsPanel({
  tripId,
  requests,
}: {
  tripId: string;
  requests: RequestRow[];
}) {
  const [state, formAction] = useFormState(decideRequest, {});

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Join requests</h2>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="text-sm text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg">
          {state.success}
        </p>
      )}

      {requests.length === 0 ? (
        <p className="text-sm text-slate-500">No pending requests yet.</p>
      ) : (
        <ul className="space-y-3">
          {requests.map((r) => (
            <li
              key={r.id}
              className="rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3"
            >
              <div className="text-sm text-slate-700">
                <p className="font-medium text-slate-800">
                  {r.passenger?.full_name ?? "Passenger"}
                </p>
                <p className="text-slate-500">
                  {r.passenger?.email ?? "No email"}
                </p>
              </div>

              <div className="flex gap-2">
                <form action={formAction}>
                  <input type="hidden" name="trip_id" value={tripId} />
                  <input type="hidden" name="request_id" value={r.id} />
                  <input type="hidden" name="decision" value="accepted" />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
                  >
                    Accept
                  </button>
                </form>
                <form action={formAction}>
                  <input type="hidden" name="trip_id" value={tripId} />
                  <input type="hidden" name="request_id" value={r.id} />
                  <input type="hidden" name="decision" value="declined" />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-white text-slate-700 text-sm font-medium border border-slate-200 hover:bg-slate-50"
                  >
                    Decline
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
