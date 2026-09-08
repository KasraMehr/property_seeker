import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import useFilterStore from "@/store/useFilterStore";
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
 * Parse a single URL param string into the correct JS type for a filter field.
 */
function parseUrlValue(rawValue, field) {
  if (rawValue == null || rawValue === "") return undefined; // signal "not in URL"
  switch (field.type) {
    case "search":
      return rawValue;
    case "select":
    case "search_select":
      return rawValue;
    case "multiselect":
    case "multi_select":
      return rawValue.split(",").filter(Boolean);
    case "range": {
      const minKey = field.min_key || `${field.key}_min`;
      const maxKey = field.max_key || `${field.key}_max`;
      // We handle range at the top level (see buildStateFromUrl), skip here
      return undefined;
    }
    case "date_range": {
      const fromKey = field.from_key || `${field.key}_from`;
      const toKey = field.to_key || `${field.key}_to`;
      // We handle date_range at the top level, skip here
      return undefined;
    }
    case "toggle":
      return rawValue === "true" || rawValue === "1";
    case "location_cascade":
      // Handled at top level
      return undefined;
    default:
      return rawValue;
  }
}

/**
 * useResourceFilter
 *
 * Generic filter state manager.
 * @param {object[]} schema - filter field definitions
 * @param {object} optionsData - async options data
 * @param {object} [opts]
 * @param {boolean} [opts.syncToUrl=false] - persist filter state in URL search params
 */
