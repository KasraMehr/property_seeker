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
      group relative flex h-10 w-full items-center justify-start
      gap-2 overflow-hidden rounded-xl px-3
      transition-all duration-200
      ${
        isActive
          ? "bg-(--role-subtle)/10 text-(--role-primary)"
          : "text-muted hover:bg-(--role-subtle)/8"
      }
    `}
      >
        {/* Hover background */}
        <span
          className="
        absolute inset-y-0 right-0 w-0
        rounded-xl
        bg-(--role-subtle)/10
        transition-all duration-300 ease-out
        group-hover:w-full
      "
        />

        {/* Icon - Right */}
        <div
          className={`
        relative z-10 flex h-8 w-8 shrink-0
        items-center justify-center rounded-lg
        transition-all duration-200
        ${
          isActive
            ? "bg-(--role-primary) text-white shadow-sm"
            : "bg-transparent text-muted group-hover:bg-(--role-subtle)/15 group-hover:text-foreground"
        }
      `}
        >
          {Icon && <Icon size={17} strokeWidth={2} />}

          {badge && (
            <span
              className="
            absolute -left-1 -top-1
            flex h-5 min-w-5 items-center justify-center
            rounded-full bg-danger px-1
            text-[10px] font-bold text-white
            shadow-sm
          "
            >
              {badge}
            </span>
          )}
        </div>

        {/* Label - Next to icon */}
        <span
          className={`
        relative z-10
        text-right text-[12px] leading-4
        whitespace-nowrap
        transition-all duration-200
        ${
          isActive
            ? "font-semibold text-(--role-primary)"
            : "font-medium text-muted group-hover:text-foreground"
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
