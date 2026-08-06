import { forwardRef } from "react";
import { House } from "lucide-react";

/**
 * Logo — "ملک جو" brand mark, supports custom icon or PNG
*/
const Logo = forwardRef(({
  icon: Icon = House,
  iconSrc,         //path to PNG/SVG image
  showLabel = true,
  size = "md",      // sm | md | lg
  labelPosition = "left",  // "left" | "right" | "bottom"
  className = "",
  ...props
}, ref) => {
  const sizeMap = {
    sm:  {
      box: "w-8 h-8",
      icon: 16,
      text: "text-sm",
      gap: labelPosition === "bottom" ? "gap-1" : "gap-2",
      flex: labelPosition === "bottom" ? "flex-col" : "flex-row",
    },
    md:  {
      box: "w-10 h-10",
      icon: 20,
      text: "text-lg",
      gap: labelPosition === "bottom" ? "gap-1.5" : "gap-2.5",
      flex: labelPosition === "bottom" ? "flex-col" : "flex-row",
    },
    lg:  {
      box: "w-12 h-12",
      icon: 24,
      text: "text-2xl",
      gap: labelPosition === "bottom" ? "gap-2" : "gap-3",
      flex: labelPosition === "bottom" ? "flex-col" : "flex-row",
    },
  };

  const s = sizeMap[size] || sizeMap.md;

  return (
    <div
      ref={ref}
      className={`inline-flex ${s.flex} items-center ${s.gap} select-none ${className}`}
      {...props}
    >
      {/* Icon / Image */}
      {/* <span
        className={`
          ${s.box} relative flex items-center justify-center shrink-0
          rounded-xl bg-(--role-primary)/10 border border-(--role-primary)/20
        `}
      >
        {iconSrc ? (
          <img
            src={iconSrc}
            alt="لوگو"
            className="w-3/5 h-3/5 object-contain"
            draggable={false}
          />
        ) : (
          <Icon
            size={s.icon}
            strokeWidth={2}
            className="text-(--role-primary)"
          />
        )}
        
        {/* Role glow dot (top-right) */}
        {/* <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-(--role-primary) shadow-[0_0_6px_2px_var(--role-primary)]" /> */}
      {/* </span> */} 

      {/* Wordmark: ملک جو */}
      {showLabel && (
        <span
          className={`
            ${s.text} font-bold tracking-tight leading-none
            ${labelPosition === "left" ? "order-first" : ""}
          `}
        >
          <span className="text-foreground">ملک</span>
          <span className="text-(--role-primary)">جو</span>
        </span>
      )}
    </div>
  );
});

Logo.displayName = "Logo";
export default Logo;