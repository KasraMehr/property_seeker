import { forwardRef } from "react";

/**
 * IconBox — role-aware icon container with optional label
 * Used in: feature cards, empty states, stat cards, landing sections
 */
const IconBox = forwardRef(({
  icon: Icon,
  iconSrc,
  label,
  iconSize = 20,
  boxSize = "md",     // sm | md | lg | xl
  variant = "filled", // filled | ghost | outline
  labelPosition = "bottom",
  labelColor,
  className = "",
  ...props
}, ref) => {
  // Box dimension scale
  const boxMap = {
    sm:  "w-9 h-9 rounded-lg",
    md:  "w-11 h-11 rounded-xl",
    lg:  "w-14 h-14 rounded-2xl",
    xl:  "w-16 h-16 rounded-2xl",
  };
  // Icon scale inside box
  const iconMap = {
    sm:  16,
    md:  20,
    lg:  24,
    xl:  28,
  };
  const sz = boxMap[boxSize] || boxMap.md;
  const isz = iconSize || iconMap[boxSize] || iconMap.md;

  // Variant styles
  const variantStyles = {
    filled: `
      bg-(--role-primary)/10 
      border border-(--role-primary)/15
      shadow-[0_4px_20px_-8px_var(--role-primary)]
    `,
    ghost: `
      bg-transparent
      border border-border
      hover:bg-(--role-subtle)/30
    `,
    outline: `
      bg-transparent
      border-2 border-(--role-primary)/30
      shadow-none
    `,
  };

  // Label color fallback
  const lblColor = labelColor || "text-foreground";

  // Layout direction
  const layout = {
    top:    "flex-col-reverse items-center gap-2",
    bottom: "flex-col items-center gap-2",
    left:   "flex-row items-center gap-3",
    right:  "flex-row-reverse items-center gap-3",
  }[labelPosition] || "flex-col items-center gap-2";

  // Label size by box size
  const labelSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base font-semibold",
    xl: "text-lg font-bold",
  }[boxSize] || "text-sm";

  const box = (
    <span
      className={`
        ${sz}
        relative inline-flex items-center justify-center shrink-0
        ${variantStyles[variant]}
        transition-all duration-300 ease-out
        group-hover/iconbox:scale-105
      `}
    >
      {/* Inner top highlight */}
      <span className="absolute inset-x-2 top-1 h-px rounded-full bg-white/20" />

      {/* Icon or Image */}
      {iconSrc ? (
        <img
          src={iconSrc}
          alt=""
          className="w-1/2 h-1/2 object-contain opacity-90"
          draggable={false}
        />
      ) : Icon ? (
        <Icon
          size={isz}
          strokeWidth={2}
          className="text-(--role-primary) transition-transform duration-300 group-hover/iconbox:scale-110"
        />
      ) : null}
    </span>
  );

  return (
    <div
      ref={ref}
      className={`group/iconbox inline-flex ${layout} ${className}`}
      {...props}
    >
      {box}

      {label && (
        <span className={`${labelSize} ${lblColor} leading-none`}>
          {label}
        </span>
      )}
    </div>
  );
});

IconBox.displayName = "IconBox";
export default IconBox;