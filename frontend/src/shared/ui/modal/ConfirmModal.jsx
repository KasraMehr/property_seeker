import { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, CheckCircle2, Info, Trash2, X , User
} from "lucide-react";
import { getModalConfig } from "@/constants/modalConfigs";
import Button from "@/shared/ui/Button";

/**
 * ConfirmModal — smart confirmation dialog
 *
 * Two usage modes:
 * 1. Manual:   <ConfirmModal title="..." message="..." variant="danger" />
 * 2. Config:   <ConfirmModal type="deleteLead" data={{ name: "" }} />
 */
const ConfirmModal = forwardRef(({
  // Mode 1: manual props
  title: manualTitle,
  message: manualMessage,
  confirmText: manualConfirmText,
  cancelText: manualCancelText,
  variant: manualVariant,

  // Mode 2: config-driven
  type,
  data = {},

  // Common
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  showClose = true,
  className = "",
  ...props
}, ref) => {
  // Resolve config if type is provided
  const config = type ? getModalConfig(type, data) : null;

  const title = manualTitle || config?.title || "تأیید عملیات";
  const message = manualMessage || config?.message || "آیا از انجام این عملیات مطمئن هستید؟";
  const confirmText = manualConfirmText || config?.confirmText || "تأیید";
  const cancelText = manualCancelText || config?.cancelText || "انصراف";
  const variant = manualVariant || config?.variant || "danger";

  const styleMap = {
    danger: {
      icon: Trash2,
      iconBg: "bg-danger/10",
      iconColor: "text-danger",
      confirmVariant: "danger",
    },
    logout: {
      icon: User ,
      iconBg: "bg-danger/10",
      iconColor: "text-danger",
      confirmVariant: "danger",
    },
    warning: {
      icon: AlertTriangle,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      confirmVariant: "primary",
    },
    info: {
      icon: Info,
      iconBg: "bg-sky-500/10",
      iconColor: "text-sky-500",
      confirmVariant: "primary",
    },
    success: {
      icon: CheckCircle2,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      confirmVariant: "primary",
    },
  };

  const style = styleMap[variant] || styleMap.danger;
  const Icon = style.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" {...props}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className={`
              relative z-10 w-full max-w-md
              bg-surface rounded-2xl border border-border shadow-2xl p-6
              ${className}
            `}
          >
            {showClose && (
              <button
                onClick={onClose}
                className="absolute top-4 left-4 p-1 rounded-md text-muted hover:text-foreground hover:bg-(--role-subtle)/30 transition-colors"
              >
                <X size={18} />
              </button>
            )}

            <div className="flex justify-center mb-4">
              <div className={`w-14 h-14 rounded-2xl ${style.iconBg} flex items-center justify-center`}>
                <Icon size={28} className={style.iconColor} strokeWidth={1.8} />
              </div>
            </div>

            <h3 className="text-lg font-bold text-center text-foreground mb-2 tracking-tight">
              {title}
            </h3>

            <p className="text-sm text-muted text-center leading-relaxed mb-6">
              {message}
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={onClose}
                disabled={isLoading}
              >
                {cancelText}
              </Button>
              <Button
                variant={style.confirmVariant}
                size="md"
                fullWidth
                onClick={onConfirm}
                disabled={isLoading}
                className={isLoading ? "opacity-70" : ""}
              >
                {isLoading ? "در حال انجام..." : confirmText}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

ConfirmModal.displayName = "ConfirmModal";
export default ConfirmModal;