import { Navigate } from "react-router-dom";
import useAuth from "@/features/auth/hooks/useAuth";

export default function DashboardRedirect() {
  const { user } = useAuth();

   if (!user) {
    return null;
  }

  const isAdmin = Boolean(user.is_owner);

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/operator/dashboard" replace />;
}