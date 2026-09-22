import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createProject,
  deleteProject,
  getProjects,
} from "../services/projectService";

import {
  getUsers,
} from "../services/userService";

import {
  getTasks,
} from "../services/taskService";

import type {
  ProjectRequest,
  ProjectResponse,
} from "../types/project";

import type {
  UserResponse,
} from "../types/user";

import { getApiErrorMessage } from "../utils/apiError";

interface ProjectWithTaskCount
  extends ProjectResponse {
  taskCount: number;
}

export default function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<
    ProjectWithTaskCount[]
  >([]);

  const [users, setUsers] = useState<
    UserResponse[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [creating, setCreating] = useState(false);

  const [deletingId, setDeletingId] = useState<
    number | null
  >(null);

  const [form, setForm] =
    useState<ProjectRequest>({
      name: "",
      description: "",
      ownerId: 0,
    });

  // =========================================
  // LOAD PROJECTS + USERS
  // =========================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [projectData, userData] =
        await Promise.all([
          getProjects(),
          getUsers(),
        ]);

      setUsers(userData);

      const projectsWithTaskCount =
        await Promise.all(
          projectData.map(async (project) => {
            try {
              const taskPage = await getTasks({
                projectId: project.id,
                page: 0,
                size: 1,
              });

              return {
                ...project,
                taskCount:
                  taskPage.totalElements,
              };
            } catch {
              return {
                ...project,
                taskCount: 0,
              };
            }
          })
        );

      setProjects(projectsWithTaskCount);
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "Failed to load projects."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =========================================
  // CREATE PROJECT
  // =========================================

  const handleCreateProject = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Project name is required.");
      return;
    }

    if (!form.ownerId) {
      setError("Please select a project owner.");
      return;
    }

    try {
      setCreating(true);
      setError("");

      await createProject({
        name: form.name.trim(),
        description:
          form.description?.trim() || "",
        ownerId: Number(form.ownerId),
      });

      setForm({
        name: "",
        description: "",
        ownerId: 0,
      });

      setShowCreateForm(false);

      await loadData();
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "Failed to create project."
        )
      );
    } finally {
      setCreating(false);
    }
  };

  // =========================================
  // DELETE PROJECT
  // =========================================

  const handleDeleteProject = async (
    id: number
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      await deleteProject(id);

      setProjects((currentProjects) =>
        currentProjects.filter(
          (project) => project.id !== id
        )
      );
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "Failed to delete project. Make sure the project has no tasks."
        )
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="min-h-screen p-6 md:p-8">

        <div className="mb-8">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-slate-800" />

          <div className="mt-3 h-4 w-72 animate-pulse rounded bg-slate-800" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-56 animate-pulse rounded-2xl border border-slate-800 bg-slate-900"
            />
          ))}
        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Projects
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Manage projects and view their tasks.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowCreateForm((value) => !value)
          }
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          {showCreateForm
            ? "Cancel"
            : "+ Add Project"}
        </button>

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
          CREATE PROJECT
      ====================================== */}

      {showCreateForm && (
        <form
          onSubmit={handleCreateProject}
          className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          <h2 className="text-lg font-semibold text-white">
            Create Project
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">

            {/* Project Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Project Name
              </label>

              <input
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="TaskFlow"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
              />
            </div>

            {/* Owner */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Project Owner
              </label>

              <select
                value={form.ownerId}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    ownerId: Number(
                      event.target.value
                    ),
                  }))
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
              >
                <option value={0}>
                  Select owner
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

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Description
              </label>

              <textarea
                rows={4}
                value={form.description ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description:
                      event.target.value,
                  }))
                }
                placeholder="Describe the project..."
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
              />
            </div>

          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={creating}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating
                ? "Creating..."
                : "Create Project"}
            </button>
          </div>
        </form>
      )}

      {/* =====================================
          EMPTY STATE
      ====================================== */}

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-12 text-center">

          <h3 className="text-lg font-semibold text-white">
            No projects found
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Create your first project to get started.
          </p>

        </div>
      ) : (
        /* ===================================
           PROJECT CARDS
        ==================================== */

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

          {projects.map((project) => {

            const owner = users.find(
              (user) =>
                user.id === project.ownerId
            );

            return (
              <div
                key={project.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700 hover:bg-slate-900/80"
              >

                {/* Project Header */}
                <div className="flex items-start justify-between gap-4">

                  <div className="min-w-0">

                    <h3 className="truncate text-lg font-semibold text-white">
                      {project.name}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-sm text-slate-400">
                      {project.description ||
                        "No description provided."}
                    </p>

                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                    #
                  </div>

                </div>

                {/* Owner */}
                <div className="mt-5 flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-slate-300">
                    {owner?.name
                      ?.charAt(0)
                      .toUpperCase() ?? "U"}
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Owner
                    </p>

                    <p className="text-sm font-medium text-slate-300">
                      {owner?.name ||
                        project.ownerName ||
                        "Unknown"}
                    </p>
                  </div>

                </div>

                {/* Task Count */}
                <div className="mt-5 rounded-xl bg-slate-950 p-4">

                  <p className="text-xs text-slate-500">
                    Project Tasks
                  </p>

                  <p className="mt-1 text-2xl font-bold text-white">
                    {project.taskCount}
                  </p>

                </div>

                {/* Actions */}
                <div className="mt-5 flex gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/projects/${project.id}/tasks`
                      )
                    }
                    className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
                  >
                    View Tasks
                  </button>

                  <button
                    type="button"
                    disabled={
                      deletingId === project.id
                    }
                    onClick={() =>
                      handleDeleteProject(
                        project.id
                      )
                    }
                    className="rounded-xl border border-red-900/50 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                  >
                    {deletingId ===
                    project.id
                      ? "..."
                      : "Delete"}
                  </button>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}