import { Controller } from "react-hook-form";
import DateTimePickerInput from "@/shared/ui/selectors/DateTimePicker";
import { getSpanClass } from "../utils/getSpanClass";
import { toRHFRules } from "../utils/toRHFRules";

export default function DateTimeField({
  field,
  control,
  errors,
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
      render={({ field: { value, onChange } }) => (
        <div className={spanClass}>
          <DateTimePickerInput
            label={labelWithStar}
            value={value || ""}
            onChange={onChange}
            placeholder={field.placeholder || "انتخاب تاریخ و زمان"}
          />
          {error && <p className="mt-1 text-xs text-danger font-medium">{error}</p>}
        </div>
      )}
    />
  );
}
