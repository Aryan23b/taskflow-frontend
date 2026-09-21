import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router";


import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Projects from "./pages/Projects";
import Users from "./pages/Users";



export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route element={<AppLayout />}>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/tasks"
            element={<Tasks />}
          />

          <Route
            path="/projects"
            element={<Projects />}
          />

          <Route
            path="/users"
            element={<Users />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}