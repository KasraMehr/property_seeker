import { useState, useEffect, useCallback } from "react";
import { Controller } from "react-hook-form";
import MultiSelect from "@/shared/ui/selectors/MultiSelect";
import api from "@/lib/api";
import { getSpanClass } from "../utils/getSpanClass";
import { toRHFRules } from "../utils/toRHFRules";

/**
 * MultiSelectField — multi-select with optional asyncSource support.
 *
 * When field.asyncSource is provided, options are fetched from the API
 * on mount. The response is expected to be an array (or { results: [...] }).
 * Each item is mapped to { value: item.id, label: item[field.displayField || "name"] }.
 *
 * When field.options is provided (static), those are used directly.
 */
export default function MultiSelectField({
  field,
  control,
  errors,
  isDisabled,
  labelWithStar,
}) {
  const name = field.key;
  const error = errors[name]?.message;
  const rules = toRHFRules(field);
  const spanClass = getSpanClass(field.span);

  // ─── Async options ───
  const [asyncOptions, setAsyncOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOptions = useCallback(async () => {
    if (!field.asyncSource) return;
    setLoading(true);
    try {
      const res = await api.get(field.asyncSource);
      let data = res?.data ?? res;
      if (typeof field.transformResponse === "function") {
        data = field.transformResponse(data);
      }
      const list = Array.isArray(data) ? data : data?.results || [];
      const displayField = field.displayField || "name";
      setAsyncOptions(
        list.map((item) => ({
          value: item.id,
          label: item[displayField] || String(item.id),
          ...item,
        })),
      );
    } catch {
      setAsyncOptions([]);
    } finally {
      setLoading(false);
    }
  }, [field.asyncSource, field.displayField, field.transformResponse]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  // Merge: async options take precedence over static options
  const options = field.asyncSource
    ? asyncOptions
    : field.options || [];

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { value, onChange, ref } }) => (
        <div className={spanClass}>
          <MultiSelect
            ref={ref}
            label={labelWithStar}
            options={options}
            value={Array.isArray(value) ? value : []}
            onChange={onChange}
            placeholder={loading ? "در حال بارگذاری..." : field.placeholder}
            searchable={field.searchable !== false}
            disabled={isDisabled || loading}
            error={error}
          />
        </div>
      )}
    />
  );
}