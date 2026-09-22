import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import TaskList from "../components/TaskList";
import {
  getTasksByUser,
} from "../services/taskService";

import type { TaskResponse } from "../types/task";
import { getApiErrorMessage } from "../utils/apiError";

export default function UserTasks() {
  const { id } = useParams<{ id: string }>();

  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadTasks = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTasksByUser(
          Number(id)
        );

        setTasks(data);
      } catch (error) {
        setError(
          getApiErrorMessage(
            error,
            "Failed to load user tasks."
          )
        );
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [id]);

  return (
    <div className="min-h-screen p-6 md:p-8">

      <div className="mb-8">
        <Link
          to="/users"
          className="text-sm text-indigo-400 hover:text-indigo-300"
        >
          ← Back to Users
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-white">
          User Tasks
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Tasks assigned to this user
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
          <p className="text-slate-400">
            Loading tasks...
          </p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-5 text-red-300">
          {error}
        </div>
      ) : (
        <TaskList
          tasks={tasks}
          emptyMessage="This user has no assigned tasks."
        />
      )}

    </div>
  );
}