const PLACEHOLDER = "-";

/**
 * Numbers
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return PLACEHOLDER;
  }

  return Number(value).toLocaleString("fa-IR");
};

/**
 * Currency (Toman)
 */
export const formatPrice = (value) => {
  if (value === null || value === undefined || value === "") {
    return PLACEHOLDER;
  }

  return `${Number(value).toLocaleString("fa-IR")} تومان`;
};

/**
 * Area
 */
export const formatArea = (value) => {
  if (!value && value !== 0) return PLACEHOLDER;

  return `${Number(value).toLocaleString("fa-IR")} متر`;
};

/**
 * Percent
 */
export const formatPercent = (value) => {
  if (value === null || value === undefined) {
    return PLACEHOLDER;
  }

  return `${value}%`;
};

/**
 * Persian number converter
 */
const toPersianDigits = (str) =>
  str.replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

/**
 * Date (optionally with time)
 * @param {string} mode - "short" for date only, "long" for date + time
 */
export const formatDate = (value, mode = "short") => {
  if (!value) return PLACEHOLDER;

  const d = new Date(value);
  if (mode === "long") {
    const datePart = d.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const timePart = d.toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${datePart}  -  ${timePart}`;
  }
  return d.toLocaleDateString("fa-IR");
};

/**
 * Date + Time (always shows both, separated)
 */
export const formatDateTime = (value) => {
  if (!value) return PLACEHOLDER;

  const d = new Date(value);
  const datePart = d.toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const timePart = d.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart}  -  ${timePart}`;
};

/**
 * Boolean
 */
export const formatBoolean = (value) => {
  if (value === null || value === undefined) {
    return PLACEHOLDER;
  }

  return value ? "بله" : "خیر";
};

/**
 * Phone
 */
export const formatPhone = (phone) => {
  if (!phone) return PLACEHOLDER;

  return phone;
};

/**
 * Text
 */
export const formatText = (text) => {
  if (text === null || text === undefined || text === "") {
    return PLACEHOLDER;
  }

  return text;
};

/**
 * Generic fallback
 */
export const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return PLACEHOLDER;
  }

  return value;
};

export const fmtSource = (source) => {
  if (!source) return "-";
  if (typeof source === "string") return source;
  return source.name || source.label || "-";
};

export const formatDuration = (seconds) => {
  if (seconds === null || seconds === undefined || seconds === "") {
    return PLACEHOLDER;
  }

  const totalSeconds = Number(seconds);

  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return PLACEHOLDER;
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);

  const format = (value) => value.toLocaleString("fa-IR");

  if (hours > 0) {
    return `${format(hours)} ساعت ${format(minutes)} دقیقه`;
  }

  if (minutes > 0) {
    return `${format(minutes)} دقیقه ${format(secs)} ثانیه`;
  }

  return `${format(secs)} ثانیه`;
};
