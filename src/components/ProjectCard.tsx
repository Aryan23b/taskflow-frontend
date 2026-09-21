import type { Project } from "../types/project";

interface ProjectCardProps {
  project: Project;
  taskCount: number;
  onDelete: (project: Project) => void;
}

export default function ProjectCard({
  project,
  taskCount,
  onDelete,
}: ProjectCardProps) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition duration-200 hover:-translate-y-1 hover:bg-white/[0.06]">

      <div className="flex items-start justify-between gap-4">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-lg text-indigo-300">
            ▦
          </div>

          <div className="min-w-0">

            <h3 className="truncate text-base font-semibold text-white">
              {project.name}
            </h3>

            <p className="mt-1 truncate text-xs text-slate-500">
              Owner: {project.ownerName}
            </p>

          </div>

        </div>

        <button
          onClick={() => onDelete(project)}
          className="rounded-xl px-3 py-2 text-xs text-slate-500 opacity-0 transition group-hover:opacity-100 hover:bg-rose-400/10 hover:text-rose-300"
        >
          Delete
        </button>

      </div>

      <p className="mt-5 line-clamp-2 min-h-12 text-sm leading-6 text-slate-400">
        {project.description ||
          "No project description added yet."}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">

        <div>
          <p className="text-xs text-slate-500">
            Tasks
          </p>

          <p className="mt-1 text-lg font-semibold text-white">
            {taskCount}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-500">
            Owner ID
          </p>

          <p className="mt-1 text-sm font-medium text-slate-300">
            #{project.ownerId}
          </p>
        </div>

      </div>

    </div>
  );
}