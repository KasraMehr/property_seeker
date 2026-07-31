import { forwardRef } from "react";

/**
 * ScoreBadge — circular score indicator with dynamic color
 */
const ScoreBadge = forwardRef(({
  score,               // 0-100 number
  size = "md",         // sm | md | lg
  showLabel = true,
  label = "امتیاز",
  className = "",
  ...props
}, ref) => {
  // Pick color + shadow by score tier
  const getConfig = (s) => {
    if (s >= 90) return { bg: "bg-teal-500",    shadow: "shadow-teal-500/30" };
    if (s >= 75) return { bg: "bg-sky-500",     shadow: "shadow-sky-500/30" };
    if (s >= 60) return { bg: "bg-violet-500",  shadow: "shadow-violet-500/30" };
    if (s >= 40) return { bg: "bg-amber-500",   shadow: "shadow-amber-500/30" };
    if (s >= 20) return { bg: "bg-orange-500",  shadow: "shadow-orange-500/30" };
    return         { bg: "bg-rose-500",    shadow: "shadow-rose-500/30" };
  };
  // Size scale tokens
  const sizeMap = {
    sm:  { box: "w-12 h-12",  text: "text-base",  label: "text-[9px]" },
    md:  { box: "w-16 h-16",  text: "text-xl",    label: "text-[10px]" },
    lg:  { box: "w-20 h-20",  text: "text-2xl",   label: "text-xs" },
  };
  const config = getConfig(score);
  const s = sizeMap[size] || sizeMap.md;

  return (
    <div
      ref={ref}
      className={`shrink-0 ${s.box} ${config.bg} text-white ${config.shadow} rounded-full flex flex-col items-center justify-center font-bold shadow-lg ${className}`}
      {...props}
    >
      <span className={s.text}>{score}</span>
      {showLabel && (
        <span className={`${s.label} opacity-90 font-medium`}>{label}</span>
      )}
    </div>
  );
});

ScoreBadge.displayName = "ScoreBadge";
export default ScoreBadge;