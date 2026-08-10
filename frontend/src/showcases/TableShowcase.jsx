// import { useState, useMemo, useEffect } from "react";
// import { Inbox, Plus } from "lucide-react";

// import Table from "@/shared/table/Table";
// import TablePagination from "@/shared/table/TablePagination";
// import TableActions from "@/shared/table/TableActions";
// import StatusBadge from "@/shared/ui/badges/StatusBadge";
// import ScoreBadge from "@/shared/ui/badges/ScoreBadge";
// import Button from "@/shared/ui/Button";
// import SearchBox from "@/shared/ui/SearchBox";
// import FilterBar from "@/shared/filters/FilterBar";
// import useFilter from "@/shared/filters/useFilter";
// import { LISTING_ALL_FILTERS, FILTER_OPTIONS } from "@/constants/filterConfig";

// const FILTER_SCHEMA_NO_SEARCH = LISTING_ALL_FILTERS.filter(
//   (f) => f.key !== "search",
// );

// const fmtPrice = (row) => {
//   if (row.listed_sale_price) {
//     return row.listed_sale_price >= 1_000_000_000
//       ? `${(row.listed_sale_price / 1_000_000_000).toFixed(1)} میلیارد`
//       : `${(row.listed_sale_price / 1_000_000).toFixed(0)} میلیون`;
//   }

//   if (row.listed_rent_amount) {
//     const rent = `${(row.listed_rent_amount / 1_000_000).toFixed(1)} میلیون`;
//     const deposit = row.deposit_toman || row.listed_deposit_amount;

//     if (deposit) {
//       const d =
//         deposit >= 1_000_000_000
//           ? `${(deposit / 1_000_000_000).toFixed(1)} میلیارد`
//           : `${(deposit / 1_000_000).toFixed(0)} میلیون`;

//       return `ودیعه ${d} / اجاره ${rent}`;
//     }

//     return `${rent} اجاره`;
//   }

//   return "—";
// };

// const fmtYearRoomsFloor = (row) =>
//   `${row.build_year} / ${row.room_count}خ / ط${row.floor_number}`;

// export default function TableShowcase() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [page, setPage] = useState(1);
//   const [selected, setSelected] = useState([]);

//   const pageSize = 5;

//   const {
//     filters,
//     setFilter,
//     clearFilter,
//     clearAll,
//     activeChips,
//     toQueryParams,
//   } = useFilter(LISTING_ALL_FILTERS, FILTER_OPTIONS);

//   const query = useMemo(
//     () => new URLSearchParams(toQueryParams()).toString(),
//     [toQueryParams],
//   );

//   useEffect(() => {
//     let cancel = false;

//     async function fetchData() {
//       setLoading(true);

//       try {
//         const res = await fetch(`/api/listing/list/?${query}`);

//         if (!res.ok) throw new Error("خطا در دریافت داده‌ها");

//         const json = await res.json();

//         if (!cancel) {
//           setData(Array.isArray(json) ? json : json.data || []);
//           setPage(1);
//         }
//       } catch (e) {
//         if (!cancel) setError(e.message);
//       } finally {
//         if (!cancel) setLoading(false);
//       }
//     }

//     fetchData();

//     return () => (cancel = true);
//   }, [query]);

//   const paged = useMemo(() => {
//     const start = (page - 1) * pageSize;

//     return data.slice(start, start + pageSize);
//   }, [data, page]);

//   const totalPages = Math.ceil(data.length / pageSize) || 1;

//   const columns = [
//     {
//       key: "title",
//       title: "عنوان",
//       render: (row) => (
//         <div className="flex items-center gap-3">
//           {row.hs_picture ? (
//             <img
//               src={row.hs_picture}
//               className="w-10 h-10 rounded-lg object-cover shrink-0"
//             />
//           ) : (
//             <div className="w-10 h-10 rounded-lg bg-(--role-subtle)/30 flex items-center justify-center text-muted text-xs">
//               بدون عکس
//             </div>
//           )}

//           <div>
//             <div className="font-medium text-sm">{row.title}</div>

//             <div className="text-xs text-muted">{row.phone}</div>
//           </div>
//         </div>
//       ),
//     },

//     {
//       key: "status",
//       title: "وضعیت",
//       align: "center",
//       sortable:true,
//       render: (row) => (
//         <StatusBadge
//           status={row.status}
//           type="property"
//           variant="soft"
//           size="sm"
//         />
//       ),
//     },

//     {
//       key: "score",
//       title: "امتیاز",
//       align: "center",
//       sortable: true,
//       render: (row) => (
//         <ScoreBadge score={row.score} size="sm" showLabel={false} />
//       ),
//     },

//     {
//       key: "district",
//       title: "منطقه",
//       render: (row) => row.district?.name || "—",
//     },

//     {
//       key: "price",
//       title: "قیمت",
//       render: (row) => (
//         <div className="flex flex-col">
//           <span className="font-medium">{fmtPrice(row)}</span>

//           {row.price_per_meter_toman && (
//             <span className="text-[10px] text-muted">
//               متر:{" "}
//               {new Intl.NumberFormat("fa-IR").format(row.price_per_meter_toman)}
//             </span>
//           )}
//         </div>
//       ),
//     },

//     {
//       key: "build_year",
//       title: "سال / اتاق / طبقه",
//       align: "center",
//       render: (row) => (
//         <span className="text-xs text-muted font-mono">
//           {fmtYearRoomsFloor(row)}
//         </span>
//       ),
//     },
//   ];

//   if (error) {
//     return <div className="p-6 text-center text-danger">{error}</div>;
//   }

//   return (
//     <div className="min-h-screen bg-background p-6 space-y-6" dir="rtl">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-xl font-bold">لیست آگهی‌ها</h1>

//           <p className="text-sm text-muted mt-1">
//             {data.length.toLocaleString("fa-IR")} آگهی
//           </p>
//         </div>

//         <Button variant="primary" size="sm" className="gap-1.5">
//           <Plus size={16} />
//           آگهی جدید
//         </Button>
//       </div>

//       <SearchBox
//         label="جستجو"
//         placeholder="عنوان، شماره تلفن، توضیحات..."
//         debounce={400}
//         onSearch={(v) => setFilter("search", v || "")}
//         className="max-w-md"
//       />

//       <FilterBar
//         schema={FILTER_SCHEMA_NO_SEARCH}
//         options={FILTER_OPTIONS}
//         filters={filters}
//         onChange={setFilter}
//         onClear={clearFilter}
//         onClearAll={clearAll}
//         activeChips={activeChips}
//       />

//       <Table
//         data={paged}

//         columns={columns}

//         loading={loading}

//         selectable

//         onSelectionChange={setSelected}

//         actions={(row) => (
//           <TableActions
//             onView={() => console.log("view", row.id)}

//             onEdit={() => console.log("edit", row.id)}

//             onDelete={() => console.log("delete", row.id)}
//           />
//         )}

//         emptyState={
//           <div className="flex flex-col items-center py-14">
//             <Inbox size={32} className="text-muted mb-3" />

//             <p className="font-medium">آگهی‌ای یافت نشد</p>

//             <Button
//               variant="outline"
//               size="sm"
//               className="mt-4"
//               onClick={clearAll}
//             >
//               حذف فیلترها
//             </Button>
//           </div>
//         }
//       />

//       <TablePagination
//         page={page}

//         totalPages={totalPages}

//         onChange={setPage}
//       />
//     </div>
//   );
// }
