import { useState, useCallback, useMemo, useRef } from "react";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import { formatRange, toFa } from "@/utils/formatters";

/**
 * Convert gregorian date string (YYYY-MM-DD) to Persian display string (YYYY/MM/DD)
 */
function toPersianDateString(dateStr) {
  if (!dateStr) return null;
  try {
    return new DateObject({
      date: dateStr,
      calendar: gregorian,
      format: "YYYY-MM-DD",
    })
      .convert(persian)
      .format("YYYY/MM/DD", persian_fa);
  } catch {
    return dateStr;
  }
}

// Fallback: manually convert digits to Persian
function toFaDigits(str) {
  if (!str) return str;
  const map = {
    0: "۰",
    1: "۱",
    2: "۲",
    3: "۳",
    4: "۴",
    5: "۵",
    6: "۶",
    7: "۷",
    8: "۸",
    9: "۹",
  };
  return str.replace(/[0-9]/g, (d) => map[d]);
}

/**
 * useResourceFilter
 *
 * Generic filter state manager.
 */
export default function useResourceFilter(schema = [], optionsData = {}) {
  const schemaRef = useRef(schema);
  schemaRef.current = schema;

  const optionsRef = useRef(optionsData);
  optionsRef.current = optionsData;

  const buildInitialState = useCallback(() => {
    const state = {};
    const currentSchema = schemaRef.current;

    currentSchema.forEach((field) => {
      switch (field.type) {
        case "search":
          state[field.key] = "";
          break;
        case "select":
        case "search_select":
          state[field.key] = null;
          break;
        case "multiselect":
        case "multi_select":
          state[field.key] = [];
          break;
        case "range":
          state[field.key] = { min: field.min ?? 0, max: field.max ?? 100 };
          break;
        case "date_range":
          state[field.key] = { from: null, to: null };
          break;
        case "toggle":
          state[field.key] = false;
          break;
        case "location_cascade":
          state[field.key] = {
            province: null,
            city: null,
            district: null,
            neighborhood: null,
          };
          break;
        default:
          state[field.key] = null;
      }
    });

    return state;
  }, []);

  const [filters, setFilters] = useState(buildInitialState);

  // 🔴 KEY FIX: bail out if value hasn't changed
  const setFilter = useCallback((key, value) => {
    setFilters((prev) => {
      const newValue = value === "" ? null : value;
      const prevValue = prev[key];

      // Primitive comparison
      if (prevValue === newValue) return prev;

      // Array shallow comparison
      if (
        Array.isArray(prevValue) &&
        Array.isArray(newValue) &&
        prevValue.length === newValue.length &&
        prevValue.every((v, i) => v === newValue[i])
      ) {
        return prev;
      }

      // Object shallow comparison (for date_range: {from, to})
      if (
        prevValue &&
        newValue &&
        typeof prevValue === "object" &&
        typeof newValue === "object" &&
        !Array.isArray(prevValue) &&
        !Array.isArray(newValue)
      ) {
        const prevKeys = Object.keys(prevValue);
        const newKeys = Object.keys(newValue);
        if (
          prevKeys.length === newKeys.length &&
          prevKeys.every((k) => prevValue[k] === newValue[k])
        ) {
          return prev;
        }
      }

      return { ...prev, [key]: newValue };
    });
  }, []);

  const clearFilter = useCallback((key) => {
    const field = schemaRef.current.find((f) => f.key === key);
    if (!field) return;

    setFilters((prev) => {
      let defaultValue;
      switch (field.type) {
        case "search":
          defaultValue = "";
          break;
        case "select":
        case "search_select":
          defaultValue = null;
          break;
        case "multiselect":
        case "multi_select":
          defaultValue = [];
          break;
        case "range":
          defaultValue = { min: field.min ?? 0, max: field.max ?? 100 };
          break;
        case "date_range":
          defaultValue = { from: null, to: null };
          break;
        case "toggle":
          defaultValue = false;
          break;
        case "location_cascade":
          defaultValue = {
            province: null,
            city: null,
            district: null,
            neighborhood: null,
          };
          break;
        default:
          defaultValue = null;
      }

      const prevValue = prev[key];

      // Primitive comparison
      if (prevValue === defaultValue) return prev;

      // Object shallow comparison
      if (
        prevValue &&
        defaultValue &&
        typeof prevValue === "object" &&
        typeof defaultValue === "object" &&
        !Array.isArray(prevValue) &&
        !Array.isArray(defaultValue)
      ) {
        const prevKeys = Object.keys(prevValue);
        const defKeys = Object.keys(defaultValue);
        if (
          prevKeys.length === defKeys.length &&
          prevKeys.every((k) => prevValue[k] === defaultValue[k])
        ) {
          return prev;
        }
      }

      return { ...prev, [key]: defaultValue };
    });
  }, []);

  const clearAll = useCallback(() => {
    setFilters((prev) => {
      const next = buildInitialState();
      // Shallow compare
      if (JSON.stringify(prev) === JSON.stringify(next)) return prev;
      return next;
    });
  }, [buildInitialState]);

  const activeChips = useMemo(() => {
    const chips = [];
    const currentSchema = schemaRef.current;
    const currentOptions = optionsRef.current;

    currentSchema.forEach((field) => {
      const value = filters[field.key];
      const options = currentOptions[field.optionsKey] || field.options || [];
      switch (field.type) {
        case "search":
          if (value) {
            chips.push({ key: field.key, label: value, type: "search" });
          }
          break;

        case "select":
        case "search_select":
          if (value) {
            const option = options.find(
              (o) => String(o.value) === String(value),
            );
            chips.push({
              key: field.key,
              label: option?.label || value,
              type: field.type,
            });
          }
          break;

        case "multiselect":
        case "multi_select":
          if (Array.isArray(value)) {
            value.forEach((v) => {
              const option = options.find((o) => String(o.value) === String(v));
              chips.push({
                key: field.key,
                value: v,
                label: option?.label || v,
                type: field.type,
              });
            });
          }
          break;

        case "range": {
          const fieldMin = field.min ?? 0;
          const fieldMax = field.max ?? 100;
          if (value.min !== fieldMin || value.max !== fieldMax) {
            chips.push({
              key: field.key,
              label: formatRange(value.min, value.max, field.unit),
              type: "range",
            });
          }
          break;
        }

        case "date_range":
          if (value.from || value.to) {
            const fromFa = toFaDigits(toPersianDateString(value.from));
            const toFa = toFaDigits(toPersianDateString(value.to));
            const parts = [];
            if (fromFa) parts.push(`از ${fromFa}`);
            if (toFa) parts.push(`تا ${toFa}`);
            chips.push({
              key: field.key,
              label: parts.join(" — "),
              type: "date_range",
            });
          }
          break;

        case "toggle":
          if (value) {
            chips.push({ key: field.key, label: field.label, type: "toggle" });
          }
          break;

        case "location_cascade": {
          if (!value) break;
          const parts = [];
          if (value.province) parts.push(`استان`);
          if (value.city) parts.push(`شهر`);
          if (value.district) parts.push(`منطقه`);
          if (value.neighborhood) parts.push(`محله`);
          if (
            value.province ||
            value.city ||
            value.district ||
            value.neighborhood
          ) {
            chips.push({
              key: field.key,
              label: field.label || parts.join(" › ") || "موقعیت",
              type: "location_cascade",
            });
          }
          break;
        }

        default:
          break;
      }
    });

    return chips;
  }, [filters]);

  const queryParams = useMemo(() => {
    const params = {};
    const currentSchema = schemaRef.current;

    currentSchema.forEach((field) => {
      const value = filters[field.key];

      switch (field.type) {
        case "search":
        case "select":
        case "search_select":
          if (value) params[field.key] = value;
          break;

        case "multiselect":
        case "multi_select":
          if (Array.isArray(value) && value.length > 0) {
            params[field.key] = value.join(",");
          }
          break;

        case "range": {
          const fieldMin = field.min ?? 0;
          const fieldMax = field.max ?? 100;
          if (value && (value.min !== fieldMin || value.max !== fieldMax)) {
            const minKey = field.min_key || `${field.key}_min`;
            const maxKey = field.max_key || `${field.key}_max`;
            if (value.min != null && value.min !== fieldMin)
              params[minKey] = value.min;
            if (value.max != null && value.max !== fieldMax)
              params[maxKey] = value.max;
          }
          break;
        }

        case "date_range":
          if (value?.from || value?.to) {
            const fromKey = field.from_key || `${field.key}_from`;
            const toKey = field.to_key || `${field.key}_to`;
            // Convert YYYY-MM-DD to ISO datetime for backend IsoDateTimeFilter
            if (value.from) params[fromKey] = `${value.from}T00:00:00`;
            if (value.to) params[toKey] = `${value.to}T23:59:59`;
          }
          break;

        case "toggle":
          if (value) params[field.key] = true;
          break;

        case "location_cascade":
          if (value?.province) params.province = value.province;
          if (value?.city) params.city = value.city;
          if (value?.district) params.district = value.district;
          if (value?.neighborhood) params.neighborhood = value.neighborhood;
          break;
        default:
          break;
      }
    });

    return params;
  }, [filters]);

  return {
    filters,
    setFilter,
    clearFilter,
    clearAll,
    activeChips,
    activeCount: activeChips.length,
    queryParams,
  };
}
