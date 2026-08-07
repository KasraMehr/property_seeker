import { create } from "zustand";
import { persist } from "zustand/middleware";
import authService from "@/features/auth/services/authService";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      loading: true,

      // Check Session
      checkSession: async () => {
        set({ loading: true });
        try {
          const response = await authService.getCurrentUser();
          if (response.authenticated) {
            set({ user: response.user, isAuthenticated: true });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        } catch (error) {
          console.error("Session check failed:", error);
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ loading: false });
        }
      },

      // Login
      login: async (phone, password) => {
        try {
          const response = await authService.login(phone, password);

          if (!response.success) {
            return response;
          }

          // Get current user data after setting cookies
          const current = await authService.getCurrentUser();

          if (current.authenticated) {
            set({ user: current.user, isAuthenticated: true });
          }

          return {
            success: true,
            user: current.user,
          };
        } catch (error) {
          return {
            success: false,
            error: "خطا در ورود",
          };
        }
      },

      // Logout
      logout: async () => {
        try {
          await authService.logout();
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },

      // Helper methods for permissions

      /**
       * How to use
       * const isOwner = useAuthStore((state) => state.isOwner());
       * const hasPermission = useAuthStore((state) => state.hasPermission('delete_property'));
       */

      // Check for admin
      isOwner: () => {
        const user = get().user;
        return Boolean(user?.is_owner);
      },

      // Get the list of roles
      getRoleNames: () => {
        const user = get().user;
        if (user?.is_owner) return "مالک آژانس";
        if (!user?.role || !Array.isArray(user.role)) return "مشاور";
        return user.role.map((r) => r.name).join("، ");
      },

      // check permission
      hasPermission: (permissionCode) => {
        const user = get().user;
        // both has complete access
        if (user?.is_owner || user?.is_superuser) return true;
        if (!user?.role || !Array.isArray(user.role)) return false;
        return user.role.some((r) => r.permissions?.includes(permissionCode));
      },

      // check for at least one permission of all
      hasAnyPermission: (codes = []) => {
        const user = get().user;
        if (user?.is_owner || user?.is_superuser) return true;
        if (!user?.role || !Array.isArray(user.role)) return false;
        return codes.some((code) =>
          user.role.some((r) => r.permissions?.includes(code)),
        );
      },

      // check to have all permissions exactly
      hasAllPermissions: (codes = []) => {
        const user = get().user;
        if (user?.is_owner || user?.is_superuser) return true;
        if (!user?.role || !Array.isArray(user.role)) return false;
        return codes.every((code) =>
          user.role.some((r) => r.permissions?.includes(code)),
        );
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    },
  ),
);

export default useAuthStore;
