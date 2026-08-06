import { MapPin, Home, Building2, Users, FileText } from "lucide-react";

export const REGION_TABLE_COLUMNS = [
  {
    key: "name",
    title: "منطقه",
    width: "200px",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-(--role-subtle)/20 flex items-center justify-center text-(--role-primary) shrink-0">
          <MapPin size={16} />
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="font-medium text-sm text-foreground truncate">
            {row.name}
          </span>
          <span className="text-[11px] text-muted">
            {row.city?.name || "—"}
          </span>
        </div>
      </div>
    ),
  },
  {
    key: "neighborhoods_count",
    title: "محله‌ها",
    width: "90px",
    align: "center",
    sortable: true,
    render: (row) => (
      <div className="flex items-center justify-center gap-1 text-sm text-foreground">
        <Home size={13} className="text-emerald-500" />
        <span>{row.neighborhoods_count?.toLocaleString("fa-IR") || "۰"}</span>
      </div>
    ),
  },
  {
    key: "addresses_count",
    title: "آدرس‌ها",
    width: "90px",
    align: "center",
    sortable: true,
    render: (row) => (
      <div className="flex items-center justify-center gap-1 text-sm text-foreground">
        <Building2 size={13} className="text-sky-500" />
        <span>{row.addresses_count?.toLocaleString("fa-IR") || "۰"}</span>
      </div>
    ),
  },
  {
    key: "listings_count",
    title: "آگهی‌ها",
    width: "90px",
    align: "center",
    sortable: true,
    render: (row) => (
      <div className="flex items-center justify-center gap-1 text-sm text-foreground">
        <FileText size={13} className="text-violet-500" />
        <span>{row.listings_count?.toLocaleString("fa-IR") || "۰"}</span>
      </div>
    ),
  },
  {
    key: "agents_count",
    title: "کارشناسان",
    width: "100px",
    align: "center",
    sortable: true,
    render: (row) => (
      <div className="flex items-center justify-center gap-1 text-sm text-foreground">
        <Users size={13} className="text-amber-500" />
        <span>{row.agents_count?.toLocaleString("fa-IR") || "۰"}</span>
      </div>
    ),
  },
  {
    key: "top_neighborhoods",
    title: "محلات اصلی",
    width: "220px",
    sortable: false,
    render: (row) => (
      <div className="flex flex-wrap gap-1">
        {row.top_neighborhoods?.slice(0, 3).map((n) => (
          <span
            key={n.id}
            className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium bg-surface border border-border text-muted"
          >
            {n.name}
          </span>
        ))}
        {(row.top_neighborhoods?.length || 0) > 3 && (
          <span className="text-[10px] text-muted px-1">
            +{(row.top_neighborhoods.length - 3).toLocaleString("fa-IR")}
          </span>
        )}
      </div>
    ),
  },
];