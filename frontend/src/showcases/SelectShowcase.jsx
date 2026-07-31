import { useState } from "react";
import { MapPin, Home, Building2, Phone, Users } from "lucide-react";
import Select from "@/shared/ui/Select";
import MultiSelect from "@/shared/ui/MultiSelect";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import { getStatusesByType } from "@/constants/statusConfig";
import ThemeToggle from "@/shared/ThemeToggle";

/**
 * SelectShowcase — visual playground for Select & MultiSelect
 * Uses statusConfig for status options, StatusBadge for display
 */
export default function SelectShowcase() {
  const [theme, setTheme] = useState("light");
  const [role, setRole] = useState("");

  const [singleValue, setSingleValue] = useState("");
  const [searchableValue, setSearchableValue] = useState("");
  const [clearableValue, setClearableValue] = useState("gohardasht");
  const [errorValue, setErrorValue] = useState("");
  const [iconValue, setIconValue] = useState("");
  const [multiValue, setMultiValue] = useState(["new", "contacted"]);
  const [multiSearchValue, setMultiSearchValue] = useState([]);
  const [regionValue, setRegionValue] = useState("");
  const [typeValue, setTypeValue] = useState([]);
  const [statusValue, setStatusValue] = useState([]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const toggleRole = (r) => {
    setRole(r);
    document.documentElement.setAttribute("data-role", r);
  };

  const leadStatuses = getStatusesByType("lead").map((s) => ({
    value: s.value,
    label: s.label,
  }));

  const propertyStatuses = getStatusesByType("property").map((s) => ({
    value: s.value,
    label: s.label,
  }));

  const regions = [
    { value: "gohardasht", label: "گوهردشت", icon: MapPin },
    { value: "mehrshahr", label: "مهرشهر", icon: MapPin },
    { value: "azimiyeh", label: "عظیمیه", icon: MapPin },
    { value: "karaj-center", label: "مرکز شهر", icon: MapPin },
    { value: "meshkindasht", label: "مشکین‌دشت", icon: MapPin },
    { value: "shahriar", label: "شهریار", icon: MapPin },
    { value: "fardis", label: "فردیس", icon: MapPin },
    { value: "mohamadshahr", label: "محمدشهر", icon: MapPin },
  ];

  const propertyTypes = [
    { value: "apartment", label: "آپارتمان", icon: Building2 },
    { value: "villa", label: "ویلا", icon: Home },
    { value: "office", label: "اداری", icon: Building2 },
    { value: "store", label: "مغازه", icon: Building2 },
    { value: "land", label: "زمین", icon: MapPin },
  ];

  const operators = [
    { value: "op-1", label: "علی احمدی" },
    { value: "op-2", label: "سارا رضایی" },
    { value: "op-3", label: "محمد کریمی" },
    { value: "op-4", label: "نیلوفر محمدی" },
    { value: "op-5", label: "رضا نوری" },
    { value: "op-6", label: "فاطمه حسینی" },
    { value: "op-7", label: "امیر تهرانی" },
    { value: "op-8", label: "مریم جعفری" },
  ];

  const card = "bg-surface border border-border rounded-xl p-5";
  const sectionTitle = "text-lg font-semibold mb-4";
  const subtitle = "text-xs font-normal text-muted mr-2";
  const label = "text-[10px] font-semibold text-muted uppercase tracking-wider mb-3";

  return (
    <div className="min-h-screen bg-background text-foreground p-6" data-role={role}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold">Component Showcase</h1>
          <p className="text-sm text-muted mt-1">Select & MultiSelect — All sizes, states & patterns</p>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle/>
          <div className="flex bg-surface border border-border rounded-xl p-1">
            {[
              { key: "", label: "Default" },
              { key: "admin", label: "Admin" },
              { key: "operator", label: "Operator" },
            ].map((r) => (
              <button
                key={r.key}
                onClick={() => toggleRole(r.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  role === r.key ? "bg-foreground text-background" : "text-muted hover:text-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sizes */}
      <section className="mb-10">
        <h2 className={sectionTitle}>
          Select Sizes
          <span className={subtitle}>sm | md | lg</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {["sm", "md", "lg"].map((sz) => (
            <div key={sz} className={card}>
              <div className={label}>size="{sz}"</div>
              <Select label="منطقه" size={sz} options={regions.slice(0, 3)} value={singleValue} onChange={setSingleValue} />
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mb-10">
        <h2 className={sectionTitle}>
          Select Features
          <span className={subtitle}>searchable | clearable | error | icons</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={card}>
            <div className={label}>searchable</div>
            <Select label="اپراتور" searchable options={operators} value={searchableValue} onChange={setSearchableValue} />
          </div>
          <div className={card}>
            <div className={label}>clearable</div>
            <Select label="منطقه" clearable options={regions} value={clearableValue} onChange={setClearableValue} />
          </div>
          <div className={card}>
            <div className={label}>with icons</div>
            <Select label="نوع ملک" options={propertyTypes} value={iconValue} onChange={setIconValue} />
          </div>
          <div className={card}>
            <div className={label}>error state</div>
            <Select label="وضعیت" error={!errorValue ? "لطفا یک گزینه انتخاب کنید" : ""} options={leadStatuses.slice(0, 3)} value={errorValue} onChange={setErrorValue} />
          </div>
        </div>
      </section>

      {/* MultiSelect */}
      <section className="mb-10">
        <h2 className={sectionTitle}>
          MultiSelect
          <span className={subtitle}>chips | checkboxes | select all / clear</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className={card}>
            <div className={label}>basic — from statusConfig</div>
            <MultiSelect label="وضعیت لید" options={leadStatuses} value={multiValue} onChange={setMultiValue} />
            {/* Selected badges */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {multiValue.map((v) => (
                <StatusBadge key={v} status={v} type="lead" variant="soft" size="sm" />
              ))}
            </div>
          </div>
          <div className={card}>
            <div className={label}>searchable + maxDisplay=3</div>
            <MultiSelect label="اپراتورها" searchable maxDisplay={3} options={operators} value={multiSearchValue} onChange={setMultiSearchValue} />
          </div>
          <div className={card}>
            <div className={label}>with icons + size="sm"</div>
            <MultiSelect label="نوع ملک" size="sm" options={propertyTypes} value={typeValue} onChange={setTypeValue} />
          </div>
        </div>
      </section>

      {/* Real-world */}
      <section className="mb-10">
        <h2 className={sectionTitle}>
          Real-world Patterns
          <span className={subtitle}>Filter bar | Form | Assignment</span>
        </h2>

        <div className={card + " mb-4"}>
          <div className={label}>Filter Bar (Leads Page)</div>
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-48">
              <Select label="منطقه" clearable size="sm" options={regions} value={regionValue} onChange={setRegionValue} />
            </div>
            <div className="w-56">
              <MultiSelect label="وضعیت" size="sm" maxDisplay={2} options={leadStatuses} value={statusValue} onChange={setStatusValue} />
            </div>
            <div className="w-48">
              <Select label="اپراتور" clearable searchable size="sm" options={operators} value={searchableValue} onChange={setSearchableValue} />
            </div>
            <button className="h-9 px-4 rounded-lg bg-(--role-primary) text-white text-sm font-medium hover:bg-(--role-primary-hover) transition-colors">
              اعمال فیلتر
            </button>
          </div>
          {/* Active filter badges */}
          {statusValue.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {statusValue.map((v) => (
                <StatusBadge key={v} status={v} type="lead" variant="soft" size="sm" showIcon />
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className={card}>
            <div className={label}>New Lead Form</div>
            <div className="space-y-4">
              <Select label="منطقه" options={regions} value={regionValue} onChange={setRegionValue} />
              <Select label="وضعیت اولیه" options={leadStatuses.slice(0, 3)} value={singleValue} onChange={setSingleValue} />
              <MultiSelect label="علاقه‌مندی‌ها" options={propertyTypes} value={typeValue} onChange={setTypeValue} />
            </div>
          </div>

          <div className={card}>
            <div className={label}>Property Form</div>
            <div className="space-y-4">
              <Select label="نوع ملک" options={propertyTypes} value={iconValue} onChange={setIconValue} />
              <Select label="وضعیت" options={propertyStatuses} value={errorValue} onChange={setErrorValue} />
              <MultiSelect label="امکانات" options={[
                { value: "parking", label: "پارکینگ" },
                { value: "elevator", label: "آسانسور" },
                { value: "pool", label: "استخر" },
                { value: "garden", label: "حیاط" },
                { value: "security", label: "نگهبان" },
              ]} value={statusValue} onChange={setStatusValue} />
            </div>
          </div>
        </div>
      </section>

      {/* State Matrix */}
      <section className="mb-10">
        <h2 className={sectionTitle}>
          State Matrix
          <span className={subtitle}>All states side-by-side</span>
        </h2>
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="text-right p-3 text-xs font-semibold text-muted uppercase">State</th>
                  <th className="text-right p-3 text-xs font-semibold text-muted uppercase">Select</th>
                  <th className="text-right p-3 text-xs font-semibold text-muted uppercase">MultiSelect</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Empty", sel: { value: "", opts: regions.slice(0, 3) }, mul: { value: [], opts: leadStatuses.slice(0, 3) } },
                  { name: "Selected", sel: { value: "gohardasht", opts: regions.slice(0, 3) }, mul: { value: ["new"], opts: leadStatuses.slice(0, 3) } },
                  { name: "Multiple", sel: null, mul: { value: ["new", "contacted", "qualified"], opts: leadStatuses } },
                  { name: "Error", sel: { value: "", opts: regions.slice(0, 3), err: "الزامی" }, mul: { value: [], opts: leadStatuses.slice(0, 3), err: "حداقل یک مورد" } },
                  { name: "Disabled", sel: { value: "", opts: regions.slice(0, 3), dis: true }, mul: { value: [], opts: leadStatuses.slice(0, 3), dis: true } },
                ].map((row, i, arr) => (
                  <tr key={row.name} className={i < arr.length - 1 ? "border-b border-border" : ""}>
                    <td className="p-3 text-xs font-medium text-muted">{row.name}</td>
                    <td className="p-3">
                      {row.sel ? (
                        <Select options={row.sel.opts} value={row.sel.value} onChange={() => {}} size="sm" error={row.sel.err} disabled={row.sel.dis} />
                      ) : (
                        <span className="text-muted text-xs">—</span>
                      )}
                    </td>
                    <td className="p-3">
                      <MultiSelect options={row.mul.opts} value={row.mul.value} onChange={() => {}} size="sm" error={row.mul.err} disabled={row.mul.dis} maxDisplay={2} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}