import { toast } from "react-hot-toast";

const defaultOptions = {
  duration: 3000,
  position: "top-center",
  style: {
    direction: "rtl",
    fontSize: "14px",
    padding: "12px 20px",
    borderRadius: "12px",
    fontWeight: "500",
  },
};

export const toastService = {
  success: (message, options = {}) => {
    return toast.success(message, {
      ...defaultOptions,
      ...options,
      style: {
        ...defaultOptions.style,
        background: "var(--success)",
        color: "#FFFFFF",
        ...options.style,
      },
      icon: "✅",
    });
  },

  error: (message, options = {}) => {
    return toast.error(message, {
      ...defaultOptions,
      ...options,
      style: {
        ...defaultOptions.style,
        background: "var(--danger)",
        color: "#FFFFFF",
        ...options.style,
      },
      icon: "❌",
    });
  },

  info: (message, options = {}) => {
    return toast(message, {
      ...defaultOptions,
      ...options,
      style: {
        ...defaultOptions.style,
        background: "var(--primary)",
        color: "#FFFFFF",
        ...options.style,
      },
      icon: "ℹ️",
    });
  },

  warning: (message, options = {}) => {
    return toast(message, {
      ...defaultOptions,
      ...options,
      style: {
        ...defaultOptions.style,
        background: "var(--warning)",
        color: "#FFFFFF",
        ...options.style,
      },
      icon: "⚠️",
    });
  },

  dismiss: () => {
    toast.dismiss();
  },
};

// send simple toasts
export const showSuccess = toastService.success;
export const showError = toastService.error;
export const showInfo = toastService.info;
export const showWarning = toastService.warning;
export const dismissAll = toastService.dismiss;