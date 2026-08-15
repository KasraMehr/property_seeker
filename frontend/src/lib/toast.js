import React from "react";
import { toast } from "react-hot-toast";
import { TriangleAlert, Check, X, Info } from "lucide-react";

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
  success: (message, options = {}) =>
    toast.success(message, {
      ...defaultOptions,
      ...options,
      style: {
        ...defaultOptions.style,
        background: "var(--success)",
        color: "#FFFFFF",
        ...options.style,
      },
      icon: React.createElement(Check, { size: 18 }),
    }),

  error: (message, options = {}) =>
    toast.error(message, {
      ...defaultOptions,
      ...options,
      style: {
        ...defaultOptions.style,
        background: "var(--danger)",
        color: "#FFFFFF",
        ...options.style,
      },
      icon: React.createElement(X, { size: 18 }),
    }),

  info: (message, options = {}) =>
    toast(message, {
      ...defaultOptions,
      ...options,
      style: {
        ...defaultOptions.style,
        background: "var(--primary)",
        color: "#FFFFFF",
        ...options.style,
      },
      icon: React.createElement(Info, { size: 18 }),
    }),

  warning: (message, options = {}) =>
    toast(message, {
      ...defaultOptions,
      ...options,
      style: {
        ...defaultOptions.style,
        background: "var(--warning)",
        color: "#FFFFFF",
        ...options.style,
      },
      icon: React.createElement(TriangleAlert, { size: 18 }),
    }),

  dismiss: () => {
    toast.dismiss();
  },
};

export const showSuccess = toastService.success;
export const showError = toastService.error;
export const showInfo = toastService.info;
export const showWarning = toastService.warning;
export const dismissAll = toastService.dismiss;