import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function OwnerRoute() {
  const { user } = useAuth();

  if (user && user.is_owner) {
    return <Outlet />;
  }

  return <Navigate to="/dashboard" replace />;
}