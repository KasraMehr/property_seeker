import { useEffect, useState, useCallback, useRef } from "react";
import { Controller } from "react-hook-form";
import { Search, X } from "lucide-react";
import api from "@/lib/api";
import useDebounce from "@/shared/useDebounce";
import { getSpanClass } from "../utils/getSpanClass";
import { toRHFRules } from "../utils/toRHFRules";

export default function SearchSelectField({
  field,
  control,
  errors,
  setValue,
  getValues,
  disabled,
}) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const name = field.key;
  const error = errors[name]?.message;
  const spanClass = getSpanClass(field.span);

  const debouncedQuery = useDebounce(query, field.debounce ?? 500);

  const fetchOptions = useCallback(
    async (q = "") => {
      if (!field.asyncSource) return;
      setLoading(true);
      try {
        let url = field.asyncSource;
        const depends = field.dependsOn ? getValues(field.dependsOn) : null;
        if (depends != null) {
          url = url.replace(
            `{${field.dependsOn}}`,
            encodeURIComponent(depends),
          );
        }
        if (q) {
          url +=
            (url.includes("?") ? "&" : "?") + `search=${encodeURIComponent(q)}`;
        }
        const res = await api.get(url);
        let data = res?.data ?? res;
        // Support optional transformResponse for non-standard API shapes
        if (typeof field.transformResponse === "function") {
          data = field.transformResponse(data);
        }
        const list = Array.isArray(data) ? data : data?.results || [];
        setOptions(list);
        setFetchError(null);
      } catch (err) {
        setOptions([]);
        const status = err?.response?.status;
        if (status === 403) {
          setFetchError("دسترسی غیرمجاز — با مدیر سیستم تماس بگیرید.");
        } else if (status) {
          setFetchError(`خطا در بارگذاری (${status})`);
        } else {
          setFetchError("خطا در اتصال به سرور.");
        }
      } finally {
        setLoading(false);
      }
    },
    [field, getValues],
  );

  const depValue = field.dependsOn ? getValues(field.dependsOn) : null;

  // Refetch when asyncSource changes (e.g., mode toggle between customer/owner)
  const prevAsyncSource = useRef(field.asyncSource);
  useEffect(() => {
    if (prevAsyncSource.current !== field.asyncSource) {
      prevAsyncSource.current = field.asyncSource;
      setOptions([]);
      setQuery("");
      // Don't clear the value here - let parent handle it
    }
  }, [field.asyncSource]);

  // first without query
  useEffect(() => {
    if (field.dependsOn && !depValue) {
      setOptions([]);
      setValue(name, null);
      return;
    }
    fetchOptions("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depValue, field.dependsOn, name, field.asyncSource]);

  // search with debounce
  useEffect(() => {
    if (!open) return;
    fetchOptions(debouncedQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const displayValue = (opt) => {
    if (!opt) return "";
    if (field.displayField) return opt[field.displayField] || "";
    return (
      opt.name ||
      opt.title ||
      opt.label ||
      opt.full_name ||
      String(opt.id ?? "")
    );
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={toRHFRules(field)}
      render={({ field: { value, onChange } }) => {
        const selected =
          options.find((o) => o.id === value) ||
          (value && typeof value === "object" && value.id ? value : null);

        return (
          <div className={`relative ${spanClass}`}>
            {field.label && (
              <label className="block text-sm font-medium mb-1.5 text-foreground">
                {field.label}
                {field.required && <span className="text-danger mr-1">*</span>}
              </label>
            )}
            <div className="relative">
              <input
                type="text"
                value={open ? query : selected ? displayValue(selected) : ""}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                  // no need to fetch again , debounce will do it
                }}
                onFocus={() => {
                  setOpen(true);
                  // fetch option query if needed
                }}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
                placeholder={field.placeholder || "جستجو..."}
                disabled={
                  disabled || (field.dependsOn && !getValues(field.dependsOn))
                }
                className={`w-full rounded-xl border bg-surface px-4 py-2.5 pr-9 text-sm text-foreground outline-none transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary ${
                  error ? "border-danger" : "border-border"
                }`}
                dir="rtl"
                autoComplete="off"
              />
              <Search
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
              />
              {/* X button: show only when selected */}
              {selected && !disabled && (
                <button
                  type="button"
                  onClick={() => {
                    onChange(null);
                    setQuery("");
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  <X size={14} />
                </button>
              )}
              {/* + button: show only when NOT selected */}
              {field.addAction && !disabled && !selected && (
                <button
                  type="button"
                  onClick={field.addAction}
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-7 px-3 flex items-center justify-center gap-1 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors cursor-pointer"
                  title={field.addActionLabel || "افزودن جدید"}
                >
                  <span className="text-sm leading-none">+</span>
                  <span>جدید</span>
                </button>
              )}
              {open && (
                <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-border bg-surface/95 shadow-lg max-h-60 overflow-auto backdrop-blur-md">
                  {loading ? (
                    <div className="p-3 text-center text-sm text-muted">
                      در حال بارگذاری...
                    </div>
                  ) : fetchError ? (
                    <div className="p-3 text-center text-sm text-danger">
                      {fetchError}
                    </div>
                  ) : options.length === 0 ? (
                    <div className="p-3 text-center text-sm text-muted">
                      موردی یافت نشد
                    </div>
                  ) : (
                    options.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          onChange(opt.id);
                          setOpen(false);
                          setQuery("");
                        }}
                        className={`w-full text-right px-4 py-2 text-sm hover:bg-accent transition-colors ${
                          selected?.id === opt.id
                            ? "bg-primary/10 text-primary"
                            : ""
                        }`}
                      >
                        {displayValue(opt)}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            {error && (
              <p className="mt-1 text-xs text-danger font-medium">{error}</p>
            )}
          </div>
        );
      }}
    />
  );
}
