"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { requestToJoin } from "./actions";

const STORAGE_KEY = "commutee_skip_contact_modal";

export function RequestJoinForm({ tripId }: { tripId: string }) {
  const [state, formAction] = useFormState(requestToJoin, {});
  const [open, setOpen] = useState(false);
  const [skipNext, setSkipNext] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  const skipModal =
    typeof window !== "undefined" &&
    window.localStorage.getItem(STORAGE_KEY) === "true";

  return (
    <div className="space-y-3">
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

      {!skipModal ? (
        <>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700"
          >
            Request to join
          </button>

          {open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
              <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
                <h3 className="text-lg font-semibold text-slate-800">
                  Share contact info?
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  If you’re accepted, your visible contact info will be shared
                  with the driver and other accepted passengers. You can edit
                  what’s shown in your Profile at any time.
                </p>

                <label className="flex items-center gap-2 text-sm text-slate-700 mt-4">
                  <input
                    type="checkbox"
                    checked={skipNext}
                    onChange={(e) => setSkipNext(e.target.checked)}
                  />
                  Do not show this message again
                </label>

                <div className="mt-4 flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <form
                    action={async (formData) => {
                      if (skipNext) {
                        window.localStorage.setItem(STORAGE_KEY, "true");
                      }
                      await formAction(formData);
                    }}
                  >
                    <input type="hidden" name="trip_id" value={tripId} />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700"
                    >
                      I agree, request to join
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <form action={formAction} className="space-y-3">
          <input type="hidden" name="trip_id" value={tripId} />
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700"
          >
            Request to join
          </button>
        </form>
      )}
    </div>
  );
}
