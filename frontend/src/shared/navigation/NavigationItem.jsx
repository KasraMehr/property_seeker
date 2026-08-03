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
      type === "route" &&
      targetPath &&
      location.pathname === targetPath;

    const children = (
      <>
        <div
          className={`
            relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200
            ${
              isActive
                ? "bg-(--role-primary) text-white shadow-md"
                : "bg-(--role-subtle)/10 text-muted hover:bg-(--role-subtle)/25 hover:text-foreground"
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

        <span
          className={`
            mt-2 text-center text-[11px] leading-4 transition-colors
            ${isActive ? "font-semibold text-(--role-primary)" : "text-muted"}
          `}
        >
          {label}
        </span>
      </>
    );

    if (type === "route" || to || (path && !path.startsWith("#"))) {
      return (
        <Link
          ref={ref}
          to={targetPath || "#"}
          onClick={onClick}
          className={`flex flex-col items-center ${className}`}
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
          el.getBoundingClientRect().top +
          window.scrollY -
          scrollOffset;

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
        className={`flex flex-col items-center ${className}`}
      >
        {children}
      </a>
    );
  },
);

NavigationItem.displayName = "NavigationItem";

export default NavigationItem;