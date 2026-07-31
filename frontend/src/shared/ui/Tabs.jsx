import { createContext, useContext, useState, forwardRef } from "react";

const TabsContext = createContext(null);

/**
 * Tabs — compound component for role-aware tab navigation
 *
 *   <Tabs defaultValue="info">
 *     <Tabs.List>
 *       <Tabs.Trigger value="info" icon={User}>اطلاعات</Tabs.Trigger>
 *       <Tabs.Trigger value="calls" icon={Phone}>تماس‌ها</Tabs.Trigger>
 *     </Tabs.List>
 *     <Tabs.Content value="info">...</Tabs.Content>
 *     <Tabs.Content value="calls">...</Tabs.Content>
 *   </Tabs>
 */
const Tabs = forwardRef(
  (
    {
      defaultValue,
      value: controlledValue,
      onValueChange,
      children,
      className = "",
      ...props
    },
    ref,
  ) => {
    const [internal, setInternal] = useState(defaultValue);

    const active = controlledValue !== undefined ? controlledValue : internal;
    const setActive = (v) => {
      if (controlledValue === undefined) setInternal(v);
      onValueChange?.(v);
    };

    return (
      <TabsContext.Provider value={{ active, setActive }}>
        <div ref={ref} className={`w-full ${className}`} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  },
);

Tabs.displayName = "Tabs";

/* Tab List */
const List = forwardRef(
  (
    {
      children,
      variant = "underline", // "underline" | "pills"
      className = "",
      ...props
    },
    ref,
  ) => {
    const variantStyles = {
      underline: "border-b border-border gap-1",
      pills: "gap-2 p-1 bg-background rounded-xl",
    };

    return (
      <div
        ref={ref}
        role="tablist"
        className={`flex items-center ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  },
);

List.displayName = "TabsList";

/* Tab Trigger */
const Trigger = forwardRef(
  (
    { value, children, icon: Icon, disabled = false, className = "", ...props },
    ref,
  ) => {
    const ctx = useContext(TabsContext);
    const isActive = ctx?.active === value;

    const base = `
    group relative flex items-center justify-center gap-2
    text-sm font-medium whitespace-nowrap
    transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
    disabled:opacity-40 disabled:cursor-not-allowed
  `;

    const variants = {
      underline: isActive
        ? "px-4 py-2.5 text-(--role-primary)"
        : "px-4 py-2.5 text-muted hover:text-foreground hover:bg-(--role-subtle)/20 rounded-t-lg",
      pills: isActive
        ? "px-4 py-2 bg-(--role-primary) text-white shadow-sm rounded-lg"
        : "px-4 py-2 text-muted hover:text-foreground hover:bg-(--role-subtle)/20 rounded-lg",
    };

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        disabled={disabled}
        onClick={() => ctx?.setActive(value)}
        className={`${base} ${variants.underline} ${className}`}
        {...props}
      >
        {Icon && (
          <Icon
            size={16}
            strokeWidth={isActive ? 2.5 : 2}
            className="transition-transform duration-200 group-hover:scale-110"
          />
        )}
        <span>{children}</span>

        {/* Underline indicator */}
        {isActive && (
          <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-(--role-primary) rounded-t-full" />
        )}
      </button>
    );
  },
);

Trigger.displayName = "TabsTrigger";

/*  Tab Content */
const Content = forwardRef(
  ({ value, children, className = "", ...props }, ref) => {
    const ctx = useContext(TabsContext);
    const isActive = ctx?.active === value;

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        className={`mt-4 animate-in fade-in duration-200 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Content.displayName = "TabsContent";

Tabs.List = List;
Tabs.Trigger = Trigger;
Tabs.Content = Content;

export default Tabs;
