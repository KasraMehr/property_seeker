import  StatusBadge  from "@/shared/ui/badges/StatusBadge";
import RoleBadge  from "@/shared/ui/badges/RoleBadge";
import { formatDate } from "@/utils/formatters";
import { ShieldCheck, ShieldX } from "lucide-react";

/**
 * User Table Columns
 * Backend: accounts.User
 */
export const USER_TABLE_COLUMNS = [
  {
    key: "id",
    header: "شناسه",
    width: "w-14",
    cell: ({ id }) => <span className="text-xs text-muted-foreground font-mono">#{id}</span>,
  },
  {
    key: "full_name",
    header: "نام کامل",
    width: "w-40",
    searchable: true,
    cell: ({ full_name, phone }) => (
      <div className="flex flex-col">
        <span className="font-medium text-sm">{full_name}</span>
        <span className="text-xs text-muted-foreground font-mono ltr">{phone}</span>
      </div>
    ),
  },
  {
    key: "national_id",
    header: "کد ملی",
    width: "w-28",
    searchable: true,
    cell: ({ national_id }) => (
      <span className="text-xs font-mono text-muted-foreground ltr">{national_id || "—"}</span>
    ),
  },
  {
    key: "role",
    header: "نقش",
    width: "w-32",
    cell: ({ role }) => {
      if (!role || !Array.isArray(role) || role.length === 0) return <span className="text-muted-foreground text-xs">بدون نقش</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {role.map((r) => (
            <RoleBadge key={r.id} role={r.name} />
          ))}
        </div>
      );
    },
  },
  {
    key: "is_owner",
    header: "مالک آژانس",
    width: "w-24",
    cell: ({ is_owner }) => (
      is_owner ? (
        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" /> بله
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <ShieldX className="w-3.5 h-3.5" /> خیر
        </span>
      )
    ),
  },
  {
    key: "is_active",
    header: "وضعیت",
    width: "w-24",
    filterKey: "is_active",
    cell: ({ is_active }) => (
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${is_active ? "bg-emerald-500/10 text-emerald-600" : "bg-danger/10 text-danger"}`}>
        {is_active ? "فعال" : "غیرفعال"}
      </span>
    ),
  },
  {
    key: "service_neighborhoods",
    header: "محله‌های سرویس",
    width: "w-36",
    cell: ({ service_neighborhoods }) => (
      <div className="flex flex-wrap gap-1">
        {(service_neighborhoods || []).slice(0, 2).map((n) => (
          <span key={n.id} className="text-xs bg-secondary px-1.5 py-0.5 rounded">{n.name}</span>
        ))}
        {(service_neighborhoods || []).length > 2 && (
          <span className="text-xs text-muted-foreground">+{(service_neighborhoods || []).length - 2}</span>
        )}
      </div>
    ),
  },
  {
    key: "created_at",
    header: "تاریخ ثبت",
    width: "w-28",
    cell: ({ created_at }) => formatDate(created_at, "short"),
  },
  {
    key: "actions",
    header: "",
    width: "w-20",
    actions: true,
  },
];