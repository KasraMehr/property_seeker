import { Link, useLocation } from "react-router-dom";
import { forwardRef } from "react";

/**
 * NavigationItem — custom-designed nav link with unique active/hover states
 * Works for both dashboard sidebar & landing page anchors
 */
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
      className = "",
    },
    ref,
  ) => {
    const location = useLocation();
    const targetPath = to || path || href;
    const isActive =
      type === "route" && targetPath && location.pathname === targetPath;

    // Base layout
    const base = `
    group relative flex items-center gap-3 
      rounded-xl pr-5 pl-4 py-3 text-sm
      transition-colors duration-200 ease-out
      will-change-transform
      overflow-hidden
  `;
    // Active state
    const active = isActive
      ? `
        bg-gradient-to-l from-(--role-subtle)/60 via-(--role-subtle)/15 to-transparent
        text-(--role-primary) font-semibold
      `
      : `
        text-muted hover:text-foreground
        hover:bg-(--role-subtle)/10
      `;

    // Right-side indicator pill
    const indicator = isActive && (
      <span
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2
                 h-7 w-0.75 rounded-l-full bg-(--role-primary)
                 shadow-[0_0_10px_2px_var(--role-primary)]"
        aria-hidden="true"
      />
    );
    // Icon container
    const iconWrap = Icon && (
      <span
        className={`
        relative flex items-center justify-center 
        w-9 h-9 rounded-lg transition-all duration-300
        ${
          isActive
            ? "bg-(--role-primary)/15 text-(--role-primary)"
            : "bg-transparent text-muted group-hover:bg-(--role-subtle)/25 group-hover:text-foreground"
        }
      `}
      >
        <Icon
          size={18}
          strokeWidth={isActive ? 2.5 : 1.5}
          className="transition-transform duration-300 group-hover:scale-110"
        />
        {/* Optional notification badge */}
        {badge && (
          <span
            className="absolute -top-0.5 -left-0.5 min-w-4 h-4 px-1 
                     flex items-center justify-center 
                     text-[10px] font-bold bg-(--role-primary) text-white rounded-full
                     shadow-sm"
          >
            {badge}
          </span>
        )}
      </span>
    );

    // Label + optional active pulse dot
    const labelNode = (
      <>
        <span className="relative z-10 flex-1 tracking-tight">{label}</span>
        {/* {isActive && (
          <span className="relative z-10 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-(--role-primary) animate-pulse" />
          </span>
        )} */}
      </>
    );
    const children = (
      <>
        {indicator}
        {iconWrap}
        {labelNode}
      </>
    );

    // Route link
    if (type === "route" || to || path) {
      return (
        <Link
          ref={ref}
          to={targetPath || "#"}
          onClick={onClick}
          className={`${base} ${active} ${className}`}
        >
          {children}
        </Link>
      );
    }

    // Anchor scroll (landing page)
    const handleScroll = (e) => {
      e.preventDefault();
      const el = document.querySelector(href || path);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
      onClick?.();
    };

    return (
      <a
        ref={ref}
        href={href || path || "#"}
        onClick={handleScroll}
        className={`${base} ${active} ${className}`}
      >
        {children}
      </a>
    );
  },
);

NavigationItem.displayName = "NavigationItem";
export default NavigationItem;
