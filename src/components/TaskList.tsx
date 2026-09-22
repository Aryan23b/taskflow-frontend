import type { TaskResponse } from "../types/task";

interface TaskListProps {
  tasks: TaskResponse[];
  emptyMessage?: string;
}

export default function TaskList({
  tasks,
  emptyMessage = "No tasks found.",
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
        <p className="text-slate-400">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div className="min-w-0">
              <h3 className="text-base font-semibold text-white">
                {task.title}
              </h3>

              {task.description && (
                <p className="mt-1 text-sm text-slate-400">
                  {task.description}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    task.status === "COMPLETED"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : task.status === "IN_PROGRESS"
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {task.status}
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    task.priority === "HIGH"
                      ? "bg-red-500/10 text-red-400"
                      : task.priority === "MEDIUM"
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {task.priority}
                </span>

              </div>
            </div>

            <div className="text-left md:text-right">
              <p className="text-xs text-slate-500">
                Due Date
              </p>

              <p className="mt-1 text-sm text-slate-300">
                {task.dueDate || "No due date"}
              </p>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}