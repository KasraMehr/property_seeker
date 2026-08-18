import { Controller } from "react-hook-form";
import { Upload } from "lucide-react";
import { getSpanClass } from "../utils/getSpanClass";
import { toRHFRules } from "../utils/toRHFRules";

export default function FileField({ field, control, errors, isDisabled }) {
  const name = field.key;
  const error = errors[name]?.message;
  const rules = toRHFRules(field);
  const spanClass = getSpanClass(field.span);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { value, onChange } }) => (
        <div className={spanClass}>
          {field.label && (
            <label className="block text-sm font-medium mb-1.5 text-foreground">
              {field.label}
              {field.required && <span className="text-danger mr-1">*</span>}
            </label>
          )}
          <label
            className={`flex items-center gap-2 rounded-xl border border-dashed px-4 py-3 cursor-pointer transition-colors hover:bg-accent ${
              error ? "border-danger" : "border-border"
            } ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
          >
            <Upload size={18} className="text-muted shrink-0" />
            <span className="text-sm text-muted truncate">
              {value?.name || field.placeholder || "فایل را انتخاب کنید"}
            </span>
            <input
              type="file"
              accept={field.accept || "*"}
              disabled={isDisabled}
              className="hidden"
              onChange={(e) => onChange(e.target.files?.[0] || null)}
            />
          </label>
          {value && !isDisabled && (
            <button
              type="button"
              className="mt-1 text-xs text-muted hover:text-foreground"
              onClick={() => onChange(null)}
            >
              حذف فایل
            </button>
          )}
          {error && <p className="mt-1 text-xs text-danger font-medium">{error}</p>}
        </div>
      )}
    />
  );
}