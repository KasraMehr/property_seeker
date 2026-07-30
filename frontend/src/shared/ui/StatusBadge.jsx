import { forwardRef } from "react";
import { getStatusConfig } from "@/constants/statusConfig";
/**
 * StatusBadge — polymorphic status indicator with icon support
 */

const StatusBadge = forwardRef(({
  status,              // status key from STATUS_MAP
  type = "generic",    // lead | property | followup | user | call | generic
  variant = "soft",    // solid | soft | outline | dot
  size = "md",         // sm | md | lg
  showIcon = false,
  className = "",
  as: Component = "span",
  ...props
}, ref) => {
  const config = getStatusConfig(status, type);

  // Base layout
  const baseStyles =
    "inline-flex items-center justify-center font-medium whitespace-nowrap shrink-0 transition-colors duration-200";
  // Size tokens
  const sizeMap = {
    sm:  "px-2 py-0.5 text-[10px] gap-1 rounded-full",
    md:  "px-2.5 py-1 text-xs gap-1.5 rounded-full",
    lg:  "px-3 py-1.5 text-sm gap-2 rounded-full",
  };
  // Dot indicator size
  const dotSizeMap = {
    sm:  "w-1 h-1",
    md:  "w-1.5 h-1.5",
    lg:  "w-2 h-2",
  };
  // Icon scale per size
  const iconSizeMap = {
    sm:  10,
    md:  12,
    lg:  14,
  };
  // Variant picks the palette class from config
  const variantStyles = {
    solid:   config.solid,
    soft:    config.soft,
    outline: config.outline,
    dot:     config.soft,
  };
  // If there's icon
  const Icon = config.icon;

  return (
    <Component
      ref={ref}
      className={`${baseStyles} ${sizeMap[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {/* Dot variant*/}
      {variant === "dot" && (
        <span className={`${dotSizeMap[size]} rounded-full ${config.dot}`} />
      )}

      {/* Optional icon from config */}
      {showIcon && Icon && (
        <Icon size={iconSizeMap[size]} strokeWidth={2.5} />
      )}

      {config.label}
    </Component>
  );
});

StatusBadge.displayName = "StatusBadge";
export default StatusBadge;