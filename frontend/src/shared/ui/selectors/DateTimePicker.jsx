import { useState, useEffect } from "react";
import DatePickerPackage from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import TimePickerPlugin from "react-multi-date-picker/plugins/time_picker";
import { CalendarClock } from "lucide-react";

const DatePicker = DatePickerPackage.default;
const TimePicker = TimePickerPlugin.default || TimePickerPlugin;

/**
 * Parse ISO datetime string to DateObject
 */
function toPersianDateObject(dateStr) {
  if (!dateStr || dateStr === "now") {
    const now = dateStr === "now" ? new Date() : null;
    if (!now) return null;
    return new DateObject({ date: now, calendar: persian, locale: persian_fa });
  }
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return new DateObject({ date: d, calendar: persian, locale: persian_fa });
  } catch {
    return null;
  }
}

/**
 * Convert DateObject to ISO string
 */
function toISOString(dateObj) {
  if (!dateObj) return "";
  try {
    const g = dateObj.convert(gregorian);
    const y = g.year;
    const m = String(g.month.number).padStart(2, "0");
    const d = String(g.day).padStart(2, "0");
    const h = String(g.hour).padStart(2, "0");
    const min = String(g.minute).padStart(2, "0");
    return `${y}-${m}-${d}T${h}:${min}:00`;
  } catch {
    return "";
  }
}

/**
 * Convert DateObject to display string
 */
function toDisplayStr(dateObj) {
  if (!dateObj) return "";
  try {
    const datePart = dateObj.format("YYYY/MM/DD");
    const timePart = `${String(dateObj.hour).padStart(2, "0")}:${String(dateObj.minute).padStart(2, "0")}`;
    return `${datePart}  -  ${timePart}`;
  } catch {
    return "";
  }
}

/**
 * DateTimePicker — single input, combined date + time popup
 *
 * Output: ISO string "YYYY-MM-DDTHH:mm:ss"
 */
export default function DateTimePickerInput({
  label,
  value,
  onChange,
  placeholder = "انتخاب تاریخ و زمان",
}) {
  const [displayDate, setDisplayDate] = useState(() => toPersianDateObject(value));

  useEffect(() => {
    setDisplayDate(toPersianDateObject(value));
  }, [value]);

  const handleChange = (date) => {
    if (!date) {
      setDisplayDate(null);
      onChange?.("");
      return;
    }
    setDisplayDate(date);
    onChange?.(toISOString(date));
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setDisplayDate(null);
    onChange?.("");
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <div className="relative">
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground z-10">
          <CalendarClock className="w-4 h-4" />
        </div>

        <DatePicker
          value={displayDate}
          onChange={handleChange}
          format="YYYY/MM/DD HH:mm"
          calendar={persian}
          locale={persian_fa}
          portal
          zIndex={9999}
          containerClassName="w-full"
          inputClass="w-full pr-10 pl-10 py-2.5 rounded-xl bg-surface border border-border
            text-foreground placeholder:text-muted text-sm outline-none transition-all
            focus:ring-2 focus:ring-primary/30 focus:border-primary"
          calendarPosition="bottom-right"
          placeholder={placeholder}
          plugins={[
            <TimePicker position="bottom" hideSeconds hStep={1} mStep={5} />,
          ]}
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
