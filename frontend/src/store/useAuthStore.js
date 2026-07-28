import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '@/features/auth/services/authService';

const useAuthStore = create(
  persist(
    (set, get) => ({
      //State 
      user: null,
      isAuthenticated: false,
      loading: true,

      //Check Session 
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
          console.error('Session check failed:', error);
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ loading: false });
        }
      },

      //Login
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
            error: 'خطا در ورود',
          };
        }
      },

      //Logout 
      logout: async () => {
        try {
          await authService.logout();
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;