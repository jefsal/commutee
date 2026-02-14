"use client";

import { useFormState } from "react-dom";
import { createTrip } from "./actions";

export function PostTripForm() {
  const [state, formAction] = useFormState(createTrip, {});

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="from_text" className="block text-sm font-medium text-slate-700 mb-1">
          Starting point
        </label>
        <input
          id="from_text"
          name="from_text"
          type="text"
          required
          placeholder="e.g. SFSU, Daly City BART"
          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <div>
        <label htmlFor="to_text" className="block text-sm font-medium text-slate-700 mb-1">
          End point
        </label>
        <input
          id="to_text"
          name="to_text"
          type="text"
          required
          placeholder="e.g. Downtown SF, SFO"
          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="depart_date" className="block text-sm font-medium text-slate-700 mb-1">
            Departure date
          </label>
          <input
            id="depart_date"
            name="depart_date"
            type="date"
            required
            min={new Date().toISOString().slice(0, 10)}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div>
          <label htmlFor="depart_time" className="block text-sm font-medium text-slate-700 mb-1">
            Departure time
          </label>
          <input
            id="depart_time"
            name="depart_time"
            type="time"
            required
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="seats_total" className="block text-sm font-medium text-slate-700 mb-1">
          Seats available
        </label>
        <input
          id="seats_total"
          name="seats_total"
          type="number"
          min={1}
          max={10}
          defaultValue={3}
          required
          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
        <p className="text-xs text-slate-500 mt-1">How many passengers can you take?</p>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="e.g. Flexible on pickup spot, prefer light luggage"
          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      >
        Post trip
      </button>
    </form>
  );
}
