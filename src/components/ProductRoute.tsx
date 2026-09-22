import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: ("ADMIN" | "USER")[];
}

export default function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (
    allowedRoles &&
    user &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}