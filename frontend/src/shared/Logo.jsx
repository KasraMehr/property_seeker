import { forwardRef } from "react";
import { House } from "lucide-react";
import { BRAND } from "@/config/brand";

const SIZES = {
  sm: { box: "w-8 h-8", icon: 16, text: "text-sm", gapRow: "gap-2", gapCol: "gap-1" },
  md: { box: "w-10 h-10", icon: 20, text: "text-lg", gapRow: "gap-2.5", gapCol: "gap-1.5" },
  lg: { box: "w-12 h-12", icon: 24, text: "text-2xl", gapRow: "gap-3", gapCol: "gap-2" },
};

/**
 * Logo — نشان برند «دیلان ملک»
 */
const Logo = forwardRef(function Logo(
  {
    icon: Icon = House,
    iconSrc,
    showIcon = true,
    showLabel = true,
    size = "md",
    labelPosition = "right", // left | right | bottom
    className = "",
    ...props
  },
  ref
) {
  const s = SIZES[size] ?? SIZES.md;
  const isCol = labelPosition === "bottom";

  const flex = isCol ? "flex-col" : "flex-row";
  const gap = isCol ? s.gapCol : s.gapRow;
  const labelOrder = labelPosition === "left" ? "order-first" : "";

  return (
    <div
      ref={ref}
      role="img"
      aria-label={BRAND.name}
      className={`inline-flex ${flex} items-center ${gap} select-none ${className}`}
      {...props}
    >
      {showIcon && (
        <span
          aria-hidden="true"
          className={`${s.box} relative flex shrink-0 items-center justify-center
            rounded-xl border border-(--role-primary)/20 bg-(--role-primary)/10`}
        >
          {iconSrc ? (
            <img
              src={iconSrc}
              alt=""
              className="h-3/5 w-3/5 object-contain"
              draggable={false}
            />
          ) : (
            <Icon size={s.icon} strokeWidth={2} className="text-(--role-primary)" />
          )}
        </span>
      )}

      {showLabel && (
        <span
          className={`${s.text} ${labelOrder} font-bold leading-none tracking-tight whitespace-nowrap`}
        >
          <span className="text-(--role-primary)">دیلان</span>
          <span className="text-foreground"> ملک</span>
        </span>
      )}
    </div>
  );
});

export default Logo;
