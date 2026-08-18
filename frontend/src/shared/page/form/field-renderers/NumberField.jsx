import { Controller } from "react-hook-form";
import Input from "@/shared/ui/Input";
import { getSpanClass } from "../utils/getSpanClass";
import { toRHFRules } from "../utils/toRHFRules";

export default function NumberField({
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
      render={({ field: { value, onChange, onBlur, ref } }) => (
        <div className={spanClass}>
          <Input
            ref={ref}
            label={labelWithStar}
            type="number"
            value={
              value === undefined || value === null || Number.isNaN(value)
                ? ""
                : value
            }
            onChange={(e) => {
              const raw = e.target.value;
              onChange(raw === "" ? "" : Number(raw));
            }}
            onBlur={onBlur}
            placeholder={field.placeholder}
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