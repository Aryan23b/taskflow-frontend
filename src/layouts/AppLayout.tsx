import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === "ADMIN";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-xl px-4 py-3 text-sm font-medium transition-all ${
      isActive
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* =========================
          SIDEBAR
      ========================== */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-800 bg-slate-900 lg:block">

        {/* Logo */}
        <div className="flex h-20 items-center border-b border-slate-800 px-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              TaskFlow
            </h1>

            <p className="mt-0.5 text-xs text-slate-500">
              Task Management
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 p-4">

          {/* Dashboard */}
          <NavLink to="/" className={navLinkClass}>
            <div className="flex items-center gap-3">
              <span className="text-lg">⌂</span>
              <span>Dashboard</span>
            </div>
          </NavLink>

            {/* My Tasks */}
          {!isAdmin && (
            <NavLink
              to="/my-tasks"
              className={navLinkClass}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">✓</span>
                <span>My Tasks</span>
              </div>
            </NavLink>
          )}

          {/* ADMIN ONLY */}
          {isAdmin && (
            <>
              {/* Users */}
              <NavLink to="/users" className={navLinkClass}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">◉</span>
                  <span>Users</span>
                </div>
              </NavLink>

              {/* Projects */}
              <NavLink to="/projects" className={navLinkClass}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">▣</span>
                  <span>Projects</span>
                </div>
              </NavLink>

              {/* All Tasks */}
              <NavLink to="/tasks" className={navLinkClass}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">✓</span>
                  <span>All Tasks</span>
                </div>
              </NavLink>
            </>
          )}
        </nav>

        {/* =========================
            USER PROFILE
        ========================== */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-800 p-4">

          <div className="mb-4 flex items-center gap-3">

            {/* Avatar */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </div>

            {/* User Info */}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {user?.name ?? "User"}
              </p>

              <p className="truncate text-xs text-slate-500">
                {user?.email ?? ""}
              </p>

              <span
                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  isAdmin
                    ? "bg-indigo-500/15 text-indigo-400"
                    : "bg-emerald-500/15 text-emerald-400"
                }`}
              >
                {user?.role ?? "USER"}
              </span>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* =========================
          MAIN CONTENT
      ========================== */}
      <main className="min-h-screen lg:ml-64">
        <Outlet />
      </main>
    </div>
  );
}