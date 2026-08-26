import { useMemo } from "react";

export default function PageTabs({
  items = [],
  value,
  onChange,
  className = "",
}) {
  const activeTab = useMemo(
    () => items.find((item) => item.id === value),
    [items, value],
  );

  return (
    <div
      className={`flex items-center gap-1 overflow-x-auto border-b border-border ${className}`}
    >
      {items.map((item) => {
        const isActive = activeTab?.id === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange?.(item.id)}
            className={`
              relative flex shrink-0 items-center gap-2
              px-4 py-3 text-sm font-medium cursor-pointer
              transition-colors duration-200
              ${
                isActive
                  ? "text-(--role-primary)"
                  : "text-muted hover:text-foreground"
              }
            `}
          >
            <span>{item.label}</span>

            {item.badge && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-(--role-primary)/10 px-1 text-[11px] font-semibold text-(--role-primary)">
                {item.badge}
              </span>
            )}

            {isActive && (
              <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-(--role-primary)" />
            )}
          </button>
        );
      })}
    </div>
  );
}