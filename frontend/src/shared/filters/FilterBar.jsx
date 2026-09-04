import { useState, useMemo } from "react";
import {
  X,
  Filter,
  Search,
  Star,
  MapPin,
  Home,
  DollarSign,
  Ruler,
  Shield,
  Circle,
  Image,
  SlidersHorizontal,
} from "lucide-react";

import DateRangePicker from "@/shared/ui/selectors/DateRangePicker";
import SearchSelect from "@/shared/ui/selectors/SearchSelect";
import Input from "../ui/Input";
import Select from "../ui/selectors/Select";
import MultiSelect from "../ui/selectors/MultiSelect";
import RangeSelect from "../ui/selectors/RangeSelect";
import Button from "../ui/Button";
import Drawer from "../ui/Drawer";
import LocationCascadeSelect from "@/shared/ui/selectors/LocationCascadeSelect";


/**
 * FilterBar — dynamic, schema-driven filter bar
 */
export default function FilterBar({
  schema = [],
  options = {},
  filters = {},
  onChange,
  onClear,
  onClearAll,
  activeChips = [],
  className = "",
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const topFields = useMemo(() => schema.slice(0, 3), [schema]);
  const drawerFields = useMemo(() => schema.slice(3), [schema]);

  const renderField = (field) => {
    const value = filters[field.key];
    const fieldOptions = options[field.optionsKey] || [];

    switch (field.type) {
      case "search":
        return (
          <div key={field.key} className="relative flex-1 min-w-50">
            <Search
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none z-10"
            />
            <Input
              value={value || ""}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="pr-9 w-full text-sm py-2.5"
            />
          </div>
        );

      case "select":
        return (
          <div key={field.key} className="min-w-35">
            <Select
              options={
                fieldOptions.length > 0 ? fieldOptions : field.options || []
              }
              value={value || ""}
              onChange={(v) => onChange(field.key, v)}
              placeholder={field.label}
              clearable={field.clearable}
              size="sm"
            />
          </div>
        );

      case "search_select":
        if (field.async || field.endpoint) {
          const dependencyValue = field.depends_on
            ? filters[field.depends_on]
            : null;
          let endpoint = field.endpoint;
          if (field.depends_on && endpoint) {
            endpoint = endpoint.replace(
              `{${field.depends_on}}`,
              encodeURIComponent(dependencyValue ?? ""),
            );
          }
          return (
            <div key={field.key} className="min-w-40">
              <SearchSelect
                value={value ?? null}
                onChange={(v, label) => {
                  onChange(field.key, v || null, label);
                  schema
                    .filter((candidate) => candidate.depends_on === field.key)
                    .forEach((candidate) =>
                      onChange(candidate.key, null, null),
                    );
                }}
                endpoint={endpoint}
                placeholder={field.label || field.placeholder || "جستجو..."}
                optionLabel={field.optionLabel || "full_name"}
                optionValue={field.optionValue || "id"}
                clearable
                disabled={!!field.depends_on && !dependencyValue}
              />
            </div>
          );
        }
        return (
          <div key={field.key} className="min-w-35">
            <Select
              options={
                fieldOptions.length > 0 ? fieldOptions : field.options || []
              }
              value={value || ""}
              onChange={(v) => onChange(field.key, v)}
              placeholder={field.label}
              clearable={field.clearable}
              size="sm"
            />
          </div>
        );

      case "multiselect":
      case "multi_select":
        return (
          <div key={field.key} className="min-w-40">
            <MultiSelect
              options={
                fieldOptions.length > 0 ? fieldOptions : field.options || []
              }
              value={value || []}
              onChange={(v) => onChange(field.key, v)}
              placeholder={field.label}
              size="sm"
              maxDisplay={1}
            />
          </div>
        );

      case "range": {
        const rMin = field.min ?? 0;
        const rMax = field.max ?? 100;
        return (
          <div key={field.key} className="w-64 shrink-0">
            <RangeSelect
              label={field.label}
              value={value || { min: rMin, max: rMax }}
              onChange={(v) => onChange(field.key, v)}
              min={rMin}
              max={rMax}
              step={field.step}
              unit={field.unit}
              size="sm"
            />
          </div>
        );
      }

      case "toggle":
        return (
          <label
            key={field.key}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => onChange(field.key, e.target.checked)}
              className="w-4 h-4 rounded border-border text-(--role-primary) focus:ring-(--role-primary)/20"
            />
            <span className="text-sm text-foreground">{field.label}</span>
          </label>
        );

      case "date_range":
        return (
          <DateRangePicker
            key={field.key}
            value={value}
            onChange={(v) => onChange(field.key, v)}
            label={field.label}
          />
        );

      case "location_cascade":
        return (
          <div key={field.key} className="w-full col-span-full">
            {field.label && (
              <p className="mb-2 text-xs font-medium text-muted">
                {field.label}
              </p>
            )}
            <LocationCascadeSelect
              value={value || {}}
              onChange={(next) => onChange(field.key, next)}
              onLabelsChange={(labels) => {
                // Store labels under a special key for chip display
                const parts = [];
                if (labels.province) parts.push(labels.province);
                if (labels.city) parts.push(labels.city);
                if (labels.district) parts.push(labels.district);
                if (labels.neighborhood) parts.push(labels.neighborhood);
                if (parts.length > 0) {
                  onChange(field.key, value, parts.join(" › "));
                }
              }}
              levels={field.levels}
              includeAddress={field.includeAddress === true}
              size="sm"
              layout="grid"
              clearable
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-2">
        {topFields.map(renderField)}

        {drawerFields.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDrawerOpen(true)}
            className="gap-1.5"
          >
            <SlidersHorizontal size={14} />
            فیلتر
            {activeChips.length > 0 && (
              <span className="min-w-4.5 h-4.5 px-1 flex items-center justify-center rounded-full bg-(--role-primary) text-white text-[10px] font-bold">
                {activeChips.length}
              </span>
            )}
          </Button>
        )}

        {activeChips.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-danger hover:text-danger/80 transition-colors mr-auto"
          >
            حذف همه
          </button>
        )}
      </div>

      {/* Active chips */}
      <div className="min-h-8 flex flex-wrap items-center gap-1.5">
        {activeChips.map((chip, i) => (
          <button
            key={`${chip.key}-${chip.value || i}`}
            onClick={() => {
              if (chip.type === "multiselect" || chip.type === "multi_select") {
                const current = filters[chip.key] || [];
                onChange(
                  chip.key,
                  current.filter((v) => String(v) !== String(chip.value)),
                );
              } else {
                onClear(chip.key);
              }
            }}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-(--role-primary)/10 text-(--role-primary) text-xs font-medium hover:bg-(--role-primary)/20 transition-colors"
          >
            {chip.label}
            <X size={12} />
          </button>
        ))}
      </div>

      {/* Drawer for advanced filters */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        header={
          <span className="text-base font-bold text-foreground">
            فیلترهای پیشرفته
          </span>
        }
        position="right"
        footer={
          <div className="flex gap-2">
            {activeChips.length > 0 && (
              <Button
                variant="danger"
                size="sm"
                onClick={onClearAll}
                className="gap-1"
              >
                <X size={14} />
                حذف فیلترها
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={() => setDrawerOpen(false)}
            >
              بستن
            </Button>
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={() => setDrawerOpen(false)}
            >
              اعمال
            </Button>
          </div>
        }
      >
        <div className="space-y-5">{drawerFields.map(renderField)}</div>
      </Drawer>
    </div>
  );
}
