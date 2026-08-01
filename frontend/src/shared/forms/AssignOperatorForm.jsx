import { useState } from "react";
import Button from "@/shared/ui/Button";
import Select from "@/shared/ui/Select";
import Input from "@/shared/ui/Input";

const OPERATOR_OPTIONS = [
  { value: "1", label: "علی احمدی" },
  { value: "2", label: "مریم رضایی" },
  { value: "3", label: "حسن محمدی" },
];

const PRIORITY_OPTIONS = [
  { value: "high", label: "بالا" },
  { value: "medium", label: "متوسط" },
  { value: "low", label: "پایین" },
];

export default function AssignOperatorForm({ onSubmit, onCancel }) {
  const [operator, setOperator] = useState("");
  const [priority, setPriority] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ operator, priority, note });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select label="اپراتور" value={operator} onChange={setOperator} options={OPERATOR_OPTIONS} placeholder="انتخاب اپراتور" />
      <Select label="اولویت" value={priority} onChange={setPriority} options={PRIORITY_OPTIONS} placeholder="انتخاب اولویت" />
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">یادداشت</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none text-sm"
          placeholder="توضیحات اختصاص لید..."
        />
      </div>
      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>انصراف</Button>
        <Button type="submit" variant="primary">تخصیص</Button>
      </div>
    </form>
  );
}