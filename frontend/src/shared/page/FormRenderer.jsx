// shared/page/FormRenderer.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { Search, X, Upload, Eye } from "lucide-react";
import Button from "@/shared/ui/Button";
import Tabs from "@/shared/ui/Tabs";
import Input from "@/shared/ui/Input";
import Select from "@/shared/ui/selectors/Select";
import MultiSelect from "@/shared/ui/selectors/MultiSelect";
import DatePickerInput from "@/shared/ui/selectors/DatePicker";
import api from "@/lib/api";

/* ─── Tailwind-safe span ─── */
const SPAN_CLASS = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
};
const getSpanClass = (span) => SPAN_CLASS[span] || SPAN_CLASS[12];

const pad = (n) => String(n).padStart(2, "0");

function todayYmd() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const toRHFRules = (field) => {
  const rules = {};
  if (field.required) {
    rules.required = field.validation?.required || "این فیلد الزامی است";
  }
  if (field.pattern) {
    rules.pattern = {
      value: new RegExp(field.pattern),
      message: field.validation?.pattern || "فرمت نامعتبر",
    };
  }
  if (field.minLength) {
    rules.minLength = {
      value: field.minLength,
      message: field.validation?.minLength || `حداقل ${field.minLength} کاراکتر`,
    };
  }
  if (field.maxLength) {
    rules.maxLength = {
      value: field.maxLength,
      message: field.validation?.maxLength || `حداکثر ${field.maxLength} کاراکتر`,
    };
  }
  if (field.min != null) {
    rules.min = {
      value: field.min,
      message: field.validation?.min || `حداقل ${field.min}`,
    };
  }
  if (field.max != null) {
    rules.max = {
      value: field.max,
      message: field.validation?.max || `حداکثر ${field.max}`,
    };
  }
  if (field.validation?.match) {
    rules.validate = (v, vals) =>
      v === vals[field.validation.match] || "مقدار با فیلد مورد نظر یکسان نیست";
  }
  return rules;
};

