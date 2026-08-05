import { forwardRef } from "react";
import { getRoleConfig } from "@/constants/roleConfig";

/**
 * RoleBadge — role indicator with icon and color
 */
const RoleBadge = forwardRef(
  (
    {
      role,
      variant = "soft", // solid | soft | outline | dot
      size = "md",
      showIcon = true,
      className = "",
      ...props
    },
    ref,
  ) => {
    const {
      label,
      icon: Icon,
      solid,
      soft,
      outline,
      dot,
    } = getRoleConfig(role);

    const base =
      "inline-flex items-center justify-center font-medium whitespace-nowrap shrink-0 transition-colors duration-200";

    const sizeMap = {
      sm: "px-2 py-0.5 text-[10px] gap-1 rounded-full",
      md: "px-2.5 py-1 text-xs gap-1.5 rounded-full",
      lg: "px-3 py-1.5 text-sm gap-2 rounded-full",
    };

    const iconSize = {
      sm: 10,
      md: 12,
      lg: 14,
    };

    const variantMap = {
      solid,
      soft,
      outline,
      dot: soft,
    };

    return (
      <span
        ref={ref}
        className={`${base} ${sizeMap[size]} ${variantMap[variant] ?? soft} ${className}`}
        {...props}
      >
        {variant === "dot" && (
          <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        )}

        {showIcon && Icon && <Icon size={iconSize[size]} strokeWidth={2.2} />}

        {label}
      </span>
    );
  },
);

RoleBadge.displayName = "RoleBadge";

export default RoleBadge;
