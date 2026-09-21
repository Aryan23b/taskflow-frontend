import {
  useEffect,
  useState,
} from "react";

import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import ConfirmDialog from "../components/ConfirmDialog";

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

import {
  useToast,
} from "../context/ToastContext";

import {
  getApiErrorMessage,
} from "../utils/apiError";

import type {
  Project,
  ProjectRequest,
} from "../types/project";

import type {
  User,
} from "../types/user";


interface ProjectWithCount {
  project: Project;
  taskCount: number;
}


export default function Projects() {

  const { showToast } =
    useToast();


  const [projects, setProjects] =
    useState<ProjectWithCount[]>([]);

  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [deleteTarget, setDeleteTarget] =
    useState<Project | null>(null);


  useEffect(() => {

    loadProjects();

  }, []);


  async function loadProjects() {

    try {

      setLoading(true);
      setError(null);

      const [
        projectData,
        userData,
      ] = await Promise.all([
        getProjects(),
        getUsers(),
      ]);


      const projectsWithCounts =
        await Promise.all(

          projectData.map(
            async (project) => {

              const taskPage =
                await getTasks({

                  projectId:
                    project.id,

                  page: 0,

                  size: 1,

                });

              return {
                project,

                taskCount:
                  taskPage.totalElements,
              };
            }
          )
        );


      setProjects(
        projectsWithCounts
      );

      setUsers(
        userData
      );

    } catch (err) {

      console.error(err);

      const message =
        getApiErrorMessage(
          err,
          "Unable to load projects."
        );

      setError(message);

    } finally {

      setLoading(false);
    }
  }


  async function handleCreate(
    data: ProjectRequest
  ) {

    try {

      await createProject(data);

      await loadProjects();

      showToast(
        "Project created successfully."
      );

      setModalOpen(false);

    } catch (err) {

      console.error(err);

      const message =
        getApiErrorMessage(
          err,
          "Unable to create project."
        );

      setError(message);

      showToast(
        message,
        "error"
      );

      throw err;
    }
  }


  function handleDeleteRequest(
    project: Project
  ) {

    setDeleteTarget(project);
  }


  async function handleDeleteConfirm() {

    if (!deleteTarget) {
      return;
    }

    try {

      await deleteProject(
        deleteTarget.id
      );

      showToast(
        `"${deleteTarget.name}" deleted successfully.`
      );

      setDeleteTarget(null);

      await loadProjects();

    } catch (err) {

      console.error(err);

      const message =
        getApiErrorMessage(
          err,
          "Unable to delete project."
        );

      setError(message);

      showToast(
        message,
        "error"
      );
    }
  }


  return (
    <div className="mx-auto max-w-7xl space-y-6">

      {/* Header */}

      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Workspace
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Projects
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Organize related work into projects and keep everyone aligned.
          </p>

        </div>


        <button
          onClick={() =>
            setModalOpen(true)
          }
          className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:bg-indigo-400"
        >
          + New Project
        </button>

      </section>


      {/* Error */}

      {error && (
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">

          <span>
            {error}
          </span>

          <button
            onClick={() =>
              setError(null)
            }
          >
            ✕
          </button>

        </div>
      )}


      {/* Loading */}

      {loading ? (

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

          {Array.from({
            length: 6,
          }).map((_, index) => (

            <div
              key={index}
              className="animate-pulse rounded-3xl border border-white/10 bg-white/[0.04] p-5"
            >

              <div className="h-12 w-12 rounded-2xl bg-white/10" />

              <div className="mt-5 h-4 w-2/3 rounded bg-white/10" />

              <div className="mt-3 h-3 w-1/3 rounded bg-white/5" />

              <div className="mt-6 h-12 rounded bg-white/5" />

            </div>

          ))}

        </div>

      ) : projects.length === 0 ? (

        <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] px-6 py-16 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-500/10 text-2xl text-indigo-300">
            ▦
          </div>

          <h2 className="mt-5 text-xl font-semibold text-white">
            No projects yet
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Create a project to start organizing your tasks.
          </p>

          <button
            onClick={() =>
              setModalOpen(true)
            }
            className="mt-6 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            Create project
          </button>

        </div>

      ) : (

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

          {projects.map(
            ({
              project,
              taskCount,
            }) => (

              <ProjectCard
                key={project.id}
                project={project}
                taskCount={taskCount}
                onDelete={
                  handleDeleteRequest
                }
              />

            )
          )}

        </div>

      )}


      <ProjectModal
        open={modalOpen}
        users={users}
        onClose={() =>
          setModalOpen(false)
        }
        onSubmit={handleCreate}
      />


      <ConfirmDialog
        open={
          deleteTarget !== null
        }
        title="Delete project?"
        description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? The backend will reject deletion if the project still contains tasks.`
            : ""
        }
        confirmText="Delete project"
        cancelText="Keep project"
        onClose={() =>
          setDeleteTarget(null)
        }
        onConfirm={
          handleDeleteConfirm
        }
      />

    </div>
  );
}