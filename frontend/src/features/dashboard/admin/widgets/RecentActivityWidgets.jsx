import React, { useState } from "react";
import { Building2, Handshake, ChevronLeft } from "lucide-react";

const TABS = [
  { key: "properties", label: "آخرین فایل‌ها", icon: Building2 },
];

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("fa-IR", { month: "short", day: "numeric" });

export default function RecentActivityWidget({ recent_properties, recent_deals }) {
  const [tab, setTab] = useState("properties");
  const items = tab === "properties" ? recent_properties : recent_deals;
  const labelKey = tab === "properties" ? "title" : "deal_number";

  return (
    <div className="rounded-2xl bg-white p-5 border border-[#E3E8EC] shadow-sm" dir="rtl">
      <div className="flex gap-2 mb-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              tab === t.key ? "bg-[#16202A] text-white" : "text-[#5B6B79] hover:bg-[#F4F6F8]"
            }`}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-2 border-b border-[#F0F2F4] last:border-0"
          >
            <div>
              <p className="text-sm font-semibold text-[#16202A]">{item[labelKey]}</p>
              <p className="text-[11px] text-[#5B6B79] mt-0.5">
                {tab === "properties" ? item.property_code : `${Number(item.price).toLocaleString("fa-IR")} تومان`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#5B6B79]">{fmtDate(item.created_at)}</span>
              <ChevronLeft size={14} className="text-[#5B6B79]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}