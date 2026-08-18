import { Controller } from "react-hook-form";
import MultiSelect from "@/shared/ui/selectors/MultiSelect";
import { getSpanClass } from "../utils/getSpanClass";
import { toRHFRules } from "../utils/toRHFRules";

export default function MultiSelectField({
  field,
  control,
  errors,
  isDisabled,
  labelWithStar,
}) {
  const name = field.key;
  const error = errors[name]?.message;
  const rules = toRHFRules(field);
  const spanClass = getSpanClass(field.span);

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