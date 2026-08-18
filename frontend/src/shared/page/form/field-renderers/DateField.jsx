import { Controller } from "react-hook-form";
import DatePickerInput from "@/shared/ui/selectors/DatePicker";
import { getSpanClass } from "../utils/getSpanClass";
import { toRHFRules } from "../utils/toRHFRules";

export default function DateField({
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