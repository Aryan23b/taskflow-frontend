import api from "./api";

import type {
  PageResponse,
  TaskResponse,
  TaskRequest,
  TaskPriority,
  TaskStatus,
} from "../types/task";


export const updateMyTaskStatus = async (
  taskId: number,
  status: TaskStatus
): Promise<TaskResponse> => {
  const response = await api.patch<TaskResponse>(
    `/api/tasks/${taskId}/status`,
    {
      status,
    }
  );

  return response.data;
};



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

export const getTasks = async (params?: {
  status?: string;
  priority?: string;
  projectId?: number;
  assignedUserId?: number;
  title?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: string;
}) => {
  const response = await api.get<PageResponse<TaskResponse>>(
    "/api/tasks",
    { params }
  );

  return response.data;
};

export async function getTaskById(
  id: number
) {
  const response =
    await api.get<TaskResponse>(
      `/api/tasks/${id}`
    );

  return response.data;
}

export async function createTask(
  task: TaskRequest
) {
  const response =
    await api.post<TaskResponse>(
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
    await api.put<TaskResponse>(
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

export const getTasksByUser = async (
  userId: number
): Promise<TaskResponse[]> => {
  const response = await api.get<TaskResponse[]>(
    `/api/users/${userId}/tasks`
  );

  return response.data;
};

export const getTasksByProject = async (
  projectId: number
): Promise<TaskResponse[]> => {
  const response = await api.get<TaskResponse[]>(
    `/api/projects/${projectId}/tasks`
  );

  return response.data;
};

export const getMyTasks = async (): Promise<TaskResponse[]> => {
  const response = await api.get<TaskResponse[]>(
    "/api/tasks/my"
  );

  return response.data;
};