import { formatDate } from "@/utils/formatters";
import { getRoleConfig } from "@/constants/roleConfig";
import RoleBadge from "@/shared/ui/badges/RoleBadge";
import { Phone, Building2, MapPin, Crown } from "lucide-react";

export const USER_TABLE_COLUMNS = [
  {
    key: "full_name",
    title: "کاربر",
    width: "260px",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-9 h-9 rounded-full bg-(--role-subtle)/20 flex items-center justify-center text-(--role-primary) text-sm font-bold shrink-0">
          {row.full_name?.charAt(0) || "?"}
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="font-medium text-sm text-foreground truncate">
            {row.full_name}
          </span>
          <div className="flex items-center gap-1 text-muted text-[11px]">
            <Phone size={10} />
            <span className="dir-ltr">{row.phone}</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: "role",
    title: "نقش",
    width: "110px",
    align: "center",
    sortable: false,
    render: (row) => {
      const roleObj = row.role?.[0];
      return <RoleBadge role={roleObj} variant="soft" size="sm" />;
    },
  },
  {
    key: "is_owner",
    title: "نوع",
    width: "80px",
    align: "center",
    sortable: false,
    render: (row) =>
      row.is_owner ? (
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-500 font-medium">
          <Crown size={10} />
          مالک
        </span>
      ) : (
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-500 font-medium">
          کارمند
        </span>
      ),
  },
  {
    key: "agency",
    title: "آژانس",
    width: "160px",
    sortable: false,
    render: (row) => (
      <div className="flex items-center gap-1 text-muted text-xs">
        <Building2 size={12} />
        <span className="truncate">{row.agency?.name || "—"}</span>
      </div>
    ),
  },
  {
    key: "service_neighborhoods",
    title: "محله‌های خدمت",
    width: "160px",
    sortable: false,
    render: (row) => (
      <div className="flex items-center gap-1 text-muted text-xs">
        <MapPin size={12} />
        <span className="truncate">
          {row.service_neighborhoods?.map((n) => n.name).join("، ") || "—"}
        </span>
      </div>
    ),
  },
  {
    key: "is_active",
    title: "وضعیت",
    width: "80px",
    align: "center",
    sortable: false,
    render: (row) => (
      <span
        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
          row.is_active
            ? "bg-emerald-500/10 text-emerald-500"
            : "bg-rose-500/10 text-rose-500"
        }`}
      >
        {row.is_active ? "فعال" : "غیرفعال"}
      </span>
    ),
  },
  {
    key: "created_at",
    title: "تاریخ ثبت",
    width: "100px",
    align: "center",
    sortable: true,
    render: (row) => (
      <span className="text-xs text-muted">{formatDate(row.created_at)}</span>
    ),
  },
];