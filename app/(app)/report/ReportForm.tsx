"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { submitReport } from "./actions";

type RecentTrip = {
  role: "Driver" | "Passenger";
  trip_id: string;
  label: string;
  driver_id: string | null;
};

export function ReportForm({ recentTrips }: { recentTrips: RecentTrip[] }) {
  const [state, formAction] = useFormState(submitReport, {});
  const [tripId, setTripId] = useState("");
  const [reportedUserId, setReportedUserId] = useState("");
  const [selectedTrip, setSelectedTrip] = useState("");

  useEffect(() => {
    if (!selectedTrip) return;
    const match = recentTrips.find((t) => t.trip_id === selectedTrip);
    if (!match) return;
    setTripId(match.trip_id);
    if (match.driver_id) {
      setReportedUserId(match.driver_id);
    }
  }, [selectedTrip, recentTrips]);

  return (
    <form action={formAction} className="space-y-4">
      {recentTrips.length > 0 && (
        <div>
          <label
            htmlFor="recent_trip"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Recent trips (optional)
          </label>
          <select
            id="recent_trip"
            value={selectedTrip}
            onChange={(e) => setSelectedTrip(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Select a recent trip</option>
            {recentTrips.map((t) => (
              <option key={`${t.role}-${t.trip_id}`} value={t.trip_id}>
                {t.role}: {t.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-1">
            Selecting a trip will prefill the Trip ID and driver ID. You can
            still edit them below.
          </p>
        </div>
      )}

      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-slate-700 mb-1">
          Reason
        </label>
        <input
          id="reason"
          name="reason"
          type="text"
          required
          placeholder="e.g. No-show, unsafe driving, harassment"
          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <div>
        <label htmlFor="trip_id" className="block text-sm font-medium text-slate-700 mb-1">
          Trip ID (optional)
        </label>
        <input
          id="trip_id"
          name="trip_id"
          type="text"
          value={tripId}
          onChange={(e) => setTripId(e.target.value)}
          placeholder="Paste the trip ID"
          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <div>
        <label htmlFor="reported_user_id" className="block text-sm font-medium text-slate-700 mb-1">
          Reported User ID (optional)
        </label>
        <input
          id="reported_user_id"
          name="reported_user_id"
          type="text"
          value={reportedUserId}
          onChange={(e) => setReportedUserId(e.target.value)}
          placeholder="Paste the user ID"
          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
        <p className="text-xs text-slate-500 mt-1">
          Provide at least one: Trip ID or Reported User ID. You can find IDs in
          the trip detail page under Contact info.
        </p>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          placeholder="Add any helpful details"
          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
        />
      </div>

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

      <button
        type="submit"
        className="w-full py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700"
      >
        Submit report
      </button>
    </form>
  );
}
