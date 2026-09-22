import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../utils/apiError";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from =
    (location.state as { from?: Location })?.from?.pathname ||
    "/";

  const handleSubmit = async (
    event: React.SubmitEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      await login(
        email.trim(),
        password
      );

      navigate(from, { replace: true });

    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "Invalid email or password."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            TaskFlow
          </h1>

          <p className="mt-2 text-slate-400">
            Sign in to manage your tasks and projects
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

          <h2 className="text-xl font-semibold text-white">
            Welcome back
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Enter your credentials to continue.
          </p>

          {error && (
            <div className="mt-5 rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}