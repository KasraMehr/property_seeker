import { useState } from "react";
import DatePickerPackage from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";

const DatePicker = DatePickerPackage.default;

export default function DatePickerInput({
  label,
  value,
  onChange,
  placeholder = "انتخاب تاریخ",
}) {
  const [displayValue, setDisplayValue] = useState(value);

  const handleChange = (date) => {
    if (!date) {
      setDisplayValue("");
      onChange?.("");
      return;
    }

    setDisplayValue(date);

    const gregorianDate = date.convert(gregorian).format("YYYY-MM-DD");

    onChange?.(gregorianDate);
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <DatePicker
        value={displayValue}
        onChange={handleChange}
        calendar={persian}
        locale={persian_fa}
        placeholder={placeholder}
        format="YYYY/MM/DD"

        portal
        zIndex={9999}

        containerClassName="w-full"

        inputClass="w-full px-4 py-2.5 rounded-xl bg-surface border border-border
    text-foreground placeholder:text-muted text-sm outline-none transition-all
    focus:ring-2 focus:ring-primary/30 focus:border-primary
  "

        calendarPosition="bottom-right"
      />
    </div>
  );
}
