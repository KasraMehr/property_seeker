import { useEffect, useState, useCallback, useRef } from "react";
import { ChevronDown, Check, X, Search } from "lucide-react";
import api from "@/lib/api";
import useDebounce from "@/shared/useDebounce";

/**
 * Async SearchSelect — shared UI (no RHF)
 * value: id | null | ""
 * onChange(nextValue, nextLabel)  // id | "", display label
 */
export default function SearchSelect({
  label,
  value = null,
  onChange,
  endpoint,
  placeholder = "جستجو...",
  optionLabel = "full_name",
  optionValue = "id",
  searchParam = "search",
  clearable = true,
  disabled = false,
  size = "sm",
  error,
  className = "",
  transformResponse,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const containerRef = useRef(null);
  const debouncedQuery = useDebounce(query, 400);

  const getLabel = (opt) => {
    if (!opt) return "";
    if (typeof optionLabel === "function") return optionLabel(opt);
    return (
      opt[optionLabel] ||
      opt.name ||
      opt.title ||
      opt.full_name ||
      String(opt[optionValue] ?? "")
    );
  };

  const getValue = (opt) => opt?.[optionValue];

  const fetchOptions = useCallback(
    async (q = "") => {
      if (!endpoint) return;
      setLoading(true);
      try {
        let url = endpoint;
        if (q) {
          url +=
            (url.includes("?") ? "&" : "?") +
            `${searchParam}=${encodeURIComponent(q)}`;
        }
        const res = await api.get(url);
        let data = res?.data ?? res;
        if (typeof transformResponse === "function") {
          data = transformResponse(data);
        }
        const list = Array.isArray(data) ? data : data?.results || [];
        setOptions(list);

        // keep label for current value if present in list
        if (value != null && value !== "") {
          const found = list.find((o) => String(getValue(o)) === String(value));
          if (found) setSelectedLabel(getLabel(found));
        }
      } catch {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    },
    [endpoint, searchParam, transformResponse, value],
  );

  // initial load
  useEffect(() => {
    fetchOptions("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  // debounced search while open
  useEffect(() => {
    if (!open) return;
    fetchOptions(debouncedQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, open]);

  // click outside
  useEffect(() => {
    const handle = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const sizeMap = {
    sm: "h-10 text-xs",
    md: "h-12 text-sm",
    lg: "h-14 text-base",
  };

  const hasValue = value != null && value !== "";

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((p) => !p)}
        className={`
          w-full flex items-center gap-2 rounded-xl border bg-surface px-3
          ${sizeMap[size] || sizeMap.sm}
          ${error ? "border-danger" : "border-border"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          text-right
        `}
      >
        <Search size={14} className="text-muted shrink-0" />
        <span
          className={`flex-1 truncate ${hasValue ? "text-foreground" : "text-muted"}`}
        >
          {hasValue ? selectedLabel || placeholder : placeholder}
        </span>
        {clearable && hasValue && !disabled && (
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange?.("", "");
              setSelectedLabel("");
              setQuery("");
            }}
            className="text-muted hover:text-foreground"
          >
            <X size={14} />
          </span>
        )}
        <ChevronDown size={14} className="text-muted shrink-0" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-surface shadow-lg overflow-hidden">
          <div className="p-2 border-b border-border">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو..."
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              dir="rtl"
            />
          </div>
          <div className="max-h-56 overflow-auto">
            {loading ? (
              <div className="p-3 text-center text-xs text-muted">
                در حال بارگذاری...
              </div>
            ) : options.length === 0 ? (
              <div className="p-3 text-center text-xs text-muted">
                موردی یافت نشد
              </div>
            ) : (
              options.map((opt) => {
                const v = getValue(opt);
                const active = String(v) === String(value);
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      const label = getLabel(opt);
                      onChange?.(v, label);
                      setSelectedLabel(label);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 text-sm text-right
                      hover:bg-accent transition-colors
                      ${active ? "bg-primary/10 text-primary" : "text-foreground"}
                    `}
                  >
                    <span className="truncate">{getLabel(opt)}</span>
                    {active && <Check size={14} />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
