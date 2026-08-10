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

import Input from "../ui/Input";
import Select from "../ui/selectors/Select";
import MultiSelect from "../ui/selectors/MultiSelect";
import RangeSelect from "../ui/selectors/RangeSelect";
import Button from "../ui/Button";
import Drawer from "../ui/Drawer";

const ICONS = {
  Search,
  Star,
  Filter,
  MapPin,
  Home,
  DollarSign,
  Ruler,
  Shield,
  Circle,
  Image,
  SlidersHorizontal,
};

/**
 * FilterBar — dynamic, schema-driven filter bar
 * Compatible with existing Select, MultiSelect, Input, Drawer APIs
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
    const Icon = ICONS[field.icon] || Filter;

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
      case "search_select":
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

      case "range":
        return (
          <div key={field.key} className="min-w-44">
            <RangeSelect
              label={field.label}
              value={value || { min: field.min, max: field.max }}
              onChange={(v) => onChange(field.key, v)}
              min={field.min}
              max={field.max}
              step={field.step}
              unit={field.unit}
              size="sm"
            />
          </div>
        );

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

      {/* Active chips — always reserve space to prevent layout shift */}
      <div className="min-h-8 flex flex-wrap items-center gap-1.5">
        {activeChips.length > 0 &&
          activeChips.map((chip, i) => (
            <button
              key={`${chip.key}-${chip.value || i}`}
              onClick={() => {
                if (
                  chip.type === "multiselect" ||
                  chip.type === "multi_select"
                ) {
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

      {/* Drawer for advanced filters — uses position instead of size */}
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
