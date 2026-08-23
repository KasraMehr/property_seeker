import { Navigate } from "react-router-dom";
import useAuth from "@/features/auth/hooks/useAuth";

export default function DashboardRedirect() {
  const { user, loading, isAuthenticated } = useAuth();

  console.log("DashboardRedirect:", {
    user,
    loading,
    isAuthenticated,
    isOwner: user?.is_owner,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.is_owner === true) {
    return <Navigate to="/owner/dashboard" replace />;
  }

  return <Navigate to="/operator/dashboard" replace />;
}