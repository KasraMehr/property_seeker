import { Controller } from "react-hook-form";
import { getSpanClass } from "../utils/getSpanClass";
import { toRHFRules } from "../utils/toRHFRules";

export default function TextareaField({ field, control, errors, isDisabled }) {
  const name = field.key;
  const error = errors[name]?.message;
  const rules = toRHFRules(field);
  const spanClass = getSpanClass(field.span);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { value, onChange, onBlur, ref } }) => (
        <div className={spanClass}>
          {field.label && (
            <label className="block text-sm font-medium mb-1.5 text-foreground">
              {field.label}
              {field.required && <span className="text-danger mr-1">*</span>}
            </label>
          )}
          <textarea
            ref={ref}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            rows={field.rows || 3}
            placeholder={field.placeholder || ""}
            disabled={isDisabled}
            className={`w-full px-4 py-2.5 rounded-xl bg-surface border text-sm text-foreground placeholder:text-muted outline-none transition-all resize-y focus:ring-2 focus:ring-primary/30 focus:border-primary ${
              error ? "border-danger" : "border-border"
            }`}
            dir="rtl"
          />
          {error && <p className="mt-1 text-xs text-danger font-medium">{error}</p>}
        </div>
      )}
    />
  );
}