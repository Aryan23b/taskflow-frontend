import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { AuthUser } from "../types/auth";
import { loginUser } from "../services/authService";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const TOKEN_KEY = "taskflow_token";
const USER_KEY = "taskflow_user";

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem(USER_KEY);

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser) as AuthUser;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  });

  const login = async (
    email: string,
    password: string
  ) => {
    const data = await loginUser({
      email,
      password,
    });

    const authUser: AuthUser = {
      userId: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
    };

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(authUser)
    );

    setUser(authUser);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}