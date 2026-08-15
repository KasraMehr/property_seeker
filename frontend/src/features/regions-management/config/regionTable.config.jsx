import { MapPin, Building2, Users } from "lucide-react";

/**
 * Region (District) Table Columns
 * Backend: locations.District (DistrictSerializer)
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
    width: "w-48",
    searchable: true,
    cell: ({ name }) => (
      <span className="font-medium text-sm">{name}</span>
    ),
  },
  {
    key: "city",
    header: "شهر",
    width: "w-36",
    cell: ({ city_name }) => (
      <span className="text-sm text-muted-foreground">{city_name || "—"}</span>
    ),
  },
  // TODO: backend serializer
  // {
  //   key: "province_name",
  //   header: "استان",
  //   width: "w-32",
  //   cell: ({ province_name }) => <span className="text-xs text-muted-foreground">{province_name || "—"}</span>,
  // },
  // {
  //   key: "agents_count",
  //   header: "مشاوران",
  //   width: "w-24",
  //   cell: ({ agents_count }) => (
  //     <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
  //       <Users className="w-3.5 h-3.5" />
  //       {agents_count ?? 0}
  //     </span>
  //   ),
  // },
  // {
  //   key: "neighborhoods_count",
  //   header: "محله‌ها",
  //   width: "w-24",
  //   cell: ({ neighborhoods_count }) => (
  //     <span className="text-sm text-muted-foreground">{neighborhoods_count ?? 0} محله</span>
  //   ),
  // },
  // {
  //   key: "actions",
  //   header: "",
  //   width: "w-20",
  //   actions: true,
  // },
];