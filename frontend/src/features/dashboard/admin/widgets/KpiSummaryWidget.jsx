import React from "react";
import { Users, Building2, Handshake, Wallet, UserCog, Shield } from "lucide-react";

const ICONS = {
  customers_count: Users,
  employees_count: UserCog,
  properties_count: Building2,
  deals_count: Handshake,
  roles_count: Shield,
  commission: Wallet,
};

const LABELS = {
  customers_count: "مشتریان",
  employees_count: "کارمندان",
  properties_count: "فایل‌ها",
  roles_count: "نقش‌ها",
};

const COLORS = {
  customers_count: { bg: "#E8F5E9", icon: "#2E7D32" },
  employees_count: { bg: "#E3F2FD", icon: "#1565C0" },
  properties_count: { bg: "#FFF3E0", icon: "#E65100" },
  roles_count: { bg: "#ECEFF1", icon: "#455A64" },
};

export default function KpiSummaryWidget({ data }) {
  const keys = Object.keys(LABELS);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4" dir="rtl">
      {keys.map((k) => {
        const Icon = ICONS[k];
        const val = k === "commission" 
          ? `${(data[k] / 1_000_000).toLocaleString("fa-IR")} میلیون` 
          : Number(data[k]).toLocaleString("fa-IR");
        return (
          <div
            key={k}
            className="rounded-2xl bg-white p-4 border border-[#E3E8EC] shadow-sm flex items-center gap-3"
          >
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: COLORS[k].bg }}
            >
              <Icon size={20} color={COLORS[k].icon} />
            </div>
            <div>
              <p className="text-xs text-[#5B6B79] font-medium">{LABELS[k]}</p>
              <p className="text-lg font-extrabold text-[#16202A]">{val}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}