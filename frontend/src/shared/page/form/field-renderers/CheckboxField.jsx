import { Controller } from "react-hook-form";
import { getSpanClass } from "../utils/getSpanClass";

export default function CheckboxField({ field, control, isDisabled }) {
  const name = field.key;
  const spanClass = getSpanClass(field.span);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <div className={`${spanClass} flex items-center gap-2 py-2`}>
          <input
            type="checkbox"
            id={name}
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            disabled={isDisabled}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <label htmlFor={name} className="text-sm text-foreground cursor-pointer">
            {field.label}
          </label>
        </div>
      )}
    />
  );
}