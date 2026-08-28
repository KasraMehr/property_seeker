import { useState, useEffect } from "react";
import DatePickerPackage from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";

const DatePicker = DatePickerPackage.default;

/**
 * Convert gregorian date string (YYYY-MM-DD) to Persian DateObject
 */
function toPersianDateObject(dateStr) {
  if (!dateStr) return null;
  try {
    return new DateObject({
      date: dateStr,
      calendar: gregorian,
      format: "YYYY-MM-DD",
    }).convert(persian);
  } catch {
    return null;
  }
}

export default function DatePickerInput({
  label,
  value,
  onChange,
  placeholder = "انتخاب تاریخ",
}) {
  // Use state instead of useMemo to ensure controlled mode works
  const [displayDate, setDisplayDate] = useState(() => toPersianDateObject(value));

  // Sync with external value changes
  useEffect(() => {
    setDisplayDate(toPersianDateObject(value));
  }, [value]);

  const handleChange = (date) => {
    if (!date) {
      setDisplayDate(null);
      onChange?.("");
      return;
    }
    // Update display immediately
    setDisplayDate(date);
    // Convert to gregorian string for parent
    try {
      const gregorianDate = date.convert(gregorian).format("YYYY-MM-DD");
      onChange?.(gregorianDate);
    } catch {
      onChange?.("");
    }
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <DatePicker
        value={displayDate}
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
          focus:ring-2 focus:ring-primary/30 focus:border-primary"
        calendarPosition="bottom-right"
      />
    </div>
  );
}