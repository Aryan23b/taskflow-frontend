import { useEffect, useState } from "react";

import type {
  Task,
  TaskPriority,
  TaskRequest,
  TaskStatus,
} from "../types/task";

import type { Project } from "../types/project";
import type { User } from "../types/user";

interface TaskModalProps {
  open: boolean;
  task: Task | null;
  projects: Project[];
  users: User[];
  onClose: () => void;
  onSubmit: (data: TaskRequest) => Promise<void>;
}

const initialForm: TaskRequest = {
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  dueDate: "",
  projectId: 0,
  assignedToUserId: undefined,
};

export default function TaskModal({
  open,
  task,
  projects,
  users,
  onClose,
  onSubmit,
}: TaskModalProps) {

  const [form, setForm] =
    useState<TaskRequest>(initialForm);

  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {

    if (!open) {
      return;
    }

    if (task) {

      setForm({
        title: task.title,
        description: task.description ?? "",
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ?? "",
        projectId: task.projectId,
        assignedToUserId:
          task.assignedToUserId ?? undefined,
      });

    } else {

      setForm({
        ...initialForm,
      });
    }

  }, [open, task]);


  if (!open) {
    return null;
  }


  function updateField<
    K extends keyof TaskRequest
  >(
    field: K,
    value: TaskRequest[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }


  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    if (!form.projectId) {
      return;
    }

    try {

      setSubmitting(true);

      await onSubmit({
        ...form,
        title: form.title.trim(),
      });

      onClose();

    } finally {

      setSubmitting(false);
    }
  }


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {

        if (event.currentTarget === event.target) {
          onClose();
        }

      }}
    >

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-950 p-6 shadow-2xl">

        {/* Header */}
        <div className="mb-6 flex items-start justify-between">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
              Task
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white">
              {task ? "Edit task" : "Create a new task"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {task
                ? "Update the details of this task."
                : "Add a new piece of work to your project."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-3 py-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
          >
            ✕
          </button>

        </div>


        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Title
            </label>

            <input
              value={form.title}
              onChange={(event) =>
                updateField(
                  "title",
                  event.target.value
                )
              }
              placeholder="e.g. Learn Spring Security"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/10"
            />
          </div>


          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Description
            </label>

            <textarea
              value={form.description}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value
                )
              }
              rows={4}
              placeholder="Describe the task..."
              className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/10"
            />
          </div>


          {/* Status + Priority */}
          <div className="grid gap-4 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Status
              </label>

              <select
                value={form.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target.value as TaskStatus
                  )
                }
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-400/50"
              >
                <option value="TODO">
                  To Do
                </option>

                <option value="IN_PROGRESS">
                  In Progress
                </option>

                <option value="COMPLETED">
                  Done
                </option>
              </select>
            </div>


            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Priority
              </label>

              <select
                value={form.priority}
                onChange={(event) =>
                  updateField(
                    "priority",
                    event.target.value as TaskPriority
                  )
                }
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-400/50"
              >
                <option value="LOW">
                  Low
                </option>

                <option value="MEDIUM">
                  Medium
                </option>

                <option value="HIGH">
                  High
                </option>
              </select>
            </div>

          </div>


          {/* Project + User */}
          <div className="grid gap-4 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Project
              </label>

              <select
                value={form.projectId || ""}
                onChange={(event) =>
                  updateField(
                    "projectId",
                    Number(event.target.value)
                  )
                }
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-400/50"
              >
                <option value="">
                  Select project
                </option>

                {projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.name}
                  </option>
                ))}
              </select>
            </div>


            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Assign to
              </label>

              <select
                value={
                  form.assignedToUserId ?? ""
                }
                onChange={(event) => {

                  const value =
                    event.target.value;

                  updateField(
                    "assignedToUserId",
                    value
                      ? Number(value)
                      : undefined
                  );

                }}
                className="w-full rounded-2xl border border-slate-900 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-400/50"
              >
                <option value="">
                  Unassigned
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

          </div>


          {/* Due date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Due date
            </label>

            <input
              type="date"
              value={form.dueDate ?? ""}
              onChange={(event) =>
                updateField(
                  "dueDate",
                  event.target.value
                )
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-indigo-400/50"
            />
          </div>


          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t border-white/5 pt-5">

            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Saving..."
                : task
                ? "Save changes"
                : "Create task"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}