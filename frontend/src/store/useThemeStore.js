import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const STORAGE_KEY = 'theme';

const useThemeStore = create(
  persist(
    (set, get) => ({
      // State
      theme: 'light',

      // Actions
      setTheme: (newTheme) => {
        set({ theme: newTheme });
        document.documentElement.setAttribute('data-theme', newTheme);
      },

      toggleTheme: () => {
        const current = get().theme;
        const newTheme = current === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        document.documentElement.setAttribute('data-theme', newTheme);
      },

      initializeTheme: () => {
        const theme = get().theme;
        document.documentElement.setAttribute('data-theme', theme);
      },
    }),
    {
      name: STORAGE_KEY,
    }
  )
);

export default useThemeStore;