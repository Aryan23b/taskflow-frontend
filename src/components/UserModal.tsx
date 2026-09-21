import {
  useState,
} from "react";

import type {
  UserRequest,
} from "../types/user";

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    data: UserRequest
  ) => Promise<void>;
}

export default function UserModal({
  open,
  onClose,
  onSubmit,
}: UserModalProps) {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);


  if (!open) {
    return null;
  }


  async function handleSubmit(
    event: React.FormEvent
  ) {

    event.preventDefault();

    if (
      !name.trim() ||
      !email.trim()
    ) {
      return;
    }

    try {

      setSubmitting(true);

      await onSubmit({
        name: name.trim(),
        email: email.trim(),
      });

      setName("");
      setEmail("");

      onClose();

    } finally {

      setSubmitting(false);

    }
  }


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {

        if (
          event.currentTarget === event.target
        ) {
          onClose();
        }

      }}
    >

      <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-slate-950 p-6 shadow-2xl">

        <div className="flex items-start justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
              Team
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white">
              Add team member
            </h2>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl px-3 py-2 text-slate-500 hover:bg-white/5 hover:text-white"
          >
            ✕
          </button>

        </div>


        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Name
            </label>

            <input
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="e.g. Aryan Baranwal"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-400/50"
            />

          </div>


          <div>

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="aryan@example.com"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-400/50"
            />

          </div>


          <div className="flex justify-end gap-3 border-t border-white/5 pt-5">

            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300 hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-50"
            >
              {submitting
                ? "Creating..."
                : "Create user"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}