import { useEffect, useState } from "react";

import { getMyTasks ,updateMyTaskStatus,} from "../services/taskService";

import type { TaskResponse,TaskStatus } from "../types/task";
import { getApiErrorMessage } from "../utils/apiError";


const statusOptions: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "COMPLETED",
];

export default function MyTasks() {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingTaskId, setUpdatingTaskId] =
    useState<number | null>(null);

   const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyTasks();

      setTasks(data);
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "Failed to load your tasks."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // =========================================
  // UPDATE STATUS
  // =========================================

  const handleStatusChange = async (
    taskId: number,
    status: TaskStatus
  ) => {
    try {
      setUpdatingTaskId(taskId);
      setError("");

      const updatedTask =
        await updateMyTaskStatus(
          taskId,
          status
        );

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId
            ? updatedTask
            : task
        )
      );
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "Failed to update task status."
        )
      );
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="min-h-screen p-6 md:p-8">
        <div className="mb-8">
          <div className="h-8 w-36 animate-pulse rounded-lg bg-slate-800" />
          <div className="mt-3 h-4 w-64 animate-pulse rounded bg-slate-800" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-40 animate-pulse rounded-2xl border border-slate-800 bg-slate-900"
              />
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          My Tasks
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          View and update tasks assigned to you.
        </p>
      </div>

      {/* =====================================
          ERROR
      ====================================== */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* =====================================
          EMPTY
      ====================================== */}

      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-12 text-center">

          <h2 className="text-lg font-semibold text-white">
            No tasks assigned
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            You currently have no assigned tasks.
          </p>

        </div>
      ) : (

        <div className="space-y-4">

          {tasks.map((task) => (

            <div
              key={task.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
            >

              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                {/* =================================
                    TASK INFORMATION
                ================================== */}

                <div className="min-w-0 flex-1">

                  <h2 className="text-lg font-semibold text-white">
                    {task.title}
                  </h2>

                  {task.description && (
                    <p className="mt-1 text-sm text-slate-400">
                      {task.description}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        task.status === "COMPLETED"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : task.status ===
                            "IN_PROGRESS"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {task.status}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
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

                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">

                    <span>
                      Project:{" "}
                      <span className="text-slate-300">
                        {task.projectName ||
                          `#${task.projectId}`}
                      </span>
                    </span>

                    <span>
                      Due:{" "}
                      <span className="text-slate-300">
                        {task.dueDate ||
                          "No due date"}
                      </span>
                    </span>

                  </div>

                </div>


                {/* =================================
                    STATUS UPDATE
                ================================== */}

                <div className="w-full lg:w-52">

                  <label className="mb-2 block text-xs font-medium text-slate-500">
                    Update Status
                  </label>

                  <select
                    value={task.status}
                    disabled={
                      updatingTaskId === task.id
                    }
                    onChange={(event) =>
                      handleStatusChange(
                        task.id,
                        event.target.value as TaskStatus
                      )
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {statusOptions.map(
                      (status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status.replace(
                            "_",
                            " "
                          )}
                        </option>
                      )
                    )}

                  </select>

                  {updatingTaskId ===
                    task.id && (
                    <p className="mt-2 text-xs text-slate-500">
                      Updating...
                    </p>
                  )}

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}