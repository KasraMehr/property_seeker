import { forwardRef } from "react";
import { Moon, Sun } from "lucide-react";
import useTheme from "../theme/useTheme";

/**
 * ThemeToggle — single icon button, role-aware color
 * Keeps original single-button style, color shifts by role
 */
const ThemeToggle = forwardRef(({
  size = "md",         // sm | md
  className = "",
  ...props
}, ref) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "light";

  const sizeMap = {
    sm: "p-2.5 rounded-lg",
    md: "p-3 rounded-xl",
  };

  const iconSize = size === "sm" ? 16 : 18;

  return (
    <button
      ref={ref}
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "حالت روشن" : "حالت تاریک"}
      className={`
        ${sizeMap[size]}
        inline-flex items-center justify-center
        transition-all duration-300 ease-out cursor-pointer
        ${isDark
          ? "bg-(--role-surface) text-(--role-primary) border border-(--role-border) shadow-sm hover:shadow-md hover:bg-(--role-subtle)"
          : "bg-(--role-primary) text-white shadow-md shadow-(--role-primary)/25 hover:bg-(--role-primary-hover) hover:shadow-lg hover:shadow-(--role-primary)/30"
        }
        ${className}
      `}
      {...props}
    >
      <span className="relative flex items-center justify-center w-5 h-5">
        {/* Sun — fades/rotates out in dark */}
        <Sun
          size={iconSize}
          strokeWidth={2.5}
          className={`
            absolute transition-all duration-300
            ${isDark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"}
          `}
        />
        {/* Moon — fades/rotates in in dark */}
        <Moon
          size={iconSize}
          strokeWidth={2.5}
          className={`
            absolute transition-all duration-300
            ${isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}
          `}
        />
      </span>
    </button>
  );
});

ThemeToggle.displayName = "ThemeToggle";
export default ThemeToggle;