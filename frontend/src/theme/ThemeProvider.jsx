import { useEffect, useState } from "react";
import ThemeContext from "./ThemeContext";

const STORAGE_KEY = "theme";

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) return saved;

    return "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
