// Generic Form Renderer — reads form config, renders fields with react-hook-form
// Supports: tabs, validation, conditions, dependsOn, autoFill, computed, asyncSource

import { useEffect, useMemo, useState, useCallback } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Search, ChevronDown, X, Calendar, Upload, Eye } from "lucide-react";
import Button from "@/shared/ui/Button";
import Tabs from "@/shared/ui/Tabs";

/* ─── helpers ─── */
const toRHFRules = (field) => {
  const rules = {};
  if (field.required) rules.required = field.validation?.required || "این فیلد الزامی است";
  if (field.pattern) rules.pattern = { value: new RegExp(field.pattern), message: field.validation?.pattern || "فرمت نامعتبر" };
  if (field.minLength) rules.minLength = { value: field.minLength, message: field.validation?.minLength || `حداقل ${field.minLength} کاراکتر` };
  if (field.maxLength) rules.maxLength = { value: field.maxLength, message: field.validation?.maxLength || `حداکثر ${field.maxLength} کاراکتر` };
  if (field.min != null) rules.min = { value: field.min, message: field.validation?.min || `حداقل ${field.min}` };
  if (field.max != null) rules.max = { value: field.max, message: field.validation?.max || `حداکثر ${field.max}` };
  if (field.validation?.match) rules.validate = (v, vals) => v === vals[field.validation.match] || "مقدار با فیلد مورد نظر یکسان نیست";
  return rules;
};

