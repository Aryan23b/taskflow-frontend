import type { Task } from "../types/task";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

function getStatusStyles(status: Task["status"]) {
  switch (status) {
    case "TODO":
      return "bg-slate-400/10 text-slate-300 ring-slate-400/20";

    case "IN_PROGRESS":
      return "bg-amber-400/10 text-amber-300 ring-amber-400/20";

    case "COMPLETED":
      return "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20";
  }
}

function getPriorityStyles(
  priority: Task["priority"]
) {
  switch (priority) {
    case "HIGH":
      return "bg-rose-400/10 text-rose-300";

    case "MEDIUM":
      return "bg-amber-400/10 text-amber-300";

    case "LOW":
      return "bg-emerald-400/10 text-emerald-300";
  }
}

function formatStatus(status: Task["status"]) {
  return status.replace("_", " ");
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
}: TaskCardProps) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.06]">

      <div className="flex flex-col gap-4">

        {/* Top section */}
        <div className="flex items-start justify-between gap-4">

          <div className="min-w-0">

            <h3 className="truncate text-base font-semibold text-white">
              {task.title}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {task.projectName}
            </p>

          </div>

          <span
            className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-semibold ${
              getPriorityStyles(task.priority)
            }`}
          >
            {task.priority}
          </span>

        </div>

        {/* Description */}
        {task.description && (
          <p className="line-clamp-2 text-sm leading-6 text-slate-400">
            {task.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2">

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
              getStatusStyles(task.status)
            }`}
          >
            {formatStatus(task.status)}
          </span>

          {task.dueDate && (
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
              Due {task.dueDate}
            </span>
          )}

        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between border-t border-white/5 pt-4">

          <div className="text-xs text-slate-500">
            {task.assignedToUserName
              ? `Assigned to ${task.assignedToUserName}`
              : "Unassigned"}
          </div>

          <div className="flex gap-2">

            <button
              onClick={() => onEdit(task)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(task)}
              className="rounded-xl border border-rose-400/10 bg-rose-400/5 px-3 py-2 text-xs font-medium text-rose-300 transition hover:bg-rose-400/10"
            >
              Delete
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}