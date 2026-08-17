import { getValue } from "./utils/getValue";
import { formatFieldValue } from "./utils/formatFieldValue.jsx";

/* ─── Field Grid Component ─── */
export function DetailFieldGrid({
  data,
  sections,
  emptyText = "اطلاعاتی موجود نیست",
}) {
  if (!data) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="space-y-6 pr-1" dir="rtl">
      {sections.map((section) => {
        const visibleFields = section.fields.filter((f) => {
          if (f.condition && typeof f.condition === "function") {
            return f.condition(data);
          }
          const val = f.dataKey
            ? getValue(data, f.dataKey)
            : getValue(data, f.key);
          return val !== null && val !== undefined && val !== "";
        });

        if (visibleFields.length === 0) return null;

        return (
          <div key={section.section}>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 border-b border-border pb-1">
              {section.sectionLabel}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {visibleFields.map((field) => {
                const rawValue = field.dataKey
                  ? getValue(data, field.dataKey)
                  : getValue(data, field.key);
                const displayValue = formatFieldValue(rawValue, field, data);
                if (displayValue === null) return null;

                return (
                  <div
                    key={field.key}
                    className={`flex items-start gap-2 p-2.5 rounded-lg bg-surface border border-border ${field.fullWidth ? "sm:col-span-2" : ""}`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        {field.label}
                      </p>
                      <div className="text-sm text-foreground font-medium wrap-break-word mt-0.5">
                        {displayValue}
                        {field.suffix && !field.type && (
                          <span className="text-xs text-muted-foreground mr-1">
                            {field.suffix}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}