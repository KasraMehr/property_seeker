import { Controller } from "react-hook-form";
import Input from "@/shared/ui/Input";
import { getSpanClass } from "../utils/getSpanClass";
import { toRHFRules } from "../utils/toRHFRules";
import { formatPrice, parsePrice } from "../utils/price";

export default function PriceField({
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