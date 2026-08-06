import { forwardRef } from "react";

/**
 * StatusBadge
 *
 * Receives a fully built status config.
 * It does NOT know anything about Listing,
 * Property, User, Call...
 */

const StatusBadge = forwardRef(
  (
    {
      config,
      variant = "soft",
      size = "md",
      showIcon = true,
      className = "",
      as: Component = "span",
      ...props
    },
    ref,
  ) => {
    const { label, icon: Icon, solid, soft, outline, dot } = config;

    const base =
      "inline-flex items-center justify-center font-medium whitespace-nowrap shrink-0 transition-colors duration-200";

    const sizeMap = {
      sm: "px-2 py-0.5 text-[10px] gap-1 rounded-full",
      md: "px-2.5 py-1 text-xs gap-1.5 rounded-full",
      lg: "px-3 py-1.5 text-sm gap-2 rounded-full",
    };

    const variantMap = {
      solid,
      soft,
      outline,
      dot: soft,
    };

    const dotSize = {
      sm: "w-1 h-1",
      md: "w-1.5 h-1.5",
      lg: "w-2 h-2",
    };

    const iconSize = {
      sm: 10,
      md: 12,
      lg: 14,
    };

    return (
      <Component
        ref={ref}
        className={`${base} ${sizeMap[size]} ${variantMap[variant] ?? soft} ${className}`}
        {...props}
      >
        {variant === "dot" && (
          <span className={`${dotSize[size]} rounded-full ${dot}`} />
        )}

        {showIcon && Icon && <Icon size={iconSize[size]} strokeWidth={2.5} />}

        {label}
      </Component>
    );
  },
);

StatusBadge.displayName = "StatusBadge";

export default StatusBadge;
