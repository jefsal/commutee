"use client";

import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { deleteTrip } from "./actions";

export function DeleteTripButton({ tripId }: { tripId: string }) {
  const [state, formAction] = useFormState(deleteTrip, {});
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/home");
      router.refresh();
    }
  }, [state, router]);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        const ok = window.confirm(
          "Delete this trip? This will remove all requests and cannot be undone."
        );
        if (!ok) e.preventDefault();
      }}
    >
      <input type="hidden" name="trip_id" value={tripId} />
      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-2">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        className="px-3 py-1.5 rounded-lg bg-white text-red-600 text-sm font-medium border border-red-200 hover:bg-red-50"
      >
        Delete trip
      </button>
    </form>
  );
}
