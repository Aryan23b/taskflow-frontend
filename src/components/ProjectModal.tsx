import { useState } from "react";

import type {
  ProjectRequest,
} from "../types/project";

import type { User } from "../types/user";

interface ProjectModalProps {
  open: boolean;
  users: User[];
  onClose: () => void;
  onSubmit: (
    data: ProjectRequest
  ) => Promise<void>;
}

export default function ProjectModal({
  open,
  users,
  onClose,
  onSubmit,
}: ProjectModalProps) {

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [ownerId, setOwnerId] =
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

    if (!name.trim() || !ownerId) {
      return;
    }

    try {

      setSubmitting(true);

      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        ownerId: Number(ownerId),
      });

      setName("");
      setDescription("");
      setOwnerId("");

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
              Projects
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white">
              New project
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl px-3 py-2 text-slate-500 hover:bg-white/5 hover:text-white"
          >
            ✕
          </button>

        </div>


        {users.length === 0 ? (

          <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-300">
            Create at least one user before creating a project.
          </div>

        ) : (

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Project name
              </label>

              <input
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="e.g. TaskFlow"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-400/50"
              />

            </div>


            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                rows={4}
                placeholder="What is this project about?"
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-400/50"
              />

            </div>


            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Owner
              </label>

              <select
                value={ownerId}
                onChange={(event) =>
                  setOwnerId(
                    event.target.value
                  )
                }
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-400/50"
              >

                <option value="">
                  Select owner
                </option>

                {users.map((user) => (

                  <option
                    key={user.id}
                    value={user.id}
                  >
                    {user.name}
                  </option>

                ))}

              </select>

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
                  : "Create project"}
              </button>

            </div>

          </form>

        )}

      </div>

    </div>
  );
}