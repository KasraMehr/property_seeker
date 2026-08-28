import { useState, useEffect } from "react";
import DatePickerPackage from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";

const DatePicker = DatePickerPackage.default;

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

function toGregorianStr(date) {
  if (!date) return "";
  try {
    const g = date.convert(gregorian);
    const y = g.year;
    const m = String(g.month.number).padStart(2, "0");
    const d = String(g.day).padStart(2, "0");
    return `${y}-${m}-${d}`;
  } catch {
    return "";
  }
}

function toPersianStr(dateStr) {
  if (!dateStr) return "";
  try {
    return new DateObject({
      date: dateStr,
      calendar: gregorian,
      format: "YYYY-MM-DD",
    })
      .convert(persian)
      .format("YYYY/MM/DD");
  } catch {
    return dateStr;
  }
}

/**
 * DateRangePicker — two Pickers, calls onChange on every selection.
 * Debounce lives in useCall / useFollowup hooks to prevent spam.
 */
export default function DateRangePicker({ value, onChange, label }) {
  const range = value || { from: null, to: null };

  const [fromDate, setFromDate] = useState(() =>
    toPersianDateObject(range.from)
  );
  const [toDate, setToDate] = useState(() => toPersianDateObject(range.to));

  useEffect(() => {
    setFromDate(toPersianDateObject(range.from));
  }, [range.from]);
  useEffect(() => {
    setToDate(toPersianDateObject(range.to));
  }, [range.to]);

  const handleFromChange = (date) => {
    if (!date) {
      setFromDate(null);
      onChange?.({ ...range, from: null });
      return;
    }
    setFromDate(date);
    const gStr = toGregorianStr(date);
    if (gStr) onChange?.({ ...range, from: gStr });
  };

  const handleToChange = (date) => {
    if (!date) {
      setToDate(null);
      onChange?.({ ...range, to: null });
      return;
    }
    setToDate(date);
    const gStr = toGregorianStr(date);
    if (gStr) onChange?.({ ...range, to: gStr });
  };

  return (
    <div className="flex items-end gap-1.5 min-w-56">
      <div className="flex-1 min-w-0">
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {label ? `${label} از` : "از"}
        </label>
        <DatePicker
          value={fromDate}
          onChange={handleFromChange}
          calendar={persian}
          locale={persian_fa}
          format="YYYY/MM/DD"
          placeholder="از تاریخ"
          portal
          zIndex={9999}
          containerClassName="w-full"
          inputClass="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted text-sm outline-none transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary"
          calendarPosition="bottom-right"
        />
      </div>
      <div className="flex-1 min-w-0">
        <label className="block text-sm font-medium text-foreground mb-1.5">
          تا
        </label>
        <DatePicker
          value={toDate}
          onChange={handleToChange}
          calendar={persian}
          locale={persian_fa}
          format="YYYY/MM/DD"
          placeholder="تا تاریخ"
          portal
          zIndex={9999}
          containerClassName="w-full"
          inputClass="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted text-sm outline-none transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary"
          calendarPosition="bottom-right"
        />
      </div>
    </div>
  );
}

export function dateRangeChipLabel(range) {
  if (!range?.from && !range?.to) return null;
  const parts = [];
  if (range.from) parts.push(`از ${toPersianStr(range.from)}`);
  if (range.to) parts.push(`تا ${toPersianStr(range.to)}`);
  return parts.join(" — ");
}
