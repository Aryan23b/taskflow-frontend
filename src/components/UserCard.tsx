import type { User } from "../types/user";

interface UserCardProps {
  user: User;
  assignedTaskCount: number;
  onDelete: (user: User) => void;
}

export default function UserCard({
  user,
  assignedTaskCount,
  onDelete,
}: UserCardProps) {

  const initials =
    user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="group rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition duration-200 hover:-translate-y-1 hover:bg-white/[0.06]">

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/30 to-blue-500/20 text-sm font-bold text-indigo-200">
            {initials}
          </div>

          <div>
            <h3 className="font-semibold text-white">
              {user.name}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {user.email}
            </p>
          </div>

        </div>

        <button
          onClick={() => onDelete(user)}
          className="rounded-xl px-3 py-2 text-xs text-slate-500 opacity-0 transition group-hover:opacity-100 hover:bg-rose-400/10 hover:text-rose-300"
        >
          Delete
        </button>

      </div>

      <div className="mt-5 flex items-center justify-between rounded-2xl bg-white/5 p-4">

        <div>
          <p className="text-xs text-slate-500">
            Assigned Tasks
          </p>

          <p className="mt-1 text-xl font-bold text-white">
            {assignedTaskCount}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
          ✓
        </div>

      </div>

    </div>
  );
}