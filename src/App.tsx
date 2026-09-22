import {
  BrowserRouter,
  Routes,
  Navigate,
  Route,
} from "react-router-dom";

import AppLayout from "./layouts/AppLayout";

import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Projects from "./pages/Projects";
import Users from "./pages/Users";
import Login from "./pages/Login";

import MyTasks from "./pages/MyTasks";
import UserTasks from "./pages/UserTasks";
import ProjectTasks from "./pages/ProjectTasks";

import ProtectedRoute from "./components/ProtectedRoute.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC
        ========================== */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* =========================
            AUTHENTICATED
        ========================== */}

        <Route element={<ProtectedRoute />}>

          <Route element={<AppLayout />}>

            {/* ADMIN + USER */}
            <Route
              path="/"
              element={<Dashboard />}
            />

            {/* USER + ADMIN */}
            <Route
              path="/my-tasks"
              element={<MyTasks />}
            />


            {/* =========================
                ADMIN ONLY
            ========================== */}

            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["ADMIN"]}
                />
              }
            >

              <Route
                path="/users"
                element={<Users />}
              />

              <Route
                path="/users/:id/tasks"
                element={<UserTasks />}
              />

              <Route
                path="/projects"
                element={<Projects />}
              />

              <Route
                path="/projects/:id/tasks"
                element={<ProjectTasks />}
              />

              <Route
                path="/tasks"
                element={<Tasks />}
              />

            </Route>

          </Route>

        </Route>


        {/* =========================
            FALLBACK
        ========================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}