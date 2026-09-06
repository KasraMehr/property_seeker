/**
 * Modal configs — reusable confirmation presets
 */
export const MODAL_TYPES = {
  DELETE_LEAD: "deleteLead",
  DELETE_PROPERTY: "deleteProperty",
  DELETE_USER: "deleteUser",
  CONVERT_LEAD: "convertLead",
  ARCHIVE_PROPERTY: "archiveProperty",
  LOGOUT: "logout",
};

export const getModalConfig = (type, data = {}) => {
  const configs = {
    [MODAL_TYPES.DELETE_LEAD]: {
      title: "حذف لید",
      message: `آیا از حذف لید "${data.name || "این لید"}" مطمئن هستید؟ این عملیات قابل بازگشت نیست.`,
      confirmText: "حذف",
      cancelText: "انصراف",
      variant: "danger",
    },
    [MODAL_TYPES.DELETE_PROPERTY]: {
      title: "حذف ملک",
      message: `ملک "${data.title || "این ملک"}" حذف خواهد شد. ادامه می‌دهید؟`,
      confirmText: "حذف",
      variant: "danger",
    },
    [MODAL_TYPES.DELETE_USER]: {
      title: "حذف کاربر",
      message: `کاربر "${data.name || "این کاربر"}" حذف می‌شود. مطمئنید؟`,
      confirmText: "حذف",
      variant: "danger",
    },
    [MODAL_TYPES.CONVERT_LEAD]: {
      title: "تبدیل لید به مشتری",
      message: `لید "${data.name || "این لید"}" به مشتری تبدیل می‌شود. ادامه می‌دهید؟`,
      confirmText: "تبدیل",
      variant: "success",
    },
    [MODAL_TYPES.ARCHIVE_PROPERTY]: {
      title: "بایگانی ملک",
      message: `ملک "${data.title || "این ملک"}" بایگانی می‌شود.`,
      confirmText: "بایگانی",
      variant: "warning",
    },
    [MODAL_TYPES.LOGOUT]: {
      title: "خروج از حساب",
      message: "می‌خواهید از حساب کاربری خارج شوید؟",
      confirmText: "خروج",
      variant: "logout",
    },
  };

  return configs[type] || null;
};