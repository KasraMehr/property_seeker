import { useState, useRef, useEffect, useMemo, forwardRef } from "react";
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
  isOpen: controlledOpen,
  onOpenChange,
  position,
}, ref) => {
  const isControlled = controlledOpen !== undefined;
  const [openInternal, setOpenInternal] = useState(false);
  const open = isControlled ? controlledOpen : openInternal;
  const containerRef = useRef(null);

  const setOpen = (value) => {
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      setOpenInternal(value);
    }
  };

  // Only attach outside-click listener in uncontrolled mode
  useEffect(() => {
    if (isControlled) return;
    const handle = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenInternal(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [isControlled]);

  // Auto-close after 3 seconds (pauses on hover)
  const isHovered = useRef(false);
  const timerRef = useRef(null);

  const startCloseTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!isHovered.current) setOpen(false);
    }, 2000);
  };

  useEffect(() => {
    if (open) {
      isHovered.current = false;
      startCloseTimer();
    } else {
      clearTimeout(timerRef.current);
    }
    return () => clearTimeout(timerRef.current);
  }, [open]);

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
        onClick={() => setOpen(!open)}
        className="
          p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-(--role-subtle)/30
          transition-colors duration-150 cursor-pointer
        "
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div
          onMouseEnter={() => {
            isHovered.current = true;
            clearTimeout(timerRef.current);
          }}
          onMouseLeave={() => {
            isHovered.current = false;
            startCloseTimer();
          }}
          className="
            z-50
            min-w-35 bg-surface/95 backdrop-blur-xl
            border border-border rounded-xl shadow-xl
            overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150
          "
          style={position ? (() => {
            const MENU_W = 160;
            const MENU_H = builtActions.length * 36 + 16;
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            let x = position.x;
            let y = position.y;
            if (x + MENU_W > vw) x = vw - MENU_W - 8;
            if (y + MENU_H > vh) y = position.y - MENU_H;
            return { position: 'fixed', left: x, top: y };
          })() : {
            position: 'absolute',
            left: 0,
            top: '100%',
            marginTop: 4,
          }}
        >
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