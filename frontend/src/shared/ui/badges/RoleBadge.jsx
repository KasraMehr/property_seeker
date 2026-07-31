import { forwardRef } from "react";
import { getRoleConfig } from "../../../constants/roleConfig";

/**
 * RoleBadge — role indicator with icon and color
 */
const RoleBadge = forwardRef(({
  role,              // "admin" | "operator" | "owner" 
  variant = "soft",  // solid | soft | outline | dot
  size = "md",
  showIcon = true,
  className = "",
  ...props
}, ref) => {
  const config = getRoleConfig(role);

  const base = "inline-flex items-center justify-center font-medium whitespace-nowrap shrink-0 transition-colors duration-200";
  const sizeMap = {
    sm: "px-2 py-0.5 text-[10px] gap-1 rounded-full",
    md: "px-2.5 py-1 text-xs gap-1.5 rounded-full",
    lg: "px-3 py-1.5 text-sm gap-2 rounded-full",
  };
  const variantMap = {
    solid: config.solid,
    soft: config.soft,
    outline: config.outline,
    dot: config.soft,
  };

  const Icon = config.icon;

  return (
    <span ref={ref} className={`${base} ${sizeMap[size]} ${variantMap[variant]} ${className}`} {...props}>
      {variant === "dot" && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
      {showIcon && Icon && <Icon size={12} strokeWidth={2.5} />}
      {config.label}
    </span>
  );
});

RoleBadge.displayName = "RoleBadge";
export default RoleBadge;