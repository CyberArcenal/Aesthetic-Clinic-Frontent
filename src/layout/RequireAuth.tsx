import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authStore } from "../stores/authStore";

interface RequireAuthProps {
  allowedRoles?: string[]; // e.g., ["Admin", "Staff"] or ["Client"]
}

const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
  const location = useLocation();
  const isAuthenticated = authStore.isAuthenticated();
  const user = authStore.getUser();
  const userRoles = user?.roles || [];

  const hasRequiredRole = allowedRoles
    ? allowedRoles.some((role) => userRoles.includes(role))
    : true;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasRequiredRole) {
    // Redirect to client dashboard if client tries to access admin, or vice versa
    if (userRoles.includes("Client")) {
      return <Navigate to="/client/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;