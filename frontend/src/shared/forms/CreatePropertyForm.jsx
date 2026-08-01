import { useState } from "react";
import Button from "@/shared/ui/Button";
import Select from "@/shared/ui/Select";
import Input from "@/shared/ui/Input";

const REGION_OPTIONS = [
  { value: "1", label: "منطقه ۱ کرج" },
  { value: "2", label: "منطقه ۲ کرج" },
  { value: "3", label: "منطقه ۳ کرج" },
  { value: "4", label: "منطقه ۴ کرج" },
  { value: "5", label: "منطقه ۵ کرج" },
];

const TYPE_OPTIONS = [
  { value: "APARTMENT", label: "آپارتمان" },
  { value: "VILLA", label: "ویلا" },
  { value: "COMMERCIAL", label: "تجاری" },
];

export default function CreatePropertyForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ title: "", region: "", price: "", area: "", type: "", description: "" });

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="عنوان ملک" value={form.title} onChange={(v) => update("title", v)} placeholder="مثلاً آپارتمان ۱۲۰ متری عظیمیه" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select label="منطقه" value={form.region} onChange={(v) => update("region", v)} options={REGION_OPTIONS} placeholder="انتخاب منطقه" />
        <Select label="نوع ملک" value={form.type} onChange={(v) => update("type", v)} options={TYPE_OPTIONS} placeholder="انتخاب نوع" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="قیمت (تومان)" type="number" value={form.price} onChange={(v) => update("price", v)} placeholder="مثلاً ۵۰۰۰۰۰۰۰۰" />
        <Input label="متراژ" type="number" value={form.area} onChange={(v) => update("area", v)} placeholder="مثلاً ۱۲۰" />
      </div>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">توضیحات</label>
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none text-sm"
          placeholder="توضیحات تکمیلی ملک..."
        />
      </div>
      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>انصراف</Button>
        <Button type="submit" variant="primary">ایجاد پرونده</Button>
      </div>
    </form>
  );
}