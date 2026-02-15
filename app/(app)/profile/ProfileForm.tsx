"use client";

import { useMemo, useState } from "react";
import { useFormState } from "react-dom";
import { updateProfile } from "./actions";

type Props = {
  initial: {
    full_name: string | null;
    email: string;
    phone: string | null;
    instagram_handle: string | null;
    contact_email_visible: boolean;
    contact_phone_visible: boolean;
    contact_instagram_visible: boolean;
  };
};

export function ProfileForm({ initial }: Props) {
  const [state, formAction] = useFormState(updateProfile, {});
  const [emailVisible, setEmailVisible] = useState(
    initial.contact_email_visible
  );
  const [phoneVisible, setPhoneVisible] = useState(
    initial.contact_phone_visible
  );
  const [instagramVisible, setInstagramVisible] = useState(
    initial.contact_instagram_visible
  );

  const showWarning = useMemo(
    () =>
      (emailVisible && !initial.contact_email_visible) ||
      (phoneVisible && !initial.contact_phone_visible) ||
      (instagramVisible && !initial.contact_instagram_visible),
    [emailVisible, phoneVisible, instagramVisible, initial]
  );

  return (
    <form
      action={formAction}
      className="space-y-5"
      onSubmit={(e) => {
        if (!showWarning) return;
        const ok = window.confirm(
          "Making contact info visible means accepted trip members will be able to see it. Continue?"
        );
        if (!ok) e.preventDefault();
      }}
    >
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-slate-700 mb-1">
          Full name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          defaultValue={initial.full_name ?? ""}
          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={initial.email}
          required
          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
        <p className="text-xs text-slate-500 mt-1">
          Changing email may require confirmation.
        </p>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={initial.phone ?? ""}
          placeholder="Optional"
          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <div>
        <label htmlFor="instagram_handle" className="block text-sm font-medium text-slate-700 mb-1">
          Instagram
        </label>
        <input
          id="instagram_handle"
          name="instagram_handle"
          type="text"
          defaultValue={initial.instagram_handle ?? ""}
          placeholder="@yourhandle"
          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
        <p className="text-sm font-medium text-slate-800">Contact visibility</p>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="contact_email_visible"
            checked={emailVisible}
            onChange={(e) => setEmailVisible(e.target.checked)}
          />
          Show my email to accepted trip members
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="contact_phone_visible"
            checked={phoneVisible}
            onChange={(e) => setPhoneVisible(e.target.checked)}
          />
          Show my phone number to accepted trip members
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="contact_instagram_visible"
            checked={instagramVisible}
            onChange={(e) => setInstagramVisible(e.target.checked)}
          />
          Show my Instagram handle to accepted trip members
        </label>
        <p className="text-xs text-slate-500">
          You can hide contact details any time.
        </p>
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
        Save changes
      </button>
    </form>
  );
}
