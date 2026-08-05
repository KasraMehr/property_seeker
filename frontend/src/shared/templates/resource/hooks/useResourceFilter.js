import { useState, useCallback, useMemo } from "react";

/**
 * useResourceFilter
 *
 * Generic filter state manager.
 *
 * Responsibilities:
 * - Build initial filter state from schema
 * - Update filters
 * - Clear single/all filters
 * - Generate active chips
 * - Convert filters to backend query params
 */

export default function useResourceFilter(schema = [], optionsData = {}) {
  const getInitialState = useCallback(() => {
    const state = {};

    schema.forEach((field) => {
      switch (field.type) {
        case "search":
          state[field.key] = "";
          break;

        case "select":
          state[field.key] = null;
          break;

        case "multiselect":
          state[field.key] = [];
          break;

        case "range":
          state[field.key] = {
            min: field.min,
            max: field.max,
          };
          break;

        case "date_range":
          state[field.key] = {
            from: null,
            to: null,
          };
          break;

        case "toggle":
          state[field.key] = false;
          break;

        default:
          state[field.key] = null;
      }
    });

    return state;
  }, [schema]);

  const [filters, setFilters] = useState(getInitialState);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? null : value,
    }));
  }, []);

  const clearFilter = useCallback(
    (key) => {
      const field = schema.find((f) => f.key === key);

      if (!field) return;

      switch (field.type) {
        case "search":
          setFilter(key, "");
          break;

        case "select":
          setFilter(key, null);
          break;

        case "multiselect":
          setFilter(key, []);
          break;

        case "range":
          setFilter(key, {
            min: field.min,
            max: field.max,
          });
          break;

        case "date_range":
          setFilter(key, {
            from: null,
            to: null,
          });
          break;

        case "toggle":
          setFilter(key, false);
          break;

        default:
          setFilter(key, null);
      }
    },
    [schema, setFilter],
  );

  const clearAll = useCallback(() => {
    setFilters(getInitialState());
  }, [getInitialState]);

  const activeChips = useMemo(() => {
    const chips = [];

    schema.forEach((field) => {
      const value = filters[field.key];
      const options = optionsData[field.optionsKey] || [];

      switch (field.type) {
        case "search":
          if (value) {
            chips.push({
              key: field.key,
              label: value,
              type: "search",
            });
          }
          break;

        case "select":
          if (value) {
            const option = options.find(
              (o) => String(o.value) === String(value),
            );

            chips.push({
              key: field.key,
              label: option?.label || value,
              type: "select",
            });
          }
          break;

        case "multiselect":
          value.forEach((v) => {
            const option = options.find((o) => String(o.value) === String(v));

            chips.push({
              key: field.key,
              value: v,
              label: option?.label || v,
              type: "multiselect",
            });
          });
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
            chips.push({
              key: field.key,
              label: `${value.from ?? "..."} تا ${value.to ?? "..."}`,
              type: "date_range",
            });
          }
          break;

        case "toggle":
          if (value) {
            chips.push({
              key: field.key,
              label: field.label,
              type: "toggle",
            });
          }
          break;
      }
    });

    return chips;
  }, [filters, schema, optionsData]);

  const queryParams = useMemo(() => {
    const params = {};

    schema.forEach((field) => {
      const value = filters[field.key];

      switch (field.type) {
        case "search":
        case "select":
          if (value) params[field.key] = value;
          break;

        case "multiselect":
          if (value.length) {
            params[field.key] = value;
          }
          break;

        case "range":
          if (value.min !== field.min || value.max !== field.max) {
            params[`${field.key}_min`] = value.min;
            params[`${field.key}_max`] = value.max;
          }
          break;

        case "date_range":
          if (value.from) {
            params[`${field.key}_from`] = value.from;
          }

          if (value.to) {
            params[`${field.key}_to`] = value.to;
          }
          break;

        case "toggle":
          if (value) {
            params[field.key] = true;
          }
          break;
      }
    });

    return params;
  }, [filters, schema]);

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
