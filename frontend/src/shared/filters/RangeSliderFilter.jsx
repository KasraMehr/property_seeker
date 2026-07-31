import { useState, useEffect, useCallback, forwardRef } from "react";

/**
 * RangeSliderFilter — dual range with APPLY button
 * TODO: Fix direction for track
 */
const RangeSliderFilter = forwardRef(({
  min,
  max,
  step = 1,
  unit = "",
  value,
  onChange,
  formatFn,
  className = "",
}, ref) => {
  const [local, setLocal] = useState(value || { min, max });

  useEffect(() => {
    if (value) setLocal(value);
  }, [value]);

  const format = useCallback((v) => {
    if (formatFn) return formatFn(v);
    if (unit === "تومان" && v >= 1000000000) return `${(v / 1000000000).toFixed(1)} میلیارد`;
    if (unit === "تومان" && v >= 1000000) return `${(v / 1000000).toFixed(0)} میلیون`;
    return new Intl.NumberFormat("fa-IR").format(v);
  }, [formatFn, unit]);

  const handleMin = (e) => {
    const v = Math.min(Number(e.target.value), local.max - step);
    setLocal((prev) => ({ ...prev, min: Math.max(min, v) }));
  };

  const handleMax = (e) => {
    const v = Math.max(Number(e.target.value), local.min + step);
    setLocal((prev) => ({ ...prev, max: Math.min(max, v) }));
  };

  const handleApply = () => {
    onChange?.(local);
  };

  const minPct = ((local.min - min) / (max - min)) * 100;
  const maxPct = ((local.max - min) / (max - min)) * 100;

  return (
    <div ref={ref} className={`space-y-3 ${className}`}>
      {/* Values */}
      <div className="flex items-center justify-between">
        <div className="text-center">
          <span className="text-[10px] text-muted">حداقل</span>
          <p className="text-sm font-bold text-foreground">{format(local.min)}</p>
        </div>
        <div className="h-px flex-1 mx-3 bg-border" />
        <div className="text-center">
          <span className="text-[10px] text-muted">حداکثر</span>
          <p className="text-sm font-bold text-foreground">{format(local.max)}</p>
        </div>
      </div>

      {/* Track  */}
      <div className="relative h-1.5 bg-border rounded-full" dir="rtl">
        <div
          className="absolute h-full rounded-full bg-(--role-primary)"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
        />
        <input
          type="range" min={min} max={max} step={step}
          value={local.min} onChange={handleMin}
          className="absolute w-full h-full opacity-0 cursor-pointer z-20"
          style={{ top: -6 }}
        />
        <input
          type="range" min={min} max={max} step={step}
          value={local.max} onChange={handleMax}
          className="absolute w-full h-full opacity-0 cursor-pointer z-20"
          style={{ top: -6 }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-(--role-primary) border-2 border-surface shadow-sm z-10 pointer-events-none"
          style={{ left: `calc(${minPct}% - 8px)` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-(--role-primary) border-2 border-surface shadow-sm z-10 pointer-events-none"
          style={{ left: `calc(${maxPct}% - 8px)` }}
        />
      </div>

      {/* Apply button */}
      <button
        onClick={handleApply}
        className="w-full py-2 bg-(--role-primary) text-white rounded-lg hover:bg-(--role-primary)/90 transition-colors text-sm font-medium"
      >
        اعمال {unit ? `(${unit})` : "فیلتر"}
      </button>
    </div>
  );
});

RangeSliderFilter.displayName = "RangeSliderFilter";
export default RangeSliderFilter;