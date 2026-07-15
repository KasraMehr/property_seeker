import { useEffect } from "react";
import { X } from "lucide-react";

export default function Drawer({
  isOpen,
  onClose,
  children,
  header,
  footer,
  position = "right",
}) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const positionClasses = {
    right: {
      container: "right-0 inset-y-0 rounded-l-3xl",
      transform: isOpen ? "translate-x-0" : "translate-x-full",
    },

    left: {
      container: "left-0 inset-y-0 rounded-r-3xl",
      transform: isOpen ? "translate-x-0" : "-translate-x-full",
    },

    top: {
      container: "top-0 inset-x-0 rounded-b-3xl",
      transform: isOpen ? "translate-y-0" : "-translate-y-full",
    },

    bottom: {
      container: "bottom-0 inset-x-0 rounded-t-3xl",
      transform: isOpen ? "translate-y-0" : "translate-y-full",
    },
  };

  const sizeClasses = {
    right: "w-full max-w-[340px] h-full",
    left: "w-full max-w-[340px] h-full",
    top: "w-full max-h-[80vh]",
    bottom: "w-full max-h-[80vh]",
  };

  return (
    <>
      {/* Overlay */}

      <div
        onClick={onClose}
        className={`fixed inset-0 z-90 bg-black/30 backdrop-blur-sm transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}

      <aside
        className={`fixed z-100 bg-background border-border shadow-2xl
          transition-transform duration-200 ease-out flex flex-col
          ${positionClasses[position].container}
          ${positionClasses[position].transform}
          ${sizeClasses[position]}
        `}
      >
        {(header || onClose) && (
          <div className="flex items-center justify-between border-b border-border px-5 py-4 shrink-0">
            <div>{header}</div>

            <button
              onClick={onClose}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-muted transition-colors hover:bg-muted/10 hover:text-foreground"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>

        {footer && (
          <div className="border-t border-border px-5 py-4 shrink-0">
            {footer}
          </div>
        )}
      </aside>
    </>
  );
}