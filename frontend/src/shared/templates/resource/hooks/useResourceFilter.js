import { useState, useCallback, useMemo, useRef } from "react";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";

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
    }).convert(persian).format("YYYY/MM/DD");
  } catch {
    return dateStr;
  }
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
          state[field.key] = { min: field.min, max: field.max };
          break;
        case "date_range":
          state[field.key] = { from: null, to: null };
          break;
        case "toggle":
          state[field.key] = false;
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

      // If value is the same reference or primitive, return prev to bail out
      if (prev[key] === newValue) return prev;

      // For arrays/objects, do shallow comparison
      if (
        Array.isArray(prev[key]) &&
        Array.isArray(newValue) &&
        prev[key].length === newValue.length &&
        prev[key].every((v, i) => v === newValue[i])
      ) {
        return prev;
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
          defaultValue = { min: field.min, max: field.max };
          break;
        case "date_range":
          defaultValue = { from: null, to: null };
          break;
        case "toggle":
          defaultValue = false;
          break;
        default:
          defaultValue = null;
      }

      if (prev[key] === defaultValue) return prev;
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

        case "range":
          if (value.min !== field.min || value.max !== field.max) {
            chips.push({
              key: field.key,
              label: `${value.min} - ${value.max}`,
              type: "range",
            });
          }
          break;

        case "date_range":
          if (value.from || value.to) {
            const fromFa = toPersianDateString(value.from);
            const toFa = toPersianDateString(value.to);
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

        case "range":
          if (value && (value.min !== field.min || value.max !== field.max)) {
            const minKey = field.min_key || `${field.key}_min`;
            const maxKey = field.max_key || `${field.key}_max`;
            if (value.min != null) params[minKey] = value.min;
            if (value.max != null) params[maxKey] = value.max;
          }
          break;

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