const formatPrice = (v) => {
  if (v == null || v === "") return "";
  return String(v).replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
const parsePrice = (v) => (v ? Number(String(v).replace(/,/g, "")) : null);

/* ─── SearchSelect sub-component ─── */
function SearchSelect({ field, control, errors, setValue, getValues, disabled }) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const name = field.key;
  const error = errors[name]?.message;

  const fetchOptions = useCallback(async (q = "") => {
    if (!field.asyncSource) return;
    setLoading(true);
    try {
      // Replace template vars in URL
      let url = field.asyncSource;
      const depends = field.dependsOn ? getValues(field.dependsOn) : null;
      if (depends != null) url = url.replace(`{${field.dependsOn}}`, encodeURIComponent(depends));
      if (q) url += (url.includes("?") ? "&" : "?") + `search=${encodeURIComponent(q)}`;
      const res = await fetch(url);
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.results || [];
      setOptions(list);
    } catch {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [field, getValues]);

  useEffect(() => {
    if (field.dependsOn) {
      const depVal = getValues(field.dependsOn);
      if (!depVal) { setOptions([]); setValue(name, null); return; }
    }
    fetchOptions();
  }, [field.dependsOn ? getValues(field.dependsOn) : null]);

  const displayValue = (opt) => {
    if (!opt) return "";
    if (field.displayField) return opt[field.displayField] || "";
    return opt.name || opt.title || opt.label || JSON.stringify(opt);
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={toRHFRules(field)}
      render={({ field: { value, onChange } }) => {
        const selected = options.find((o) => o.id === value) || (value?.id ? value : null);
        return (
          <div className={`relative ${field.span ? `col-span-${field.span}` : "col-span-12"}`}>
            {field.label && (
              <label className="block text-sm font-medium mb-1 text-foreground">
                {field.label}
                {field.required && <span className="text-destructive mr-1">*</span>}
              </label>
            )}
            <div className="relative">
              <input
                type="text"
                value={open ? query : selected ? displayValue(selected) : ""}
                onChange={(e) => { setQuery(e.target.value); setOpen(true); fetchOptions(e.target.value); }}
                onFocus={() => setOpen(true)}
                placeholder={field.placeholder || "جستجو..."}
                disabled={disabled || (field.dependsOn && !getValues(field.dependsOn))}
                className={`w-full rounded-lg border bg-background px-3 py-2 pr-9 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${error ? "border-destructive" : "border-border"}`}
                dir="rtl"
              />
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              {selected && (
                <button type="button" onClick={() => onChange(null)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X size={14} />
                </button>
              )}
              {open && (
                <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover shadow-lg max-h-60 overflow-auto">
                  {loading ? (
                    <div className="p-3 text-center text-sm text-muted-foreground">در حال بارگذاری...</div>
                  ) : options.length === 0 ? (
                    <div className="p-3 text-center text-sm text-muted-foreground">موردی یافت نشد</div>
                  ) : (
                    options.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => { onChange(opt.id); setOpen(false); setQuery(""); }}
                        className={`w-full text-right px-3 py-2 text-sm hover:bg-accent transition-colors ${selected?.id === opt.id ? "bg-primary/10 text-primary" : ""}`}
                      >
                        {displayValue(opt)}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
          </div>
        );
      }}
    />
  );
}

/* ─── Field Renderer ─── */
function FieldRenderer({ field, control, errors, register, watch, setValue, getValues, disabled }) {
  const name = field.key;
  const error = errors[name]?.message;
  const val = watch(name);
  const rules = toRHFRules(field);
  const isDisabled = disabled || field.readOnly || (field.dependsOn && !getValues(field.dependsOn));

  const commonInputClass = `w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${error ? "border-destructive" : "border-border"}`;
  const spanClass = field.span ? `col-span-${field.span}` : "col-span-12";

  // Nested display (read-only)
  if (field.type === "nested_display") {
    const displayData = field.autoFill?.source ? getValues(field.autoFill.field) || field.autoFill.defaultValue : val;
    const template = field.displayTemplate || "{full_name}";
    const text = typeof displayData === "object" && displayData != null
      ? template.replace(/\{(\w+)\}/g, (_, k) => displayData[k] || "")
      : String(displayData || "");
    return (
      <div className={spanClass}>
        {field.label && <label className="block text-sm font-medium mb-1 text-muted-foreground">{field.label}</label>}
        <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground">{text || "—"}</div>
      </div>
    );
  }

  // Link (read-only)
  if (field.type === "link") {
    const linkVal = field.autoFill?.source ? getValues(field.autoFill.field) : val;
    return (
      <div className={spanClass}>
        {field.label && <label className="block text-sm font-medium mb-1 text-muted-foreground">{field.label}</label>}
        <a href={linkVal} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <Eye size={14} /> مشاهده لینک
        </a>
      </div>
    );
  }

  // Search select
  if (field.type === "search_select") {
    return <SearchSelect field={field} control={control} errors={errors} setValue={setValue} getValues={getValues} disabled={isDisabled} />;
  }

  // Multi select
  if (field.type === "multi_select") {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { value = [], onChange } }) => (
          <div className={spanClass}>
            {field.label && (
              <label className="block text-sm font-medium mb-1 text-foreground">
                {field.label}{field.required && <span className="text-destructive mr-1">*</span>}
              </label>
            )}
            <div className="flex flex-wrap gap-2">
              {(field.options || []).map((opt) => {
                const selected = (value || []).includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      const next = selected ? value.filter((v) => v !== opt.value) : [...(value || []), opt.value];
                      onChange(next);
                    }}
                    disabled={isDisabled}
                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${selected ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-foreground hover:bg-accent"}`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
          </div>
        )}
      />
    );
  }

  // Select
  if (field.type === "select") {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { value, onChange } }) => (
          <div className={spanClass}>
            {field.label && (
              <label className="block text-sm font-medium mb-1 text-foreground">
                {field.label}{field.required && <span className="text-destructive mr-1">*</span>}
              </label>
            )}
            <div className="relative">
              <select
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value || null)}
                disabled={isDisabled}
                className={`${commonInputClass} appearance-none pr-3`}
                dir="rtl"
              >
                <option value="">{field.placeholder || "انتخاب کنید"}</option>
                {(field.options || []).map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
            {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
          </div>
        )}
      />
    );
  }

  // Checkbox
  if (field.type === "checkbox") {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <div className={`${spanClass} flex items-center gap-2 py-2`}>
            <input
              type="checkbox"
              id={name}
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
              disabled={isDisabled}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor={name} className="text-sm text-foreground cursor-pointer">{field.label}</label>
          </div>
        )}
      />
    );
  }

  // File
  if (field.type === "file") {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <div className={spanClass}>
            {field.label && <label className="block text-sm font-medium mb-1 text-foreground">{field.label}</label>}
            <label className={`flex items-center gap-2 rounded-lg border border-dashed px-4 py-3 cursor-pointer transition-colors hover:bg-accent ${error ? "border-destructive" : "border-border"}`}>
              <Upload size={18} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{value?.name || field.placeholder || "فایل را انتخاب کنید"}</span>
              <input
                type="file"
                accept={field.accept || "*"}
                disabled={isDisabled}
                className="hidden"
                onChange={(e) => onChange(e.target.files?.[0] || null)}
              />
            </label>
            {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
          </div>
        )}
      />
    );
  }

  // Textarea
  if (field.type === "textarea") {
    return (
      <div className={spanClass}>
        {field.label && (
          <label className="block text-sm font-medium mb-1 text-foreground">
            {field.label}{field.required && <span className="text-destructive mr-1">*</span>}
          </label>
        )}
        <textarea
          {...register(name, rules)}
          rows={field.rows || 3}
          placeholder={field.placeholder || ""}
          disabled={isDisabled}
          className={`${commonInputClass} resize-y`}
          dir="rtl"
        />
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  // Datetime / Date
  if (field.type === "datetime" || field.type === "date") {
    return (
      <div className={spanClass}>
        {field.label && (
          <label className="block text-sm font-medium mb-1 text-foreground">
            {field.label}{field.required && <span className="text-destructive mr-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            type={field.type === "datetime" ? "datetime-local" : "date"}
            {...register(name, rules)}
            disabled={isDisabled}
            className={`${commonInputClass} pl-9`}
            dir="rtl"
          />
          <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  // Price
  if (field.type === "price") {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { value, onChange } }) => (
          <div className={spanClass}>
            {field.label && (
              <label className="block text-sm font-medium mb-1 text-foreground">
                {field.label}{field.required && <span className="text-destructive mr-1">*</span>}
              </label>
            )}
            <input
              type="text"
              value={formatPrice(value)}
              onChange={(e) => onChange(parsePrice(e.target.value))}
              placeholder={field.placeholder || "مثلاً ۵,۰۰۰,۰۰۰,۰۰۰"}
              disabled={isDisabled}
              className={`${commonInputClass} font-mono text-left`}
              dir="ltr"
            />
            {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
          </div>
        )}
      />
    );
  }

  // Number
  if (field.type === "number") {
    return (
      <div className={spanClass}>
        {field.label && (
          <label className="block text-sm font-medium mb-1 text-foreground">
            {field.label}{field.required && <span className="text-destructive mr-1">*</span>}
          </label>
        )}
        <input
          type="number"
          {...register(name, { ...rules, valueAsNumber: true })}
          placeholder={field.placeholder || ""}
          disabled={isDisabled}
          className={`${commonInputClass} text-left`}
          dir="ltr"
        />
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  // Default: text, url, phone, email, password
  const inputType = field.type === "password" ? "password" : field.type === "email" ? "email" : field.type === "url" ? "url" : field.type === "phone" ? "tel" : "text";
  return (
    <div className={spanClass}>
      {field.label && (
        <label className="block text-sm font-medium mb-1 text-foreground">
          {field.label}{field.required && <span className="text-destructive mr-1">*</span>}
        </label>
      )}
      <input
        type={inputType}
        {...register(name, rules)}
        placeholder={field.placeholder || ""}
        disabled={isDisabled}
        className={commonInputClass}
        dir={field.type === "phone" || field.type === "email" || field.type === "url" ? "ltr" : "rtl"}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

/* ─── Tab Condition Evaluator ─── */
function shouldShowTab(tab, values) {
  if (!tab.condition) return true;
  if (typeof tab.condition === "function") return tab.condition(values);
  return true;
}

function shouldShowField(field, values, mode) {
  if (!field.condition) return true;
  if (typeof field.condition === "function") return field.condition(values, mode);
  return true;
}

/* ─── Main FormRenderer ─── */
export default function FormRenderer({
  config,
  defaultValues = {},
  mode = "create", // "create" | "edit"
  onSubmit,
  onCancel,
  loading = false,
  extraData = {}, // for autoFill sources (e.g. { listing: {...}, call: {...} })
}) {
  const { tabs, fields: flatFields, actions, title, description } = config;
  const hasTabs = tabs && tabs.length > 0;
  const [activeTab, setActiveTab] = useState(hasTabs ? tabs[0].key : null);

  const allFields = useMemo(() => {
    if (flatFields) return flatFields;
    if (tabs) return tabs.flatMap((t) => t.fields || []);
    return [];
  }, [config]);

  const formDefaultValues = useMemo(() => {
    const defs = { ...defaultValues };
    allFields.forEach((f) => {
      if (defs[f.key] === undefined) {
        if (f.defaultValue !== undefined) defs[f.key] = f.defaultValue;
        else if (f.type === "checkbox") defs[f.key] = false;
        else if (f.type === "multi_select") defs[f.key] = [];
        else defs[f.key] = "";
      }
    });
    return defs;
  }, [defaultValues, allFields]);

  const { register, handleSubmit, control, watch, setValue, getValues, formState: { errors }, reset } = useForm({
    defaultValues: formDefaultValues,
    mode: "onChange",
  });

  const values = watch();

  // Reset when defaultValues change (edit mode switch)
  useEffect(() => {
    reset(formDefaultValues);
  }, [JSON.stringify(formDefaultValues)]);

  // Auto-fill from extraData
  useEffect(() => {
    allFields.forEach((field) => {
      if (field.autoFill && extraData[field.autoFill.source]) {
        const src = extraData[field.autoFill.source];
        const raw = src[field.autoFill.field];
        let val = raw;
        if (field.autoFill.transform) {
          try { val = field.autoFill.transform(raw); } catch { val = raw; }
        }
        if (val !== undefined && getValues(field.key) !== val) {
          setValue(field.key, val, { shouldValidate: true });
        }
      }
    });
  }, [extraData, allFields, setValue, getValues]);

  // Computed fields
  useEffect(() => {
    allFields.forEach((field) => {
      if (field.computed && typeof field.computed === "function") {
        try {
          const val = field.computed(values);
          if (val !== undefined && val !== getValues(field.key)) {
            setValue(field.key, val, { shouldValidate: true });
          }
        } catch { /* ignore */ }
      }
    });
  }, [values, allFields, setValue, getValues]);

  const visibleTabs = useMemo(() => {
    if (!hasTabs) return [];
    return tabs.filter((t) => shouldShowTab(t, values));
  }, [tabs, values, hasTabs]);

  const renderFields = (fieldList) => (
    <div className="grid grid-cols-12 gap-4">
      {fieldList
        .filter((f) => shouldShowField(f, values, mode))
        .map((field) => (
          <FieldRenderer
            key={field.key}
            field={field}
            control={control}
            errors={errors}
            register={register}
            watch={watch}
            setValue={setValue}
            getValues={getValues}
            disabled={loading}
          />
        ))}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full" dir="rtl">
      {title && <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>}
      {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}

      {hasTabs ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} variant="underline" className="flex-1 min-h-0 flex flex-col">
          <Tabs.List className="shrink-0 mb-2">
            {visibleTabs.map((tab) => (
              <Tabs.Trigger key={tab.key} value={tab.key} icon={tab.icon}>{tab.label}</Tabs.Trigger>
            ))}
          </Tabs.List>
          <div className="flex-1 min-h-0 overflow-y-auto pr-1">
            {visibleTabs.map((tab) => (
              <Tabs.Content key={tab.key} value={tab.key}>
                {renderFields(tab.fields || [])}
              </Tabs.Content>
            ))}
          </div>
        </Tabs>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          {renderFields(flatFields || [])}
        </div>
      )}

      {/* Actions */}
      <div className="shrink-0 flex justify-end gap-2 pt-4 mt-4 border-t border-border">
        <Button type="button" variant={actions?.cancel?.variant || "ghost"} size="sm" onClick={onCancel} disabled={loading}>
          {actions?.cancel?.label || "انصراف"}
        </Button>
        <Button type="submit" variant={actions?.submit?.variant || "primary"} size="sm" disabled={loading}>
          {loading ? "در حال ذخیره..." : actions?.submit?.label || "ذخیره"}
        </Button>
      </div>
    </form>
  );
}