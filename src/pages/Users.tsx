import {
  useEffect,
  useState,
} from "react";

import UserCard from "../components/UserCard";
import UserModal from "../components/UserModal";
import ConfirmDialog from "../components/ConfirmDialog";

import {
  createUser,
  deleteUser,
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
  User,
  UserRequest,
} from "../types/user";


interface UserWithCount {
  user: User;
  assignedTaskCount: number;
}


export default function Users() {

  const { showToast } =
    useToast();


  const [users, setUsers] =
    useState<UserWithCount[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [deleteTarget, setDeleteTarget] =
    useState<User | null>(null);


  useEffect(() => {

    loadUsers();

  }, []);


  async function loadUsers() {

    try {

      setLoading(true);
      setError(null);

      const userData =
        await getUsers();


      const usersWithCounts =
        await Promise.all(

          userData.map(
            async (user) => {

              const taskPage =
                await getTasks({
                  assignedUserId:
                    user.id,
                  page: 0,
                  size: 1,
                });

              return {
                user,
                assignedTaskCount:
                  taskPage.totalElements,
              };
            }
          )
        );


      setUsers(
        usersWithCounts
      );

    } catch (err) {

      console.error(err);

      const message =
        getApiErrorMessage(
          err,
          "Unable to load team members."
        );

      setError(message);

    } finally {

      setLoading(false);
    }
  }


  async function handleCreate(
    data: UserRequest
  ) {

    try {

      await createUser(data);

      await loadUsers();

      setModalOpen(false);

      showToast(
        "Team member added successfully."
      );

    } catch (err) {

      console.error(err);

      const message =
        getApiErrorMessage(
          err,
          "Unable to create user."
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
    user: User
  ) {

    setDeleteTarget(user);
  }


  async function handleDeleteConfirm() {

    if (!deleteTarget) {
      return;
    }

    try {

      await deleteUser(
        deleteTarget.id
      );

      showToast(
        `${deleteTarget.name} deleted successfully.`
      );

      setDeleteTarget(null);

      await loadUsers();

    } catch (err) {

      console.error(err);

      const message =
        getApiErrorMessage(
          err,
          "Unable to delete user."
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
            Team
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            See who's involved and how work is distributed across the workspace.
          </p>

        </div>


        <button
          onClick={() =>
            setModalOpen(true)
          }
          className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:bg-indigo-400"
        >
          + Add Member
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

              <div className="mt-5 h-4 w-1/2 rounded bg-white/10" />

              <div className="mt-3 h-3 w-2/3 rounded bg-white/5" />

              <div className="mt-5 h-14 rounded bg-white/5" />

            </div>

          ))}

        </div>

      ) : users.length === 0 ? (

        <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] px-6 py-16 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-500/10 text-2xl text-indigo-300">
            ◉
          </div>

          <h2 className="mt-5 text-xl font-semibold text-white">
            No team members
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Add your first member to start assigning work.
          </p>

          <button
            onClick={() =>
              setModalOpen(true)
            }
            className="mt-6 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            Add member
          </button>

        </div>

      ) : (

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

          {users.map(
            ({
              user,
              assignedTaskCount,
            }) => (

              <UserCard
                key={user.id}
                user={user}
                assignedTaskCount={
                  assignedTaskCount
                }
                onDelete={
                  handleDeleteRequest
                }
              />

            )
          )}

        </div>
      )}


      <UserModal
        open={modalOpen}
        onClose={() =>
          setModalOpen(false)
        }
        onSubmit={handleCreate}
      />


      <ConfirmDialog
        open={
          deleteTarget !== null
        }
        title="Delete team member?"
        description={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.name}? The backend may reject this if the user still owns projects or is assigned to tasks.`
            : ""
        }
        confirmText="Delete member"
        cancelText="Keep member"
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