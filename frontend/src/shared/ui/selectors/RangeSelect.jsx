import { forwardRef, useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import RangeSlider from "@/shared/ui/RangeSlider";
import { toFa } from "@/utils/formatters";

const formatValue = (v, unit) => {
  if (unit === "تومان") {
    if (v >= 1_000_000_000) return `${toFa((v / 1_000_000_000).toFixed(1))} میلیارد`;
    if (v >= 1_000_000) return `${toFa(Math.round(v / 1_000_000))} میلیون`;
  }
  return toFa(v);
};

/** Convert user-typed number to actual value based on unit */
const parseWithUnit = (num, unit) => {
  if (unit === "میلیارد") return num * 1_000_000_000;
  if (unit === "میلیون") return num * 1_000_000;
  return num;
};

/** Convert actual value to display number based on unit */
const toDisplayUnit = (value, unit) => {
  if (unit === "میلیارد") return value / 1_000_000_000;
  if (unit === "میلیون") return value / 1_000_000;
  return value;
};

const PRICE_UNITS = [
  { value: "تومان", label: "تومان" },
  { value: "میلیون", label: "میلیون" },
  { value: "میلیارد", label: "میلیارد" },
];

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
    const [inputUnit, setInputUnit] = useState(unit === "تومان" ? "میلیون" : "");
    const [minInput, setMinInput] = useState("");
    const [maxInput, setMaxInput] = useState("");
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const [focused, setFocused] = useState(false);

    const isPrice = unit === "تومان";
    const hasValue = local.min !== min || local.max !== max;
    const isLabelFloating = focused || isOpen || hasValue;

    useEffect(() => setLocal(value), [value]);

    // Sync input values when local changes (from slider)
    useEffect(() => {
      if (isPrice) {
        setMinInput(toDisplayUnit(local.min, inputUnit) || "");
        setMaxInput(toDisplayUnit(local.max, inputUnit) || "");
      }
    }, [local.min, local.max, inputUnit, isPrice]);

    useEffect(() => {
      const handler = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    const isError = !!error;

    const handleMinInput = (e) => {
      const raw = e.target.value.replace(/[^\d]/g, "");
      setMinInput(raw);
      const num = raw === "" ? min : Number(raw);
      const actual = isPrice ? parseWithUnit(num, inputUnit) : num;
      setLocal((prev) => ({ ...prev, min: Math.max(Math.min(actual, prev.max - step), min) }));
    };

    const handleMaxInput = (e) => {
      const raw = e.target.value.replace(/[^\d]/g, "");
      setMaxInput(raw);
      const num = raw === "" ? max : Number(raw);
      const actual = isPrice ? parseWithUnit(num, inputUnit) : num;
      setLocal((prev) => ({ ...prev, max: Math.min(Math.max(actual, prev.min + step), max) }));
    };

    const handleClear = (e) => {
      e.stopPropagation();
      setLocal({ min, max });
      setMinInput("");
      setMaxInput("");
      onChange?.({ min, max });
    };

    const handleApply = () => {
      onChange?.(local);
      setIsOpen(false);
    };

    return (
      <div ref={containerRef} className={`relative w-full ${className}`} {...props}>
        {/* Trigger */}
        <div className="relative">
          <button
            ref={ref}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && setIsOpen((p) => !p)}
            className={`
              group relative w-full flex items-center gap-2 rounded-xl border bg-surface
              transition-all py-4 pr-3 pl-8
              ${isError ? "border-danger" : "border-border hover:border-(--role-primary)/40 focus:border-(--role-primary)"}
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {/* Floating label */}
            {label && (
              <span
                className={`
                  absolute right-3 px-1 text-xs rounded-md bg-surface transition-all pointer-events-none
                  ${isLabelFloating
                    ? "-top-2 text-[10px] text-(--role-primary)"
                    : "top-1/2 -translate-y-1/2 text-muted"
                  }
                `}
              >
                {label}
              </span>
            )}

            {/* Value */}
            <span className="flex-1 text-right truncate text-sm">
              {hasValue
                ? `${formatValue(local.min, unit)} الی ${formatValue(local.max, unit)}${unit ? ` ${unit}` : ""}`
                : ""}
            </span>

            {/* Chevron */}
            <ChevronDown
              size={16}
              className={`transition ${isOpen ? "rotate-180 text-(--role-primary)" : "text-muted"}`}
            />
          </button>

          {/* Clear button */}
          {hasValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors z-10"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {error && <p className="mt-1 text-xs text-danger">{error}</p>}

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-surface shadow-lg p-4">
            {/* Unit selector for price */}
            {isPrice && (
              <div className="flex gap-1 mb-4 p-1 bg-muted/30 rounded-lg">
                {PRICE_UNITS.map((u) => (
                  <button
                    key={u.value}
                    type="button"
                    onClick={() => {
                      setInputUnit(u.value);
                      setMinInput(toDisplayUnit(local.min, u.value) || "");
                      setMaxInput(toDisplayUnit(local.max, u.value) || "");
                    }}
                    className={`flex-1 py-1.5 text-xs rounded-md transition ${
                      inputUnit === u.value
                        ? "bg-(--role-primary) text-white font-medium"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            )}

            {/* Min/Max inputs */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1">
                <label className="block text-[10px] text-muted mb-1">حداقل</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    ref={inputRef}
                    value={minInput}
                    onChange={handleMinInput}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={toFa(toDisplayUnit(min, inputUnit))}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-(--role-primary)/30 focus:border-(--role-primary) ltr text-left"
                  />
                  {/* {isPrice && inputUnit !== "تومان" && (
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-muted">
                      {inputUnit}
                    </span>
                  )} */}
                </div>
              </div>
              <span className="text-muted text-xs mt-4">—</span>
              <div className="flex-1">
                <label className="block text-[10px] text-muted mb-1">حداکثر</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={maxInput}
                    onChange={handleMaxInput}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={toFa(toDisplayUnit(max, inputUnit))}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-(--role-primary)/30 focus:border-(--role-primary) ltr text-left"
                  />
                  {/* {isPrice && inputUnit !== "تومان" && (
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-muted">
                      {inputUnit}
                    </span>
                  )} */}
                </div>
              </div>
            </div>

            {/* Slider */}
            <RangeSlider
              min={min}
              max={max}
              step={step}
              value={local}
              onChange={setLocal}
            />

            {/* Range labels */}
            <div className="flex justify-between mt-2 text-xs text-muted">
              <span>{formatValue(min, unit)}</span>
              <span>{formatValue(max, unit)}</span>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                className="flex-1 rounded-lg border border-border py-2 text-sm"
                onClick={() => setIsOpen(false)}
              >
                بستن
              </button>
              <button
                className="flex-1 rounded-lg bg-(--role-primary) text-white py-2 text-sm"
                onClick={handleApply}
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
