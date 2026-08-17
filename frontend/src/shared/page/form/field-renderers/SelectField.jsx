import { Controller } from "react-hook-form";
import Select from "@/shared/ui/selectors/Select";
import { getSpanClass } from "../utils/getSpanClass";
import { toRHFRules } from "../utils/toRHFRules";

export default function SelectField({
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
          <Select
            ref={ref}
            label={labelWithStar}
            options={field.options || []}
            value={value ?? ""}
            onChange={onChange}
            placeholder={field.placeholder || " "}
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