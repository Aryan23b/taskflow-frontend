import {
  useEffect,
  useState,
} from "react";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router";

import {
  getTasks,
} from "../services/taskService";


const navItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: "⌂",
  },
  {
    label: "Tasks",
    path: "/tasks",
    icon: "✓",
  },
  {
    label: "Projects",
    path: "/projects",
    icon: "▦",
  },
  {
    label: "Team",
    path: "/users",
    icon: "◉",
  },
];


function NavItems({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {

  return (
    <div className="space-y-1">

      {navItems.map(
        (item) => (

          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition",
                isActive
                  ? "bg-indigo-500/15 text-white ring-1 ring-indigo-400/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white",
              ].join(" ")
            }
          >

            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
              {item.icon}
            </span>

            <span>
              {item.label}
            </span>

          </NavLink>

        )
      )}

    </div>
  );
}


function SidebarContent({
  onNavigate,
  weeklyProgress,
}: {
  onNavigate?: () => void;
  weeklyProgress: number;
}) {

  return (
    <div className="flex h-full flex-col">

      {/* Logo */}

      <div className="flex items-center gap-3 px-6 py-6">

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500 text-lg font-bold shadow-lg shadow-indigo-500/30">
          T
        </div>

        <div>

          <h1 className="text-lg font-bold tracking-tight">
            TaskFlow
          </h1>

          <p className="text-xs text-slate-500">
            Work smarter
          </p>

        </div>

      </div>


      {/* Navigation */}

      <nav className="flex-1 px-4">

        <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Workspace
        </p>

        <NavItems
          onNavigate={onNavigate}
        />

      </nav>


      {/* Bottom card */}

      <div className="m-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4">

        <p className="text-sm font-semibold text-white">
          Keep things moving
        </p>

        <p className="mt-2 text-xs leading-5 text-slate-400">
          Stay organized and turn plans into completed work.
        </p>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">

          <div
            className="h-full rounded-full bg-indigo-500 transition-all"
            style={{ width: `${weeklyProgress}%` }}
          />

        </div>

        <p className="mt-2 text-xs text-slate-500">
          {weeklyProgress}% weekly progress
        </p>

      </div>

    </div>
  );
}


export default function AppLayout() {

  const navigate =
    useNavigate();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [weeklyProgress, setWeeklyProgress] =
    useState(0);

  useEffect(() => {
    async function loadWeeklyProgress() {
      try {
        const response = await getTasks({
          page: 0,
          size: 50,
        });

        const today = new Date();
        const weekStart = new Date(today);
        const day = today.getDay();
        const daysSinceMonday = day === 0 ? 6 : day - 1;

        weekStart.setDate(today.getDate() - daysSinceMonday);
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);

        const weeklyTasks = response.content.filter((task) => {
          if (!task.dueDate) {
            return false;
          }

          const dueDate = new Date(`${task.dueDate}T00:00:00`);
          return dueDate >= weekStart && dueDate < weekEnd;
        });

        const completedTasks = weeklyTasks.filter(
          (task) => task.status === "COMPLETED"
        ).length;

        setWeeklyProgress(
          weeklyTasks.length === 0
            ? 0
            : Math.round(
                (completedTasks / weeklyTasks.length) * 100
              )
        );
      } catch (error) {
        console.error("Unable to load weekly progress", error);
      }
    }

    loadWeeklyProgress();
  }, []);


  return (
    <div className="min-h-screen text-slate-100">

      <div className="flex min-h-screen">


        {/* =================================================
            Desktop sidebar
            ================================================= */}

        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-slate-950/80 backdrop-blur-xl lg:flex">

          <SidebarContent
            weeklyProgress={weeklyProgress}
          />

        </aside>


        {/* =================================================
            Mobile sidebar
            ================================================= */}

        {mobileOpen && (

          <div className="fixed inset-0 z-50 lg:hidden">

            {/* Backdrop */}

            <button
              aria-label="Close menu"
              onClick={() =>
                setMobileOpen(false)
              }
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />


            {/* Drawer */}

            <aside className="relative h-full w-72 max-w-[85vw] border-r border-white/10 bg-slate-950 shadow-2xl">

              <div className="absolute right-4 top-5">

                <button
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="rounded-xl bg-white/5 px-3 py-2 text-slate-400 hover:bg-white/10 hover:text-white"
                >
                  ✕
                </button>

              </div>

              <SidebarContent
                weeklyProgress={weeklyProgress}
                onNavigate={() =>
                  setMobileOpen(false)
                }
              />

            </aside>

          </div>

        )}


        {/* =================================================
            Main
            ================================================= */}

        <main className="min-w-0 flex-1">


          {/* =================================================
              Header
              ================================================= */}

          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-slate-950/70 px-4 backdrop-blur-xl sm:px-6 lg:px-8">


            <div className="flex items-center gap-3">


              {/* Mobile menu */}

              <button
                onClick={() =>
                  setMobileOpen(true)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 lg:hidden"
                aria-label="Open menu"
              >
                ☰
              </button>


              <div>

                <p className="text-xs font-medium text-slate-500">
                  Workspace
                </p>

                <p className="text-sm font-semibold text-slate-200">
                  Personal productivity
                </p>

              </div>

            </div>


            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={() =>
                  navigate("/tasks")
                }
                className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 sm:block"
                aria-label="Search tasks"
              >
                Search
              </button>


              <button
                type="button"
                onClick={() =>
                  navigate("/users")
                }
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-blue-600 text-sm font-bold shadow-lg shadow-indigo-500/20 transition hover:scale-105"
                aria-label="Open team members"
              >
                A
              </button>

            </div>

          </header>


          {/* Page */}

          <div className="p-4 sm:p-6 lg:p-8">

            <Outlet />

          </div>

        </main>

      </div>

    </div>
  );
}