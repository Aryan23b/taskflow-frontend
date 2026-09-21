import api from "./api";
import type {
  User,
  UserRequest,
} from "../types/user";

export async function getUsers() {
  const response =
    await api.get<User[]>("/api/users");

  return response.data;
}

export async function getUserById(
  id: number
) {
  const response =
    await api.get<User>(
      `/api/users/${id}`
    );

  return response.data;
}

export async function createUser(
  user: UserRequest
) {
  const response =
    await api.post<User>(
      "/api/users",
      user
    );

  return response.data;
}

export async function deleteUser(
  id: number
) {
  await api.delete(
    `/api/users/${id}`
  );
}