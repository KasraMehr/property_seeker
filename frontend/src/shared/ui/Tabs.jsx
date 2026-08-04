import { createContext, useContext, useState, forwardRef } from "react";

const TabsContext = createContext(null);

const Tabs = forwardRef(
  (
    {
      defaultValue,
      value,
      onValueChange,
      variant = "underline",
      orientation = "horizontal",
      keepMounted = false,
      children,
      className = "",
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);

    const activeValue = value !== undefined ? value : internalValue;

    const setValue = (next) => {
      if (value === undefined) setInternalValue(next);
      onValueChange?.(next);
    };

    return (
      <TabsContext.Provider
        value={{
          activeValue,
          setValue,
          variant,
          orientation,
          keepMounted,
        }}
      >
        <div ref={ref} className={`w-full ${className}`} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  },
);

Tabs.displayName = "Tabs";

// ---------------- LIST ----------------

const List = forwardRef(({ children, className = "", ...props }, ref) => {
  const { variant, orientation } = useContext(TabsContext);

  return (
    <div
      ref={ref}
      role="tablist"
      className={`
          flex
          ${orientation === "vertical" ? "flex-col" : "items-center"}
          ${
            variant === "underline"
              ? "border-b border-border gap-1"
              : "gap-2 p-1 bg-background rounded-xl"
          }
          ${className}
        `}
      {...props}
    >
      {children}
    </div>
  );
});

List.displayName = "Tabs.List";

// ---------------- TRIGGER ----------------

const Trigger = forwardRef(
  (
    {
      value,
      children,
      icon: Icon,
      badge,
      disabled = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    const { activeValue, setValue, variant } = useContext(TabsContext);

    const active = activeValue === value;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={active}
        disabled={disabled}
        onClick={() => !disabled && setValue(value)}
        className={`
          group relative
          flex items-center justify-center gap-2
          text-sm font-medium whitespace-nowrap
          transition-all duration-200
          disabled:opacity-40 disabled:cursor-not-allowed

          ${
            variant === "underline"
              ? active
                ? "px-4 py-2.5 text-(--role-primary)"
                : "px-4 py-2.5 text-muted hover:text-foreground hover:bg-(--role-subtle)/20 rounded-t-lg"
              : active
                ? "px-4 py-2 rounded-lg bg-(--role-primary) text-white shadow-sm"
                : "px-4 py-2 rounded-lg text-muted hover:text-foreground hover:bg-(--role-subtle)/20"
          }

          ${className}
        `}
        {...props}
      >
        {Icon && (
          <Icon
            size={16}
            strokeWidth={active ? 2.5 : 2}
            className="transition-transform group-hover:scale-110"
          />
        )}

        <span>{children}</span>

        {badge !== undefined && (
          <span
            className={`
              min-w-5 h-5 px-1 rounded-full
              flex items-center justify-center
              text-[11px] font-semibold

              ${
                active
                  ? "bg-white/20 text-white"
                  : "bg-(--role-primary)/10 text-(--role-primary)"
              }
            `}
          >
            {badge}
          </span>
        )}

        {variant === "underline" && active && (
          <span
            className="
              absolute bottom-0 left-2 right-2
              h-0.5 rounded-full
              bg-(--role-primary)
            "
          />
        )}
      </button>
    );
  },
);

Trigger.displayName = "Tabs.Trigger";

// ---------------- CONTENT ----------------

const Content = forwardRef(
  ({ value, children, className = "", ...props }, ref) => {
    const { activeValue, keepMounted } = useContext(TabsContext);

    const active = activeValue === value;

    if (!active && !keepMounted) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        hidden={!active}
        className={`
          mt-4
          animate-in fade-in duration-200
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Content.displayName = "Tabs.Content";

// Attach
Tabs.List = List;
Tabs.Trigger = Trigger;
Tabs.Content = Content;

export default Tabs;
