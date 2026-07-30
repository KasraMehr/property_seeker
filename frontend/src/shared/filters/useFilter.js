import { useState, useCallback, useMemo } from "react";

/**
 * useFilter — manages filter state from a schema
 * Normalizes Select empty values ("" → null)
 */
export default function useFilter(schema = [], optionsData = {}) {
  const getInitialState = useCallback(() => {
    const state = {};
    schema.forEach((f) => {
      switch (f.type) {
        case "search":
          state[f.key] = "";
          break;
        case "select":
          state[f.key] = null;
          break;
        case "multiselect":
          state[f.key] = [];
          break;
        case "range":
          state[f.key] = { min: f.min, max: f.max };
          break;
        case "date_range":
          state[f.key] = { from: null, to: null };
          break;
        case "toggle":
          state[f.key] = false;
          break;
        default:
          state[f.key] = null;
      }
    });
    return state;
  }, [schema]);

  const [filters, setFilters] = useState(getInitialState);

  const setFilter = useCallback((key, value) => {
    // Normalize Select empty string to null
    const normalized = value === "" ? null : value;
    setFilters((prev) => ({ ...prev, [key]: normalized }));
  }, []);

  const clearFilter = useCallback((key) => {
    const field = schema.find((f) => f.key === key);
    if (!field) return;
    let defaultValue;
    switch (field.type) {
      case "search": defaultValue = ""; break;
      case "select": defaultValue = null; break;
      case "multiselect": defaultValue = []; break;
      case "range": defaultValue = { min: field.min, max: field.max }; break;
      case "date_range": defaultValue = { from: null, to: null }; break;
      case "toggle": defaultValue = false; break;
      default: defaultValue = null;
    }
    setFilters((prev) => ({ ...prev, [key]: defaultValue }));
  }, [schema]);

  const clearAll = useCallback(() => {
    setFilters(getInitialState());
  }, [getInitialState]);

  const activeChips = useMemo(() => {
    const chips = [];
    schema.forEach((field) => {
      const value = filters[field.key];
      const options = optionsData[field.optionsKey] || [];

      if (field.type === "search" && value) {
        chips.push({ key: field.key, label: value, type: "search" });
      }
      else if (field.type === "select" && value) {
        const opt = options.find((o) => String(o.value) === String(value));
        chips.push({ key: field.key, label: opt?.label || value, type: "select" });
      }
      else if (field.type === "multiselect" && value?.length > 0) {
        value.forEach((v) => {
          const opt = options.find((o) => String(o.value) === String(v));
          chips.push({ key: field.key, value: v, label: opt?.label || v, type: "multiselect" });
        });
      }
      else if (field.type === "range" && (value.min !== field.min || value.max !== field.max)) {
        const fmt = (v) => {
          if (field.unit === "تومان" && v >= 1000000000) return `${(v / 1000000000).toFixed(1)} میلیارد`;
          if (field.unit === "تومان" && v >= 1000000) return `${(v / 1000000).toFixed(0)} میلیون`;
          return new Intl.NumberFormat("fa-IR").format(v);
        };
        chips.push({
          key: field.key,
          label: `${fmt(value.min)} – ${fmt(value.max)} ${field.unit || ""}`,
          type: "range",
        });
      }
      else if (field.type === "toggle" && value) {
        chips.push({ key: field.key, label: field.label, type: "toggle" });
      }
    });
    return chips;
  }, [filters, schema, optionsData]);

  const activeCount = activeChips.length;

  const toQueryParams = useCallback(() => {
    const params = {};
    schema.forEach((field) => {
      const value = filters[field.key];
      if (field.type === "search" && value) params[field.key] = value;
      else if (field.type === "select" && value) params[field.key] = value;
      else if (field.type === "multiselect" && value.length) params[field.key] = value.join(",");
      else if (field.type === "range" && (value.min !== field.min || value.max !== field.max)) {
        params[`${field.key}_min`] = value.min;
        params[`${field.key}_max`] = value.max;
      }
      else if (field.type === "toggle" && value) params[field.key] = "true";
    });
    return params;
  }, [filters, schema]);

  return {
    filters,
    setFilter,
    clearFilter,
    clearAll,
    activeChips,
    activeCount,
    toQueryParams,
  };
}