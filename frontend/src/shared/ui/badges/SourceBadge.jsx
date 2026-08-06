import { forwardRef } from "react";

const MAP = {
  divar:    { bg: "bg-purple-500/10",  text: "text-purple-500",  label: "دیوار" },
  sheypoor: { bg: "bg-orange-500/10",  text: "text-orange-500",  label: "شیپور" },
  internal: { bg: "bg-(--role-primary)/10", text: "text-(--role-primary)", label: "داخلی" },
};

const SourceBadge = forwardRef(({ source, size = "sm", className = "", ...props }, ref) => {
  const cfg = MAP[source] || { bg: "bg-muted/10", text: "text-muted", label: source || "—" };
  const sz = size === "md" ? "px-2.5 py-1 text-xs rounded-lg" : "px-2 py-0.5 text-[10px] rounded-md";

  return (
    <span ref={ref} className={`inline-flex font-medium ${cfg.bg} ${cfg.text} ${sz} ${className}`} {...props}>
      {cfg.label}
    </span>
  );
});

SourceBadge.displayName = "SourceBadge";
export default SourceBadge;