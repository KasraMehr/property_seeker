import { MapPin, Building2, Users } from "lucide-react";

/**
 * Region (District) Table Columns
 * Backend: locations.District
 */
export const REGION_TABLE_COLUMNS = [
  {
    key: "id",
    header: "شناسه",
    width: "w-14",
    cell: ({ id }) => <span className="text-xs text-muted-foreground font-mono">#{id}</span>,
  },
  {
    key: "name",
    header: "نام منطقه",
    width: "w-40",
    searchable: true,
    cell: ({ name }) => (
      <span className="font-medium text-sm">{name}</span>
    ),
  },
  {
    key: "city",
    header: "شهر / استان",
    width: "w-40",
    cell: ({ city }) => (
      <div className="flex flex-col">
        <span className="text-sm">{city?.name || "—"}</span>
        <span className="text-xs text-muted-foreground">{city?.province?.name || "—"}</span>
      </div>
    ),
  },
  {
    key: "agents_count",
    header: "مشاوران",
    width: "w-24",
    cell: ({ agents_count }) => (
      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
        <Users className="w-3.5 h-3.5" />
        {agents_count || 0}
      </span>
    ),
  },
  {
    key: "properties_count",
    header: "فایل‌ها",
    width: "w-24",
    cell: ({ properties_count }) => (
      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
        <Building2 className="w-3.5 h-3.5" />
        {properties_count || 0}
      </span>
    ),
  },
  {
    key: "neighborhoods",
    header: "محله‌ها",
    width: "w-32",
    cell: ({ neighborhoods }) => (
      <div className="flex flex-wrap gap-1">
        {(neighborhoods || []).slice(0, 3).map((n) => (
          <span key={n.id} className="text-xs bg-secondary px-1.5 py-0.5 rounded">
            {n.name}
          </span>
        ))}
        {(neighborhoods || []).length > 3 && (
          <span className="text-xs text-muted-foreground">+{(neighborhoods || []).length - 3}</span>
        )}
      </div>
    ),
  },
  {
    key: "actions",
    header: "",
    width: "w-20",
    actions: true,
  },
];