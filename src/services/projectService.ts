import api from "./api";
import type {
  Project,
  ProjectRequest,
} from "../types/project";

export async function getProjects() {
  const response =
    await api.get<Project[]>("/api/projects");

  return response.data;
}

export async function getProjectById(
  id: number
) {
  const response =
    await api.get<Project>(
      `/api/projects/${id}`
    );

  return response.data;
}

export async function createProject(
  project: ProjectRequest
) {
  const response =
    await api.post<Project>(
      "/api/projects",
      project
    );

  return response.data;
}

export async function deleteProject(
  id: number
) {
  await api.delete(
    `/api/projects/${id}`
  );
}