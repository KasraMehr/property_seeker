import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";

/**
 * address gate only for checking in frontend urls
 * if it's owner -> /owner/
 * else -> /operator/ (any other roles)
 * 
 * can be generic later for /role/
 */
export default function RoleRoute({ allow }) {
  const isOwner = useAuthStore((s) => {
    const user = s.user;
    return !!(user?.is_owner);
  });
  const location = useLocation();

  // admin + superuser only
  if (allow === "owner" && !isOwner) {
    return <Navigate to="/operator/dashboard" replace state={{ from: location }} />;
  }

  // logged in user except owner
  if (allow === "operator" && isOwner) {
    return <Navigate to="/owner/dashboard" replace state={{ from: location }} />;
  }

  return <Outlet />;
}