import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function DashboardRedirect() {
  const { user } = useAuth();

  const isAdmin = user?.is_owner || user?.role === "admin";

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/operator/dashboard" replace />;
}