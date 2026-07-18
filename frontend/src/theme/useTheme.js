// custom hook to access theme store
import useThemeStore from '../store/useThemeStore';

export default function useTheme() {
  const { theme, setTheme, toggleTheme, initializeTheme } = useThemeStore();
  return { theme, setTheme, toggleTheme, initializeTheme };
}