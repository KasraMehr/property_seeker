import { Navigate } from "react-router-dom";
import useAuth from "@/features/auth/hooks/useAuth";

export default function DashboardRedirect() {
  const { user } = useAuth();

  const isAdmin = user?.is_owner || user?.role.name === "ADMIN";

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/operator/dashboard" replace />;
}