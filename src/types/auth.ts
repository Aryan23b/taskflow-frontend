export type Role = "ADMIN" | "USER";

export interface AuthResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
  role: Role;
}

export interface AuthUser {
  userId: number;
  name: string;
  email: string;
  role: Role;
}