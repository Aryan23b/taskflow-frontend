import {
  useEffect,
  useState,
} from "react";

import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import ConfirmDialog from "../components/ConfirmDialog";

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../services/taskService";

import {
  getProjects,
} from "../services/projectService";

import {
  getUsers,
} from "../services/userService";

import {
  useDebounce,
} from "../hooks/useDebounce";

import {
  useToast,
} from "../context/ToastContext";

import {
  getApiErrorMessage,
} from "../utils/apiError";

import type {
  PageResponse,
  Task,
  TaskPriority,
  TaskRequest,
  TaskStatus,
} from "../types/task";

import type {
  Project,
} from "../types/project";

import type {
  User,
} from "../types/user";


const emptyPage:
  PageResponse<Task> = {
    content: [],
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  };


export default function Tasks() {

  const { showToast } =
    useToast();


  // =========================================================
  // Data
  // =========================================================

  const [taskPage, setTaskPage] =
    useState<
      PageResponse<Task>
    >(emptyPage);

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [users, setUsers] =
    useState<User[]>([]);


  // =========================================================
  // UI
  // =========================================================

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  // =========================================================
  // Modal
  // =========================================================

  const [modalOpen, setModalOpen] =
    useState(false);

  const [selectedTask, setSelectedTask] =
    useState<Task | null>(null);


  // =========================================================
  // Delete confirmation
  // =========================================================

  const [deleteTarget, setDeleteTarget] =
    useState<Task | null>(null);


  // =========================================================
  // Filters
  // =========================================================

  const [searchInput, setSearchInput] =
    useState("");

  const debouncedSearch =
    useDebounce(
      searchInput,
      400
    );

  const [status, setStatus] =
    useState<TaskStatus | "">("");

  const [priority, setPriority] =
    useState<TaskPriority | "">("");

  const [projectId, setProjectId] =
    useState<number | "">("");


  // =========================================================
  // Pagination
  // =========================================================

  const [page, setPage] =
    useState(0);

  const size = 6;


  // =========================================================
  // Sorting
  // =========================================================

  const [sortBy, setSortBy] =
    useState("dueDate");

  const [direction, setDirection] =
    useState<"asc" | "desc">("asc");


  // =========================================================
  // Initial project + user data
  // =========================================================

  useEffect(() => {

    async function loadInitialData() {

      try {

        const [
          projectData,
          userData,
        ] = await Promise.all([
          getProjects(),
          getUsers(),
        ]);

        setProjects(
          projectData
        );

        setUsers(
          userData
        );

      } catch (err) {

        console.error(err);

        const message =
          getApiErrorMessage(
            err,
            "Unable to load projects and users."
          );

        setError(message);

        showToast(
          message,
          "error"
        );
      }
    }

    loadInitialData();

  }, [showToast]);


  // =========================================================
  // Load tasks
  // =========================================================

  useEffect(() => {

    async function load() {

      try {

        setLoading(true);
        setError(null);

        const data =
          await getTasks({

            page,

            size,

            status:
              status || undefined,

            priority:
              priority || undefined,

            projectId:
              projectId === ""
                ? undefined
                : projectId,

            title:
              debouncedSearch.trim() ||
              undefined,

            sortBy,

            direction,

          });

        setTaskPage(data);

      } catch (err) {

        console.error(err);

        const message =
          getApiErrorMessage(
            err,
            "Unable to load tasks."
          );

        setError(message);

      } finally {

        setLoading(false);
      }
    }

    load();

  }, [
    page,
    status,
    priority,
    projectId,
    debouncedSearch,
    sortBy,
    direction,
  ]);


  // =========================================================
  // Create
  // =========================================================

  function handleCreate() {

    setSelectedTask(null);
    setModalOpen(true);
  }


  // =========================================================
  // Edit
  // =========================================================

  function handleEdit(
    task: Task
  ) {

    setSelectedTask(task);
    setModalOpen(true);
  }


  // =========================================================
  // Submit create/update
  // =========================================================

  async function handleSubmit(
    form: TaskRequest
  ) {

    try {

      if (selectedTask) {

        await updateTask(
          selectedTask.id,
          form
        );

        showToast(
          "Task updated successfully."
        );

      } else {

        await createTask(form);

        showToast(
          "Task created successfully."
        );
      }

      setModalOpen(false);
      setSelectedTask(null);

      /*
       * Return to first page after a new task
       * is created so the current results stay predictable.
       */
      setPage(0);

      /*
       * Explicit reload.
       * The current filter state is preserved.
       */
      const data =
        await getTasks({
          page: 0,
          size,
          status:
            status || undefined,
          priority:
            priority || undefined,
          projectId:
            projectId === ""
              ? undefined
              : projectId,
          title:
            debouncedSearch.trim() ||
            undefined,
          sortBy,
          direction,
        });

      setTaskPage(data);

    } catch (err) {

      console.error(err);

      const message =
        getApiErrorMessage(
          err,
          "Unable to save task."
        );

      setError(message);

      showToast(
        message,
        "error"
      );

      /*
       * Re-throw so TaskModal knows that
       * submission failed and stays open.
       */
      throw err;
    }
  }


  // =========================================================
  // Ask for delete confirmation
  // =========================================================

  function handleDeleteRequest(
    task: Task
  ) {

    setDeleteTarget(task);
  }


  // =========================================================
  // Confirm delete
  // =========================================================

  async function handleDeleteConfirm() {

    if (!deleteTarget) {
      return;
    }

    const taskId =
      deleteTarget.id;

    const taskTitle =
      deleteTarget.title;

    try {

      await deleteTask(taskId);

      showToast(
        `"${taskTitle}" deleted successfully.`
      );

      setDeleteTarget(null);

      /*
       * If this was the only item on the page,
       * go back one page.
       */
      if (
        taskPage.content.length === 1 &&
        page > 0
      ) {

        setPage(
          (previous) =>
            previous - 1
        );

        return;
      }

      /*
       * Reload current page.
       */
      const data =
        await getTasks({
          page,
          size,
          status:
            status || undefined,
          priority:
            priority || undefined,
          projectId:
            projectId === ""
              ? undefined
              : projectId,
          title:
            debouncedSearch.trim() ||
            undefined,
          sortBy,
          direction,
        });

      setTaskPage(data);

    } catch (err) {

      console.error(err);

      const message =
        getApiErrorMessage(
          err,
          "Unable to delete task."
        );

      showToast(
        message,
        "error"
      );
    }
  }


  // =========================================================
  // Clear filters
  // =========================================================

  function clearFilters() {

    setSearchInput("");
    setStatus("");
    setPriority("");
    setProjectId("");
    setPage(0);
  }


  return (
    <div className="mx-auto max-w-7xl space-y-6">


      {/* ===================================================
          Header
          =================================================== */}

      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Workspace
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Tasks
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage your work, prioritize what matters,
            and keep every project moving.
          </p>

        </div>


        <button
          onClick={handleCreate}
          className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:bg-indigo-400"
        >
          + New Task
        </button>

      </section>


      {/* ===================================================
          Error
          =================================================== */}

      {error && (
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">

          <span>
            {error}
          </span>

          <button
            onClick={() =>
              setError(null)
            }
            className="text-rose-300/60 hover:text-rose-200"
          >
            ✕
          </button>

        </div>
      )}


      {/* ===================================================
          Filters
          =================================================== */}

      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto]">


          {/* Search */}
          <div className="md:col-span-2 xl:col-span-1">

            <input
              value={searchInput}
              onChange={(event) => {

                setSearchInput(
                  event.target.value
                );

                setPage(0);

              }}
              placeholder="Search tasks..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/10"
            />

          </div>


          {/* Status */}
          <select
            value={status}
            onChange={(event) => {

              setStatus(
                event.target.value as
                  | TaskStatus
                  | ""
              );

              setPage(0);

            }}
            className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-400/50"
          >

            <option value="">
              All Status
            </option>

            <option value="TODO">
              To Do
            </option>

            <option value="IN_PROGRESS">
              In Progress
            </option>

            <option value="COMPLETED">
              Done
            </option>

          </select>


          {/* Priority */}
          <select
            value={priority}
            onChange={(event) => {

              setPriority(
                event.target.value as
                  | TaskPriority
                  | ""
              );

              setPage(0);

            }}
            className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-400/50"
          >

            <option value="">
              All Priority
            </option>

            <option value="HIGH">
              High
            </option>

            <option value="MEDIUM">
              Medium
            </option>

            <option value="LOW">
              Low
            </option>

          </select>


          {/* Project */}
          <select
            value={projectId}
            onChange={(event) => {

              const value =
                event.target.value;

              setProjectId(
                value
                  ? Number(value)
                  : ""
              );

              setPage(0);

            }}
            className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-400/50"
          >

            <option value="">
              All Projects
            </option>

            {projects.map(
              (project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </option>
              )
            )}

          </select>


          {/* Sort field */}
          <select
            value={sortBy}
            onChange={(event) => {

              setSortBy(
                event.target.value
              );

              setPage(0);

            }}
            className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-400/50"
          >

            <option value="dueDate">
              Due Date
            </option>

            <option value="title">
              Title
            </option>

            <option value="priority">
              Priority
            </option>

            <option value="status">
              Status
            </option>

            <option value="id">
              ID
            </option>

          </select>


          {/* Direction */}
          <button
            onClick={() => {

              setDirection(
                (previous) =>
                  previous === "asc"
                    ? "desc"
                    : "asc"
              );

              setPage(0);

            }}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10"
          >
            {direction === "asc"
              ? "↑ Asc"
              : "↓ Desc"}
          </button>

        </div>


        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

          <p className="text-xs text-slate-500">
            {taskPage.totalElements} task
            {taskPage.totalElements !== 1
              ? "s"
              : ""}
          </p>

          <button
            onClick={clearFilters}
            className="text-xs font-medium text-indigo-300 transition hover:text-indigo-200"
          >
            Clear filters
          </button>

        </div>

      </section>


      {/* ===================================================
          Loading
          =================================================== */}

      {loading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

          {Array.from({
            length: 6,
          }).map((_, index) => (

            <div
              key={index}
              className="animate-pulse rounded-3xl border border-white/10 bg-white/[0.04] p-5"
            >

              <div className="flex justify-between">

                <div className="w-2/3">

                  <div className="h-5 rounded bg-white/10" />

                  <div className="mt-3 h-3 w-1/2 rounded bg-white/5" />

                </div>

                <div className="h-6 w-16 rounded-full bg-white/5" />

              </div>

              <div className="mt-6 h-10 rounded bg-white/5" />

              <div className="mt-4 h-7 w-1/3 rounded bg-white/5" />

              <div className="mt-6 border-t border-white/5 pt-4">

                <div className="h-8 rounded bg-white/5" />

              </div>

            </div>
          ))}

        </div>
      )}


      {/* ===================================================
          Empty
          =================================================== */}

      {!loading &&
        taskPage.content.length === 0 && (

          <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] px-6 py-16 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-500/10 text-2xl text-indigo-300">
              ✓
            </div>

            <h2 className="mt-5 text-xl font-semibold text-white">
              No tasks found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Nothing matches your current filters.
              Try changing them or create a new task.
            </p>

            <div className="mt-6 flex justify-center gap-3">

              <button
                onClick={clearFilters}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-300 hover:bg-white/10"
              >
                Clear filters
              </button>

              <button
                onClick={handleCreate}
                className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-400"
              >
                Create task
              </button>

            </div>

          </div>
        )}


      {/* ===================================================
          Task cards
          =================================================== */}

      {!loading &&
        taskPage.content.length > 0 && (

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

            {taskPage.content.map(
              (task) => (

                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={
                    handleDeleteRequest
                  }
                />

              )
            )}

          </div>
        )}


      {/* ===================================================
          Pagination
          =================================================== */}

      {!loading &&
        taskPage.totalPages > 0 && (

          <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-slate-500">
              Page{" "}
              <span className="font-medium text-slate-300">
                {taskPage.page + 1}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-300">
                {taskPage.totalPages}
              </span>
            </p>

            <div className="flex gap-2">

              <button
                disabled={
                  taskPage.first
                }
                onClick={() =>
                  setPage(
                    (previous) =>
                      previous - 1
                  )
                }
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
              >
                ← Previous
              </button>

              <button
                disabled={
                  taskPage.last
                }
                onClick={() =>
                  setPage(
                    (previous) =>
                      previous + 1
                  )
                }
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Next →
              </button>

            </div>

          </div>
        )}


      {/* ===================================================
          Create/Edit modal
          =================================================== */}

      <TaskModal
        open={modalOpen}
        task={selectedTask}
        projects={projects}
        users={users}
        onClose={() => {
          setModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleSubmit}
      />


      {/* ===================================================
          Delete confirmation
          =================================================== */}

      <ConfirmDialog
        open={
          deleteTarget !== null
        }
        title="Delete task?"
        description={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete task"
        cancelText="Keep task"
        danger={true}
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