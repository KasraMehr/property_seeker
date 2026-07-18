// Redirects authenticated users away from public routes (e.g., login)

import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function PublicRoute() {
  const { isAuthenticated} = useAuth();

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render child routes if not authenticated
  return <Outlet />;
}