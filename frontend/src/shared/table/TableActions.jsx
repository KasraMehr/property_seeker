import { useState, useRef, useEffect, forwardRef } from "react";
import { MoreVertical, Pencil, Trash2, Eye } from "lucide-react";

/**
 * TableActions — dropdown action menu for table rows
 */
const TableActions = forwardRef(({
  actions = [], // [{ label, icon, onClick, variant?: "danger" | "default" }]
  onView,
  onEdit,
  onDelete,
  className = "",
}, ref) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // Build from shorthands
  const builtActions = [
    onView && { label: "مشاهده", icon: Eye, onClick: onView },
    onEdit && { label: "ویرایش", icon: Pencil, onClick: onEdit },
    onDelete && { label: "حذف", icon: Trash2, onClick: onDelete, variant: "danger" },
    ...actions,
  ].filter(Boolean);

  if (builtActions.length === 0) return null;

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="
          p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-(--role-subtle)/30
          transition-colors duration-150 cursor-pointer
        "
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div className="
          absolute left-0 top-full mt-1 z-50
          min-w-35 bg-surface/95 backdrop-blur-xl
          border border-border rounded-xl shadow-xl
          overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150
        ">
          {builtActions.map((action, i) => {
            const Icon = action.icon;
            const isDanger = action.variant === "danger";
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  action.onClick?.();
                  setOpen(false);
                }}
                className={`
                  w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium
                  transition-colors duration-150 cursor-pointer
                  ${isDanger
                    ? "text-danger hover:bg-danger/10"
                    : "text-foreground hover:bg-(--role-subtle)/20"
                  }
                `}
              >
                {Icon && <Icon size={14} strokeWidth={2} />}
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});

TableActions.displayName = "TableActions";
export default TableActions;