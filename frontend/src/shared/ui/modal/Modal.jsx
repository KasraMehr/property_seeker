import { forwardRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/**
 * Modal — base dialog with Framer Motion, role-aware accents
 * Backdrop click to close
 * Sticky header, scrollable body, optional footer
 */
const Modal = forwardRef(({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",          // sm | md | lg | xl | full
  showClose = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = "",
  ...props
}, ref) => {
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    if (!closeOnEscape) return;
    const handle = (e) => e.key === "Escape" && onClose?.();
    if (isOpen) window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [isOpen, onClose, closeOnEscape]);

  const sizeMap = {
    sm:  "max-w-sm",
    md:  "max-w-lg",
    lg:  "max-w-2xl",
    xl:  "max-w-4xl",
    full: "max-w-[95vw] h-[90vh]",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" {...props}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            onClick={closeOnBackdrop ? onClose : undefined}
          />

          {/* Panel */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`
              relative z-10 flex flex-col w-full ${sizeMap[size]}
              bg-surface rounded-2xl border border-border shadow-2xl shadow-(--role-primary)/5
              overflow-hidden
              ${className}
            `}
          >
            {/* Role accent top border */}
            <div className="h-1 w-full bg-linear-to-r from-(--role-primary) to-(--role-primary-hover) shrink-0" />

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
                <h2 className="text-lg font-bold text-foreground tracking-tight">{title}</h2>
                {showClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-(--role-subtle)/40 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 border-t border-border bg-background/30 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

Modal.displayName = "Modal";
export default Modal;