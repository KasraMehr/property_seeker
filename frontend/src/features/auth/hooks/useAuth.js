// Custom hook for accessing auth store
import useAuthStore from "@/store/useAuthStore";

export default function useAuth() {
  const { user, loading, isAuthenticated, login, logout, checkSession } =
    useAuthStore();
  return { user, loading, isAuthenticated, login, logout, checkSession };
}
