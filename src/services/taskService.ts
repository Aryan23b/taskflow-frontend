import api from "./api";

import type {
  PageResponse,
  Task,
  TaskRequest,
  TaskPriority,
  TaskStatus,
} from "../types/task";

export interface TaskQueryParams {
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: number;
  assignedUserId?: number;
  title?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: "asc" | "desc";
}

export async function getTasks(
  params?: TaskQueryParams
) {
  const response =
    await api.get<PageResponse<Task>>(
      "/api/tasks",
      {
        params,
      }
    );

  return response.data;
}

export async function getTaskById(
  id: number
) {
  const response =
    await api.get<Task>(
      `/api/tasks/${id}`
    );

  return response.data;
}

export async function createTask(
  task: TaskRequest
) {
  const response =
    await api.post<Task>(
      "/api/tasks",
      task
    );

  return response.data;
}

export async function updateTask(
  id: number,
  task: TaskRequest
) {
  const response =
    await api.put<Task>(
      `/api/tasks/${id}`,
      task
    );

  return response.data;
}

export async function deleteTask(
  id: number
) {
  await api.delete(
    `/api/tasks/${id}`
  );
}