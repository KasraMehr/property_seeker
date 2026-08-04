import { useState } from "react";
import Button from "@/shared/ui/Button";
import Select from "@/shared/ui/selectors/Select";
import DatePicker from "@/shared/ui/selectors/DatePicker";

const RESULT_OPTIONS = [
  { value: "interested", label: "علاقه‌مند" },
  { value: "no_answer", label: "بدون پاسخ" },
  { value: "follow_up", label: "پیگیری" },
  { value: "visit_booked", label: "قرار بازدید" },
];

const FOLLOWUP_STATUS_OPTIONS = [
  { value: "pending", label: "در انتظار" },
  { value: "done", label: "انجام شده" },
  { value: "cancelled", label: "لغو شده" },
];

export default function RegisterCallForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    result: "",
    followupStatus: "",
    nextDate: "",
    notes: "",
  });

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="نتیجه تماس"
        value={form.result}
        onChange={(v) => update("result", v)}
        options={RESULT_OPTIONS}
        placeholder=""
      />
      <Select
        label="وضعیت پیگیری"
        value={form.followupStatus}
        onChange={(v) => update("followupStatus", v)}
        options={FOLLOWUP_STATUS_OPTIONS}
        placeholder=""
      />
      <DatePicker
        label="تاریخ پیگیری بعدی"
        value={form.nextDate}
        onChange={(v) => update("nextDate", v)}
      />
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">
          یادداشت
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none text-sm"
          placeholder="جزئیات تماس..."
        />
      </div>
      ‍
      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          انصراف
        </Button>
        <Button type="submit" variant="primary">
          ثبت تماس
        </Button>
      </div>
    </form>
  );
}
