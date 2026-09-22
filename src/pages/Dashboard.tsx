import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router";

import StatCard from "../components/StatCard";

import {
  getTasks,
  getMyTasks,
} from "../services/taskService";

import {
  getProjects,
} from "../services/projectService";

import {
  getUsers,
} from "../services/userService";

import type {
  Task,
  TaskStatus,
} from "../types/task";
import { useAuth } from "../context/AuthContext";

interface DashboardStats {
  total: number;
  todo: number;
  inProgress: number;
  Completed: number;
  projects: number;
  users: number;
}


export default function Dashboard() {

  const navigate =
    useNavigate();
  const { user } = useAuth();


  const [stats, setStats] =
    useState<DashboardStats>({
      total: 0,
      todo: 0,
      inProgress: 0,
      Completed: 0,
      projects: 0,
      users: 0,
    });


  const [recentTasks, setRecentTasks] =
    useState<Task[]>([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState<string | null>(null);


  useEffect(() => {

    loadDashboard();

  }, [user?.role]);


  async function getStatusCount(
    status: TaskStatus
  ) {

    const response =
      await getTasks({
        status,
        page: 0,
        size: 1,
      });

    return response.totalElements;
  }


  async function loadDashboard() {

    try {

      setLoading(true);
      setError(null);

      if (user?.role === "USER") {
        const assignedTasks = await getMyTasks();

        setStats({
          total: assignedTasks.length,
          todo: assignedTasks.filter(
            (task) => task.status === "TODO"
          ).length,
          inProgress: assignedTasks.filter(
            (task) => task.status === "IN_PROGRESS"
          ).length,
          Completed: assignedTasks.filter(
            (task) => task.status === "COMPLETED"
          ).length,
          projects: 0,
          users: 0,
        });
        setRecentTasks(assignedTasks.slice(0, 5));
        return;
      }

      const [
        totalPage,
        todoCount,
        inProgressCount,
        doneCount,
        projectData,
        userData,
        recentPage,
      ] = await Promise.all([

        // Total
        getTasks({
          page: 0,
          size: 1,
        }),

        // TODO
        getStatusCount("TODO"),

        // IN_PROGRESS
        getStatusCount(
          "IN_PROGRESS"
        ),

        // DONE
        getStatusCount("COMPLETED"),

        // Projects
        getProjects(),

        // Users
        getUsers(),

        // Recent tasks
        getTasks({
          page: 0,
          size: 5,
          sortBy: "dueDate",
          direction: "asc",
        }),

      ]);


      setStats({
        total:
          totalPage.totalElements,

        todo:
          todoCount,

        inProgress:
          inProgressCount,

        Completed:
          doneCount,

        projects:
          projectData.length,

        users:
          userData.length,
      });


      setRecentTasks(
        recentPage.content
      );

    } catch (err) {

      console.error(err);

      setError(
        "Unable to load dashboard data."
      );

    } finally {

      setLoading(false);
    }
  }


  const completion =
    stats.total === 0
      ? 0
      : Math.round(
          (stats.Completed /
            stats.total) *
            100
        );


  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-indigo-500/20 via-slate-900 to-slate-950 p-6 shadow-2xl sm:p-8">

        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative">

          <p className="text-sm font-medium text-indigo-300">
            TaskFlow workspace
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Stay on top of your work.
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            Track tasks, manage projects, and keep your team aligned from one place.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">

            <button
              onClick={() =>
                navigate("/tasks")
              }
              className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-400"
            >
              View Tasks
            </button>

            {user?.role === "ADMIN" && (
              <button
                onClick={() =>
                  navigate("/projects")
                }
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10"
              >
                View Projects
              </button>
            )}

          </div>

        </div>
      </section>


      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}


      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="Total Tasks"
          value={stats.total}
          description="All tasks"
          icon="✓"
        />

        <StatCard
          label="To Do"
          value={stats.todo}
          description="Waiting to start"
          icon="○"
          accent="from-slate-500/20 to-slate-500/5"
        />

        <StatCard
          label="In Progress"
          value={stats.inProgress}
          description="Currently active"
          icon="◌"
          accent="from-amber-500/20 to-amber-500/5"
        />

        <StatCard
          label="Completed"
          value={stats.Completed}
          description="Finished tasks"
          icon="✓"
          accent="from-emerald-500/20 to-emerald-500/5"
        />

      </section>


      {/* Secondary stats */}
      <section className="grid gap-4 sm:grid-cols-2">

        {user?.role === "ADMIN" && (
          <button
            onClick={() =>
              navigate("/projects")
            }
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-left transition hover:bg-white/[0.06]"
          >

          <p className="text-sm text-slate-400">
            Projects
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {stats.projects}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Organize your work
          </p>

          </button>
        )}


        <button
          onClick={() =>
            navigate("/users")
          }
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-left transition hover:bg-white/[0.06]"
        >

          <p className="text-sm text-slate-400">
            Team Members
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {stats.users}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            People in workspace
          </p>

        </button>

      </section>


      {/* Main dashboard */}
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">


        {/* Recent tasks */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-lg font-semibold text-white">
                Upcoming Tasks
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Sorted by due date.
              </p>

            </div>

            <button
              onClick={() =>
                navigate("/tasks")
              }
              className="text-sm font-medium text-indigo-300 hover:text-indigo-200"
            >
              View all
            </button>

          </div>


          <div className="mt-6 divide-y divide-white/5">

            {!loading &&
              recentTasks.map(
                (task) => (

                  <div
                    key={task.id}
                    className="flex items-center justify-between gap-4 py-4"
                  >

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-sm text-slate-300">
                        ✓
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-medium text-white">
                          {task.title}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {task.projectName}
                        </p>

                      </div>

                    </div>

                    <div className="shrink-0 text-right">

                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
                        {task.status.replace(
                          "_",
                          " "
                        )}
                      </span>

                      {task.dueDate && (
                        <p className="mt-2 text-[11px] text-slate-500">
                          {task.dueDate}
                        </p>
                      )}

                    </div>

                  </div>

                )
              )}


            {!loading &&
              recentTasks.length === 0 && (

                <div className="py-10 text-center">

                  <p className="text-sm text-slate-500">
                    No tasks found.
                  </p>

                  <button
                    onClick={() =>
                      navigate("/tasks")
                    }
                    className="mt-3 text-sm font-medium text-indigo-300"
                  >
                    Create a task
                  </button>

                </div>

              )}

          </div>

        </div>


        {/* Progress */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">

          <h2 className="text-lg font-semibold text-white">
            Completion
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Overall task progress.
          </p>


          <div className="mt-8 flex justify-center">

            <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-[conic-gradient(#6366f1_0_var(--completion),rgba(255,255,255,0.07)_var(--completion)_100%)]"
              style={{
                "--completion": `${completion}%`,
              } as React.CSSProperties}
            >

              <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-slate-950">

                <span className="text-3xl font-bold text-white">
                  {completion}%
                </span>

                <span className="text-xs text-slate-500">
                  complete
                </span>

              </div>

            </div>

          </div>


          <div className="mt-8 grid grid-cols-2 gap-3">

            <div className="rounded-2xl bg-white/5 p-4">

              <p className="text-xs text-slate-500">
                Completed
              </p>

              <p className="mt-1 text-xl font-bold text-white">
                {stats.Completed}
              </p>

            </div>

            <div className="rounded-2xl bg-white/5 p-4">

              <p className="text-xs text-slate-500">
                Remaining
              </p>

              <p className="mt-1 text-xl font-bold text-white">
                {Math.max(
                  stats.total -
                    stats.Completed,
                  0
                )}
              </p>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}