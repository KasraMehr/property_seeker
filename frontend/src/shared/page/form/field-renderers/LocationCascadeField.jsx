import { Controller } from "react-hook-form";
import LocationCascadeSelect from "@/shared/ui/selectors/LocationCascadeSelect";
import { getSpanClass } from "@/shared/page/form/utils/getSpanClass";
import { toRHFRules } from "@/shared/page/form/utils/toRHFRules";

/**
 * FormRenderer field type: "location_cascade"
 *
 * field config example:
 * {
 *   key: "location",           // RHF stores object under this key
 *   type: "location_cascade",
 *   label: "موقعیت",
 *   includeAddress: true,      // optional
 *   levels: ["province","city","district","neighborhood"],
 *   span: 12,
 * }
 *
 * On submit you get values.location = { province, city, district, neighborhood, address? }
 * Map to backend fields in your modal onSubmit (e.g. data.address = data.location?.address).
 */
export default function LocationCascadeField({
  field,
  control,
  errors,
  disabled,
}) {
  const name = field.key;
  const error = errors[name]?.message;
  const spanClass = getSpanClass(field.span ?? 12);

  return (
    <Controller
      name={name}
      control={control}
      rules={toRHFRules(field)}
      render={({ field: { value, onChange } }) => (
        <div className={spanClass}>
          {field.label && (
            <label className="block text-sm font-medium mb-1.5 text-foreground">
              {field.label}
              {field.required && <span className="text-danger mr-1">*</span>}
            </label>
          )}
          <LocationCascadeSelect
            value={value || {}}
            onChange={onChange}
            levels={field.levels}
            includeAddress={field.includeAddress === true}
            size={field.size || "md"}
            layout={field.layout || "grid"}
            clearable={field.clearable !== false}
            disabled={disabled || field.readOnly}
            labels={field.labels}
          />
          {error && (
            <p className="mt-1 text-xs text-danger font-medium">{error}</p>
          )}
        </div>
      )}
    />
  );
}
