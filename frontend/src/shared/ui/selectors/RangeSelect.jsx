import { forwardRef, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import RangeSlider from "@/shared/ui/RangeSlider";

const formatter = new Intl.NumberFormat("fa-IR");

const formatValue = (v, unit) => {
  if (unit === "تومان") {
    if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)} میلیارد`;
    if (v >= 1_000_000) return `${Math.round(v / 1_000_000)} میلیون`;
  }

  return formatter.format(v);
};

const RangeSelect = forwardRef(
  (
    {
      label,
      value = { min: 0, max: 100 },
      onChange,
      min = 0,
      max = 100,
      step = 1,
      unit = "",
      disabled = false,
      error,
      size = "md",
      className = "",
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [local, setLocal] = useState(value);

    const containerRef = useRef(null);

    useEffect(() => setLocal(value), [value]);

    useEffect(() => {
      const handler = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target))
          setIsOpen(false);
      };

      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    const isError = !!error;

    const sizeMap = {
      sm: "py-1.5 px-3 text-xs",
      md: "py-2.5 px-4 text-sm",
      lg: "py-3 px-4 text-base",
    };

    return (
      <div
        ref={containerRef}
        className={`relative w-full ${className}`}
        {...props}
      >
        <button
          ref={ref}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((p) => !p)}
          className={`
          group relative w-full flex items-center gap-2 rounded-xl border bg-surface
          transition-all
          ${
            isError
              ? "border-danger"
              : "border-border hover:border-(--role-primary)/40 focus:border-(--role-primary)"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${sizeMap[size]}
        `}
        >
          <span className="flex-1 text-right truncate">
            {`${formatValue(local.min, unit)} الی ${formatValue(local.max, unit)}${unit ? ` ${unit}` : ""}`}
          </span>

          <ChevronDown
            size={16}
            className={`transition ${isOpen ? "rotate-180 text-(--role-primary)" : "text-muted"}`}
          />

          {label && (
            <span
              className={`
              absolute right-3 px-1 text-xs rounded-md bg-surface
              transition-all
              ${
                isOpen || local.min !== min || local.max !== max
                  ? "-top-2 bg-surface px-1 text-[10px] text-(--role-primary)"
                  : "top-1/2 -translate-y-1/2 text-muted"
              }
            `}
            >
              {label}
            </span>
          )}
        </button>

        {error && <p className="mt-1 text-xs text-danger">{error}</p>}

        {isOpen && (
          <div className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-surface shadow-lg p-4">
            <div className="flex justify-between mb-5 text-sm font-medium">
              <div>
                <div className="text-muted text-xs">حداقل</div>
                {formatValue(local.min, unit)}
              </div>

              <div>
                <div className="text-muted text-xs">حداکثر</div>
                {formatValue(local.max, unit)}
              </div>
            </div>

            <RangeSlider
              min={min}
              max={max}
              step={step}
              value={local}
              onChange={setLocal}
            />

            <div className="flex gap-2 mt-5">
              <button
                className="flex-1 rounded-lg border border-border py-2 text-sm"
                onClick={() => setIsOpen(false)}
              >
                بستن
              </button>

              <button
                className="flex-1 rounded-lg bg-(--role-primary) text-white py-2 text-sm"
                onClick={() => {
                  onChange?.(local);
                  setIsOpen(false);
                }}
              >
                اعمال
              </button>
            </div>
          </div>
        )}
      </div>
    );
  },
);

RangeSelect.displayName = "RangeSelect";

export default RangeSelect;
