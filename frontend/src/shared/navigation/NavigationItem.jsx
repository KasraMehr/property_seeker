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

    const base = `
    group relative flex items-center gap-3 
    rounded-xl pr-5 pl-4 py-3 text-sm
    transition-colors duration-200 ease-out
    will-change-transform
    overflow-hidden
  `;

    const active = isActive
      ? `bg-gradient-to-l from-(--role-subtle)/60 via-(--role-subtle)/15 to-transparent text-(--role-primary) font-semibold`
      : `text-muted hover:text-foreground hover:bg-(--role-subtle)/10`;

    const indicator = isActive && (
      <span
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2
                 h-7 w-0.75 rounded-l-full bg-(--role-primary)
                 shadow-[0_0_10px_2px_var(--role-primary)]"
        aria-hidden="true"
      />
    );

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
        {badge && (
          <span
            className="absolute -top-0.5 -left-0.5 min-w-4 h-4 px-1 
                     flex items-center justify-center 
                     text-[10px] font-bold bg-(--role-primary) text-white rounded-full shadow-sm"
          >
            {badge}
          </span>
        )}
      </span>
    );

    const labelNode = (
      <span className="relative z-10 flex-1 tracking-tight">{label}</span>
    );

    const children = (
      <>
        {indicator}
        {iconWrap}
        {labelNode}
      </>
    );

    // Route link
    if (type === "route" || to || (path && !path.startsWith("#"))) {
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

    // Anchor scroll with offset
    const handleScroll = (e) => {
      e.preventDefault();
      const selector = href || path;
      if (!selector) return;
      const el = document.querySelector(selector);
      if (el) {
        const top =
          el.getBoundingClientRect().top + window.scrollY - scrollOffset;
        window.scrollTo({ top, behavior: "smooth" });
      }
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
