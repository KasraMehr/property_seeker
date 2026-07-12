import { Moon, Sun } from "lucide-react";
import useTheme from "../theme/useTheme";

export default function ThemeToggle() {

  const { theme, toggleTheme } = useTheme();

  return (

    <button
      onClick={toggleTheme}
      className="cursor-pointer rounded-xl bg-primary p-3 text-white transition hover:bg-primary-hover"
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>

  );

}