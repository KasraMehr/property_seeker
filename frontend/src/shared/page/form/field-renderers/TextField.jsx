import { Controller } from "react-hook-form";
import Input from "@/shared/ui/Input";
import { getSpanClass } from "../utils/getSpanClass";
import { toRHFRules } from "../utils/toRHFRules";

export default function TextField({
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

  const inputType =
    field.type === "password"
      ? "password"
      : field.type === "email"
        ? "email"
        : field.type === "url"
          ? "url"
          : field.type === "phone"
            ? "tel"
            : "text";

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
            type={inputType}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={field.placeholder}
            error={error}
            disabled={isDisabled}
          />
        </div>
      )}
    />
  );
}