export default function useResourceFilter(schema = [], optionsData = {}, opts = {}) {
  const { syncToUrl = false } = opts;
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const storeGetFilters = useFilterStore((s) => s.getFilters);
  const storeGetLabels = useFilterStore((s) => s.getLabels);
  const storeSetFilters = useFilterStore((s) => s.setFilters);

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

  // Build initial state, optionally hydrated from URL search params or Zustand store
  const buildInitialStateFromUrl = useCallback(() => {
    if (!syncToUrl) return buildInitialState();

    // Priority: URL params > Zustand store > defaults
    const hasUrlParams = Array.from(searchParams.keys()).length > 0;

    if (hasUrlParams) {
      // Hydrate from URL params
      const state = buildInitialState();
      const currentSchema = schemaRef.current;

      currentSchema.forEach((field) => {
        switch (field.type) {
          case "range": {
            const fieldMin = field.min ?? 0;
            const fieldMax = field.max ?? 100;
            const minKey = field.min_key || `${field.key}_min`;
            const maxKey = field.max_key || `${field.key}_max`;
            const urlMin = searchParams.get(minKey);
            const urlMax = searchParams.get(maxKey);
            if (urlMin != null || urlMax != null) {
              state[field.key] = {
                min: urlMin != null ? Number(urlMin) : fieldMin,
                max: urlMax != null ? Number(urlMax) : fieldMax,
              };
            }
            break;
          }
          case "date_range": {
            const fromKey = field.from_key || `${field.key}_from`;
            const toKey = field.to_key || `${field.key}_to`;
            const urlFrom = searchParams.get(fromKey);
            const urlTo = searchParams.get(toKey);
            if (urlFrom || urlTo) {
              state[field.key] = {
                from: urlFrom || null,
                to: urlTo || null,
              };
            }
            break;
          }
          case "location_cascade": {
            const prov = searchParams.get("province");
            const city = searchParams.get("city");
            const dist = searchParams.get("district");
            const neigh = searchParams.get("neighborhood");
            if (prov || city || dist || neigh) {
              state[field.key] = {
                province: prov || null,
                city: city || null,
                district: dist || null,
                neighborhood: neigh || null,
              };
            }
            break;
          }
          default: {
            const urlVal = parseUrlValue(searchParams.get(field.key), field);
            if (urlVal !== undefined) {
              state[field.key] = urlVal;
            }
            break;
          }
        }
      });

      return state;
    }

    // No URL params — try Zustand store
    const cached = storeGetFilters(location.pathname);
    if (cached) {
      return { ...buildInitialState(), ...cached };
    }

    return buildInitialState();
  }, [syncToUrl, searchParams, buildInitialState, storeGetFilters, location.pathname]);

  const [filters, setFilters] = useState(buildInitialStateFromUrl);
  const [filterLabels, setFilterLabels] = useState(() => {
    if (!syncToUrl) return {};
    return storeGetLabels(location.pathname) || {};
  });

  const setFilter = useCallback((key, value, label) => {
    if (label !== undefined) {
      setFilterLabels((prev) => {
        if (!label) {
          if (!(key in prev)) return prev;

          const next = { ...prev };
          delete next[key];
          return next;
        }

        if (prev[key] === label) return prev;

        return { ...prev, [key]: label };
      });
    }

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

    setFilterLabels((prev) => {
      if (!(key in prev)) return prev;

      const next = { ...prev };
      delete next[key];
      return next;
    });

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
    setFilterLabels((prev) => {
      if (Object.keys(prev).length === 0) return prev;
      return {};
    });

    setFilters((prev) => {
      const next = buildInitialState();
      // Shallow compare
      if (JSON.stringify(prev) === JSON.stringify(next)) return prev;
      return next;
    });
  }, [buildInitialState]);

  // ── Sync: write filter state to URL params + Zustand store ──
  useEffect(() => {
    if (!syncToUrl) return;

    const next = new URLSearchParams();
    const currentSchema = schemaRef.current;

    currentSchema.forEach((field) => {
      const value = filters[field.key];
      if (value == null) return;

      switch (field.type) {
        case "search":
        case "select":
        case "search_select":
          if (value) next.set(field.key, String(value));
          break;
        case "multiselect":
        case "multi_select":
          if (Array.isArray(value) && value.length > 0) {
            next.set(field.key, value.join(","));
          }
          break;
        case "range": {
          const fieldMin = field.min ?? 0;
          const fieldMax = field.max ?? 100;
          const minKey = field.min_key || `${field.key}_min`;
          const maxKey = field.max_key || `${field.key}_max`;
          if (value.min != null && value.min !== fieldMin) next.set(minKey, String(value.min));
          if (value.max != null && value.max !== fieldMax) next.set(maxKey, String(value.max));
          break;
        }
        case "date_range": {
          const fromKey = field.from_key || `${field.key}_from`;
          const toKey = field.to_key || `${field.key}_to`;
          if (value?.from) next.set(fromKey, value.from);
          if (value?.to) next.set(toKey, value.to);
          break;
        }
        case "toggle":
          if (value) next.set(field.key, "true");
          break;
        case "location_cascade":
          if (value?.province) next.set("province", String(value.province));
          if (value?.city) next.set("city", String(value.city));
          if (value?.district) next.set("district", String(value.district));
          if (value?.neighborhood) next.set("neighborhood", String(value.neighborhood));
          break;
        default:
          break;
      }
    });

    // Update URL params
    const nextStr = next.toString();
    const prevStr = searchParams.toString();
    if (nextStr !== prevStr) {
      setSearchParams(next, { replace: true });
    }

    // Always save to Zustand store so sidebar navigation restores these
    storeSetFilters(location.pathname, { ...filters }, { ...filterLabels });
  }, [filters, filterLabels, syncToUrl, searchParams, setSearchParams, storeSetFilters, location.pathname]);

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
              label: option?.label || filterLabels[field.key] || value,
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
          if (
            value.province ||
            value.city ||
            value.district ||
            value.neighborhood
          ) {
            // Use stored label from FilterBar if available, otherwise fallback
            const storedLabel = filterLabels[field.key];
            const parts = [];
            if (value.province) parts.push(`استان`);
            if (value.city) parts.push(`شهر`);
            if (value.district) parts.push(`منطقه`);
            if (value.neighborhood) parts.push(`محله`);
            chips.push({
              key: field.key,
              label: storedLabel || field.label || parts.join(" › ") || "موقعیت",
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
  }, [filters, filterLabels]);
  
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
