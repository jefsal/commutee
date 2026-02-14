"use client";

import { useFormState } from "react-dom";
import { requestToJoin } from "./actions";

export function RequestJoinForm({ tripId }: { tripId: string }) {
  const [state, formAction] = useFormState(requestToJoin, {});

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="trip_id" value={tripId} />

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
        Request to join
      </button>
    </form>
  );
}
