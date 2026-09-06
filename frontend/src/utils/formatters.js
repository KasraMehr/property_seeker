const PLACEHOLDER = "-";

const fa = new Intl.NumberFormat("fa-IR");
export const toFa = (v) => fa.format(v);

/**
 * Format a range value for display in chips
 * e.g. formatRange(0, 50000000, "تومان") → "۰ الی ۵۰ میلیون تومان"
 */
export function formatRange(min, max, unit = "") {
  const formatNumber = (v) => {
    if (unit === "تومان") {
      if (v >= 1_000_000_000) return `${toFa((v / 1_000_000_000).toFixed(1))} میلیارد`;
      if (v >= 1_000_000) return `${toFa(Math.round(v / 1_000_000))} میلیون`;
    }
    return toFa(v);
  };
  const unitStr = unit ? ` ${unit}` : "";
  return `${formatNumber(min)} الی ${formatNumber(max)}${unitStr}`;
}

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

/**
 * Compact counter for tab badges.
 *
 * 1–999      → "42"
 * 1k–99.9k   → "1.5k", "10k", "99.9k"
 * 100k–999k  → "100k"
 * 1M–99.9M   → "1.5m", "10m", "99.9m"
 * 100M+      → "100m"
 */
export const formatCounter = (value) => {
  if (value == null || isNaN(value)) return "0";

  const n = Number(value);

  if (n < 1_000) return String(n);

  if (n < 100_000) {
    const k = n / 1_000;
    return k >= 10 ? `${Math.round(k)}k` : `${k.toFixed(1).replace(/\.0$/, "")}k`;
  }

  if (n < 1_000_000) {
    return `${Math.round(n / 1_000)}k`;
  }

  if (n < 100_000_000) {
    const m = n / 1_000_000;
    return m >= 10 ? `${Math.round(m)}m` : `${m.toFixed(1).replace(/\.0$/, "")}m`;
  }

  return `${Math.round(n / 1_000_000)}m`;
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
