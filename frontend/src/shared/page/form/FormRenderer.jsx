import { useEffect, useRef, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/shared/ui/Button";
import Tabs from "@/shared/ui/Tabs";
import FieldRenderer from "./FieldRenderer";
import { todayYmd } from "./utils/todayYmd";
import { shouldShowTab, shouldShowField } from "./conditions";

/* ─── Main ─── */
export default function FormRenderer({
  config,
  defaultValues = {},
  mode = "create",
  onSubmit,
  onCancel,
  loading = false,
  extraData = {},
  onValuesChange,
}) {
  const {
    tabs,
    fields: flatFields,
    actions,
    title,
    description,
  } = config || {};
  const hasTabs = Array.isArray(tabs) && tabs.length > 0;
  const [activeTab, setActiveTab] = useState(hasTabs ? tabs[0].key : null);

  const allFields = useMemo(() => {
    if (flatFields) return flatFields;
    if (tabs) return tabs.flatMap((t) => t.fields || []);
    return [];
  }, [flatFields, tabs]);

  const defaultValuesKey = useMemo(
    () => JSON.stringify(defaultValues ?? {}),
    [defaultValues],
  );

  const formDefaultValues = useMemo(() => {
    const defs = { ...(defaultValues || {}) };
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
  }, [defaultValuesKey, allFields]);

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

  // Notify parent of value changes
  useEffect(() => {
    onValuesChange?.(values);
  }, [values, onValuesChange]);

  const lastResetKey = useRef(null);
  useEffect(() => {
    if (lastResetKey.current === defaultValuesKey) return;
    lastResetKey.current = defaultValuesKey;
    reset(formDefaultValues);
  }, [defaultValuesKey, formDefaultValues, reset]);

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col h-full"
      dir="rtl"
    >
      {title && (
        <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
      )}
      {description && <p className="text-sm text-muted mb-4">{description}</p>}

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
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 pt-3">
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
