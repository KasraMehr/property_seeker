import { Link, useLocation } from "react-router-dom";
import { forwardRef } from "react";

const NavigationItem = forwardRef(
  (
    {
      label,
      href,
      to,
      path,
      icon: Icon,
      type = "route",
      onClick,
      badge,
      scrollOffset = 100,
      className = "",
    },
    ref,
  ) => {
    const location = useLocation();

    const targetPath = to || path || href;

    const isActive =
      type === "route" && targetPath && location.pathname === targetPath;

    const children = (
      <div
        className={`
          group relative flex h-10 w-full items-center justify-between
          overflow-hidden rounded-xl px-4
          transition-colors duration-200
          ${isActive ? "text-(--role-primary)" : "text-muted"}
        `}
      >
        {/* Hover background - right to left */}
        <span
          className="
            absolute inset-0
            translate-x-full
            rounded-xl
            bg-(--role-subtle)/10
            transition-transform duration-300 ease-out
            group-hover:translate-x-0
          "
        />

        {/* Icon - Right */}
        <div
          className={`
            relative z-10 flex h-10 w-10 shrink-0
            items-center justify-center rounded-xl
            transition-all duration-200
            ${
              isActive
                ? "bg-(--role-primary) text-white shadow-md"
                : "bg-(--role-subtle)/10 text-muted group-hover:bg-(--role-subtle)/25 group-hover:text-foreground"
            }
          `}
        >
          {Icon && <Icon size={18} strokeWidth={2} />}

          {badge && (
            <span className="absolute -left-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
              {badge}
            </span>
          )}
        </div>

        {/* Label - Left */}
        <span
          className={`
            relative z-10 text-right text-[11px] leading-4
            transition-colors duration-200
            ${
              isActive
                ? "font-semibold text-(--role-primary)"
                : "text-muted group-hover:text-foreground"
            }
          `}
        >
          {label}
        </span>
      </div>
    );

    if (type === "route" || to || (path && !path.startsWith("#"))) {
      return (
        <Link
          ref={ref}
          to={targetPath || "#"}
          onClick={onClick}
          className={`block w-full ${className}`}
        >
          {children}
        </Link>
      );
    }

    const handleScroll = (e) => {
      e.preventDefault();

      const selector = href || path;

      if (!selector) return;

      const el = document.querySelector(selector);

      if (el) {
        const top =
          el.getBoundingClientRect().top + window.scrollY - scrollOffset;

        window.scrollTo({
          top,
          behavior: "smooth",
        });
      }

      onClick?.();
    };

    return (
      <a
        ref={ref}
        href={href || path || "#"}
        onClick={handleScroll}
        className={`block w-full ${className}`}
      >
        {children}
      </a>
    );
  },
);

NavigationItem.displayName = "NavigationItem";

export default NavigationItem;
