import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createUser,
  deleteUser,
  getUsers,
} from "../services/userService";

import {
  getTasks,
} from "../services/taskService";

import type {
  UserRequest,
  UserResponse,
} from "../types/user";

import { getApiErrorMessage } from "../utils/apiError";

interface UserWithTaskCount extends UserResponse {
  taskCount: number;
}

export default function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserWithTaskCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [form, setForm] = useState<UserRequest>({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(
    null
  );

  // =========================================
  // LOAD USERS
  // =========================================

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const userData = await getUsers();

      const usersWithTaskCount =
        await Promise.all(
          userData.map(async (user) => {
            try {
              const taskPage = await getTasks({
                assignedUserId: user.id,
                page: 0,
                size: 1,
              });

              return {
                ...user,
                taskCount: taskPage.totalElements,
              };
            } catch {
              return {
                ...user,
                taskCount: 0,
              };
            }
          })
        );

      setUsers(usersWithTaskCount);
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "Failed to load users."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // =========================================
  // CREATE USER
  // =========================================

  const handleCreateUser = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!form.password.trim()) {
      setError("Password is required.");
      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setCreating(true);
      setError("");

      await createUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });

      setForm({
        name: "",
        email: "",
        password: "",
        role: "USER",
      });

      setShowCreateForm(false);

      await loadUsers();
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "Failed to create user."
        )
      );
    } finally {
      setCreating(false);
    }
  };

  // =========================================
  // DELETE USER
  // =========================================

  const handleDeleteUser = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      await deleteUser(id);

      setUsers((currentUsers) =>
        currentUsers.filter(
          (user) => user.id !== id
        )
      );
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "Failed to delete user."
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
          <div className="h-8 w-32 animate-pulse rounded-lg bg-slate-800" />

          <div className="mt-3 h-4 w-64 animate-pulse rounded bg-slate-800" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-52 animate-pulse rounded-2xl border border-slate-800 bg-slate-900"
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
            Users
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Manage TaskFlow users and their assigned tasks.
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
            : "+ Add User"}
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
          CREATE USER FORM
      ====================================== */}

      {showCreateForm && (
        <form
          onSubmit={handleCreateUser}
          className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          <h2 className="text-lg font-semibold text-white">
            Create User
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Name
              </label>

              <input
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Enter name"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email
              </label>

              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                placeholder="user@example.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>

              <input
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                placeholder="Minimum 6 characters"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Role
              </label>

              <select
                value={form.role}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    role: event.target.value as
                      | "ADMIN"
                      | "USER",
                  }))
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
              >
                <option value="USER">
                  USER
                </option>

                <option value="ADMIN">
                  ADMIN
                </option>
              </select>
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
                : "Create User"}
            </button>
          </div>
        </form>
      )}

      {/* =====================================
          EMPTY STATE
      ====================================== */}

      {users.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-12 text-center">
          <h3 className="text-lg font-semibold text-white">
            No users found
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Create your first TaskFlow user.
          </p>
        </div>
      ) : (
        /* ===================================
           USER CARDS
        ==================================== */

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

          {users.map((user) => (
            <div
              key={user.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700 hover:bg-slate-900/80"
            >

              {/* User Header */}
              <div className="flex items-start justify-between gap-4">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
                    {user.name
                      ?.charAt(0)
                      .toUpperCase() ?? "U"}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-white">
                      {user.name}
                    </h3>

                    <p className="truncate text-sm text-slate-400">
                      {user.email}
                    </p>
                  </div>

                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    user.role === "ADMIN"
                      ? "bg-indigo-500/15 text-indigo-400"
                      : "bg-emerald-500/15 text-emerald-400"
                  }`}
                >
                  {user.role}
                </span>

              </div>

              {/* Task Count */}
              <div className="mt-6 rounded-xl bg-slate-950 p-4">
                <p className="text-xs text-slate-500">
                  Assigned Tasks
                </p>

                <p className="mt-1 text-2xl font-bold text-white">
                  {user.taskCount}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-5 flex gap-3">

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/users/${user.id}/tasks`
                    )
                  }
                  className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
                >
                  View Tasks
                </button>

                <button
                  type="button"
                  disabled={
                    deletingId === user.id
                  }
                  onClick={() =>
                    handleDeleteUser(user.id)
                  }
                  className="rounded-xl border border-red-900/50 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                >
                  {deletingId === user.id
                    ? "..."
                    : "Delete"}
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}