const formatPrice = (v) => {
  if (v == null || v === "") return "";
  return String(v)
    .replace(/\D/g, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
const parsePrice = (v) => (v ? Number(String(v).replace(/,/g, "")) : null);

/* ─── Async SearchSelect (برای customer و ...) ─── */
function SearchSelectField({ field, control, errors, setValue, getValues, disabled }) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const name = field.key;
  const error = errors[name]?.message;
  const spanClass = getSpanClass(field.span);

  const fetchOptions = useCallback(
    async (q = "") => {
      if (!field.asyncSource) return;
      setLoading(true);
      try {
        let url = field.asyncSource;
        const depends = field.dependsOn ? getValues(field.dependsOn) : null;
        if (depends != null) {
          url = url.replace(`{${field.dependsOn}}`, encodeURIComponent(depends));
        }
        if (q) {
          url += (url.includes("?") ? "&" : "?") + `search=${encodeURIComponent(q)}`;
        }
        const res = await api.get(url);
        const data = res?.data ?? res;
        const list = Array.isArray(data) ? data : data?.results || [];
        setOptions(list);
      } catch {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    },
    [field, getValues],
  );

  const depValue = field.dependsOn ? getValues(field.dependsOn) : null;

  useEffect(() => {
    if (field.dependsOn && !depValue) {
      setOptions([]);
      setValue(name, null);
      return;
    }
    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depValue, field.dependsOn, name]);

  const displayValue = (opt) => {
    if (!opt) return "";
    if (field.displayField) return opt[field.displayField] || "";
    return opt.name || opt.title || opt.label || opt.full_name || String(opt.id ?? "");
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
                  fetchOptions(e.target.value);
                }}
                onFocus={() => {
                  setOpen(true);
                  fetchOptions(query);
                }}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
                placeholder={field.placeholder || "جستجو..."}
                disabled={disabled || (field.dependsOn && !getValues(field.dependsOn))}
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
              {open && (
                <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-border bg-surface/95 shadow-lg max-h-60 overflow-auto backdrop-blur-md">
                  {loading ? (
                    <div className="p-3 text-center text-sm text-muted">در حال بارگذاری...</div>
                  ) : options.length === 0 ? (
                    <div className="p-3 text-center text-sm text-muted">موردی یافت نشد</div>
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
                          selected?.id === opt.id ? "bg-primary/10 text-primary" : ""
                        }`}
                      >
                        {displayValue(opt)}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            {error && <p className="mt-1 text-xs text-danger font-medium">{error}</p>}
          </div>
        );
      }}
    />
  );
}

/* ─── Field ─── */
function FieldRenderer({
  field,
  control,
  errors,
  setValue,
  getValues,
  disabled,
}) {
  const name = field.key;
  const error = errors[name]?.message;
  const rules = toRHFRules(field);
  const isDisabled =
    disabled || field.readOnly || (field.dependsOn && !getValues(field.dependsOn));
  const spanClass = getSpanClass(field.span);
  const labelWithStar = field.required
    ? `${field.label || ""} *`
    : field.label;

  // nested_display
  if (field.type === "nested_display") {
    const displayData = getValues(field.key);
    const template = field.displayTemplate || "{full_name}";
    const text =
      typeof displayData === "object" && displayData != null
        ? template.replace(/\{(\w+)\}/g, (_, k) => displayData[k] ?? "")
        : String(displayData ?? "");
    return (
      <div className={spanClass}>
        {field.label && (
          <label className="block text-sm font-medium mb-1.5 text-muted">{field.label}</label>
        )}
        <div className="rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm">
          {text || "—"}
        </div>
      </div>
    );
  }

  // link
  if (field.type === "link") {
    const linkVal = getValues(field.key);
    return (
      <div className={spanClass}>
        {field.label && (
          <label className="block text-sm font-medium mb-1.5 text-muted">{field.label}</label>
        )}
        {linkVal ? (
          <a
            href={linkVal}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <Eye size={14} /> مشاهده لینک
          </a>
        ) : (
          <span className="text-sm text-muted">—</span>
        )}
      </div>
    );
  }

  // search_select (async)
  if (field.type === "search_select") {
    return (
      <SearchSelectField
        field={field}
        control={control}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
        disabled={isDisabled}
      />
    );
  }

  // multi_select → MultiSelect
  if (field.type === "multi_select") {
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
              options={field.options || []}
              value={Array.isArray(value) ? value : []}
              onChange={onChange}
              placeholder={field.placeholder}
              searchable={field.searchable !== false}
              disabled={isDisabled}
              error={error}
            />
          </div>
        )}
      />
    );
  }

  // select → Select
  if (field.type === "select") {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { value, onChange, ref } }) => (
          <div className={spanClass}>
            <Select
              ref={ref}
              label={labelWithStar}
              options={field.options || []}
              value={value ?? ""}
              onChange={onChange}
              placeholder={field.placeholder ||" "}
              searchable={!!field.searchable}
              clearable={!field.required}
              disabled={isDisabled}
              error={error}
            />
          </div>
        )}
      />
    );
  }

  // checkbox
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
            <label htmlFor={name} className="text-sm text-foreground cursor-pointer">
              {field.label}
            </label>
          </div>
        )}
      />
    );
  }

  // file
  if (field.type === "file") {
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

  if (field.type === "date" || field.type === "datetime") {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { value, onChange } }) => (
          <div className={spanClass}>
            <DatePickerInput
              label={labelWithStar}
              value={value || ""}
              onChange={onChange}
              placeholder={field.placeholder || "انتخاب تاریخ"}
            />
            {error && <p className="mt-1 text-xs text-danger font-medium">{error}</p>}
          </div>
        )}
      />
    );
  }

  // textarea
  if (field.type === "textarea") {
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

  // price
  if (field.type === "price") {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { value, onChange, onBlur, ref } }) => (
          <div className={spanClass}>
            <Input
              ref={ref}
              label={labelWithStar}
              type="text"
              value={formatPrice(value)}
              onChange={(e) => onChange(parsePrice(e.target.value))}
              onBlur={onBlur}
              placeholder={field.placeholder}
              error={error}
              disabled={isDisabled}
              dir="ltr"
            />
          </div>
        )}
      />
    );
  }

  // number
  if (field.type === "number") {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { value, onChange, onBlur, ref } }) => (
          <div className={spanClass}>
            <Input
              ref={ref}
              label={labelWithStar}
              type="number"
              value={
                value === undefined || value === null || Number.isNaN(value) ? "" : value
              }
              onChange={(e) => {
                const raw = e.target.value;
                onChange(raw === "" ? "" : Number(raw));
              }}
              onBlur={onBlur}
              placeholder={field.placeholder }
              error={error}
              disabled={isDisabled}
              min={field.min}
              max={field.max}
              step={field.step}
              dir="ltr"
            />
          </div>
        )}
      />
    );
  }

  // text / email / url / phone / password → Input
  const inputType =
    field.type === "password"
      ? "password"
      : field.type === "email"
        ? "email"
        : field.type === "url"
          ? "url"
          : field.type === "phone"
            ? "tel"
            : "text";

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { value, onChange, onBlur, ref } }) => (
        <div className={spanClass}>
          <Input
            ref={ref}
            label={labelWithStar}
            type={inputType}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={field.placeholder}
            error={error}
            disabled={isDisabled}
          />
        </div>
      )}
    />
  );
}

/* ─── conditions ─── */
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

/* ─── Main ─── */
export default function FormRenderer({
  config,
  defaultValues = {},
  mode = "create",
  onSubmit,
  onCancel,
  loading = false,
  extraData = {},
}) {
  const { tabs, fields: flatFields, actions, title, description } = config || {};
  const hasTabs = Array.isArray(tabs) && tabs.length > 0;
  const [activeTab, setActiveTab] = useState(hasTabs ? tabs[0].key : null);

  const allFields = useMemo(() => {
    if (flatFields) return flatFields;
    if (tabs) return tabs.flatMap((t) => t.fields || []);
    return [];
  }, [flatFields, tabs]);

  const formDefaultValues = useMemo(() => {
    const defs = { ...defaultValues };
    allFields.forEach((f) => {
      if (defs[f.key] !== undefined) return;

      if (f.defaultValue === "now") {
        defs[f.key] = todayYmd();
        return;
      }
      if (f.defaultValue !== undefined) {
        defs[f.key] = f.defaultValue;
        return;
      }
      if (f.type === "checkbox") defs[f.key] = false;
      else if (f.type === "multi_select") defs[f.key] = [];
      else if (f.type === "file") defs[f.key] = null;
      else if (f.type === "number") defs[f.key] = "";
      else defs[f.key] = "";
    });
    return defs;
  }, [defaultValues, allFields]);

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: formDefaultValues,
    mode: "onChange",
  });

  const values = watch();

  useEffect(() => {
    reset(formDefaultValues);
  }, [reset, formDefaultValues]);

  useEffect(() => {
    allFields.forEach((field) => {
      if (!field.autoFill || !extraData[field.autoFill.source]) return;
      const src = extraData[field.autoFill.source];
      let val = src[field.autoFill.field];
      if (field.autoFill.transform) {
        try {
          val = field.autoFill.transform(val);
        } catch {
          /* ignore */
        }
      }
      if (val !== undefined && getValues(field.key) !== val) {
        setValue(field.key, val, { shouldValidate: false });
      }
    });
  }, [extraData, allFields, setValue, getValues]);

  useEffect(() => {
    allFields.forEach((field) => {
      if (!field.computed || typeof field.computed !== "function") return;
      try {
        const val = field.computed(values);
        if (val !== undefined && val !== getValues(field.key)) {
          setValue(field.key, val, { shouldValidate: false });
        }
      } catch {
        /* ignore */
      }
    });
  }, [values, allFields, setValue, getValues]);

  useEffect(() => {
    if (!hasTabs) return;
    const visible = tabs.filter((t) => shouldShowTab(t, values));
    if (visible.length && !visible.some((t) => t.key === activeTab)) {
      setActiveTab(visible[0].key);
    }
  }, [hasTabs, tabs, values, activeTab]);

  const visibleTabs = useMemo(() => {
    if (!hasTabs) return [];
    return tabs.filter((t) => shouldShowTab(t, values));
  }, [tabs, values, hasTabs]);

  const renderFields = (fieldList) => (
    <div className="grid grid-cols-12 gap-4">
      {(fieldList || [])
        .filter((f) => shouldShowField(f, values, mode))
        .map((field) => (
          <FieldRenderer
            key={field.key}
            field={field}
            control={control}
            errors={errors}
            setValue={setValue}
            getValues={getValues}
            disabled={loading}
          />
        ))}
    </div>
  );

  if (!config) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full" dir="rtl">
      {title && <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>}
      {description && (
        <p className="text-sm text-muted mb-4">{description}</p>
      )}

      {hasTabs ? (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          variant="underline"
          className="flex-1 min-h-0 flex flex-col"
        >
          <Tabs.List className="shrink-0 mb-2">
            {visibleTabs.map((tab) => (
              <Tabs.Trigger key={tab.key} value={tab.key}>
                {tab.label}
              </Tabs.Trigger>
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

      <div className="shrink-0 flex justify-end gap-2 pt-4 mt-4 border-t border-border">
        <Button
          type="button"
          variant={actions?.cancel?.variant || "ghost"}
          size="sm"
          onClick={onCancel}
          disabled={loading}
        >
          {actions?.cancel?.label || "انصراف"}
        </Button>
        <Button
          type="submit"
          variant={actions?.submit?.variant || "primary"}
          size="sm"
          disabled={loading}
        >
          {loading ? "در حال ذخیره..." : actions?.submit?.label || "ذخیره"}
        </Button>
      </div>
    </form>
  );
}