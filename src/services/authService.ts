import api from "./api";
import type { AuthResponse } from "../types/auth";

interface LoginRequest {
  email: string;
  password: string;
}

export const loginUser = async (
  credentials: LoginRequest
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    "/api/auth/login",
    credentials
  );

  return response.data;
};