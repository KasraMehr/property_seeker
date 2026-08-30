import { useState, useEffect } from "react";
import DatePickerPackage from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
const TimePickerPlugin = TimePicker.default || TimePicker;
import { Clock } from "lucide-react";

const DatePicker = DatePickerPackage.default;

/**
 * Parse HH:mm string to DateObject with time
 */
function toTimeDateObject(timeStr) {
  if (!timeStr) return null;
  try {
    const [h, m] = timeStr.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return null;
    return new DateObject({
      calendar: persian,
      locale: persian_fa,
      hour: h,
      minute: m,
      second: 0,
    });
  } catch {
    return null;
  }
}

/**
 * Convert DateObject to HH:mm string
 */
function toTimeString(dateObj) {
  if (!dateObj) return "";
  try {
    const h = String(dateObj.hour).padStart(2, "0");
    const m = String(dateObj.minute).padStart(2, "0");
    return `${h}:${m}`;
  } catch {
    return "";
  }
}

/**
 * TimePickerInput — standalone time picker using react-multi-date-picker
 *
 * Props:
 *   label       – field label
 *   value       – "HH:mm" string (controlled)
 *   onChange     – (HH:mm) => void
 *   placeholder – placeholder text
 */
export default function TimePickerInput({
  label,
  value,
  onChange,
  placeholder = "انتخاب زمان",
}) {
  const [displayDate, setDisplayDate] = useState(() => toTimeDateObject(value));

  useEffect(() => {
    setDisplayDate(toTimeDateObject(value));
  }, [value]);

  const handleChange = (date) => {
    if (!date) {
      setDisplayDate(null);
      onChange?.("");
      return;
    }
    setDisplayDate(date);
    onChange?.(toTimeString(date));
  };

  const handleClear = () => {
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
          <Clock className="w-4 h-4" />
        </div>

        <DatePicker
          value={displayDate}
          onChange={handleChange}
          format="HH:mm"
          calendar={persian}
          locale={persian_fa}
          portal
          zIndex={9999}
          containerClassName="w-full"
          inputClass="w-full pr-10 pl-4 py-2.5 rounded-xl bg-surface border border-border
            text-foreground placeholder:text-muted text-sm outline-none transition-all
            focus:ring-2 focus:ring-primary/30 focus:border-primary
            ltr text-center"
          calendarPosition="bottom-right"
          placeholder={placeholder}
          plugins={[
            <TimePickerPlugin position="bottom" hideSeconds hStep={1} mStep={5} />,
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
