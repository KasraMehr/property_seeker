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
 * Date
 */
export const formatDate = (value) => {
  if (!value) return PLACEHOLDER;

  return new Date(value).toLocaleDateString("fa-IR");
};

/**
 * Date + Time
 */
export const formatDateTime = (value) => {
  if (!value) return PLACEHOLDER;

  return new Date(value).toLocaleString("fa-IR");
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
  if (
    text === null ||
    text === undefined ||
    text === ""
  ) {
    return PLACEHOLDER;
  }

  return text;
};

/**
 * Generic fallback
 */
export const formatValue = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return PLACEHOLDER;
  }

  return value;
};