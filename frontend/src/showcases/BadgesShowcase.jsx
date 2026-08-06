// import { useState } from "react";
// import StatusBadge from "@/shared/ui/badges/StatusBadge";
// import ScoreBadge from "@/shared/ui/badges/ScoreBadge";
// import Select from "@/shared/ui/selectors/Select";
// import { getStatusesByType } from "@/constants/statusConfig";
// import ThemeToggle from "@/shared/ThemeToggle";

// /**
//  * visual showcase for all badge components
//  * Renders every variant, size, color, and entity type
//  */
// export default function TestPage() {
//   const [theme, setTheme] = useState("light");
//   const [role, setRole] = useState("");

//   const entityTypes = [
//     "lead",
//     "property",
//     "followup",
//     "user",
//     "call",
//     "generic",
//   ];
//   const variants = ["soft", "solid", "outline", "dot"];
//   const sizes = ["sm", "md", "lg"];

//   const scoreSamples = [
//     { score: 95, label: "Excellent (95)" },
//     { score: 82, label: "Good (82)" },
//     { score: 68, label: "Average (68)" },
//     { score: 45, label: "Below Avg (45)" },
//     { score: 30, label: "Low (30)" },
//     { score: 12, label: "Critical (12)" },
//   ];


//   const toggleTheme = () => {
//     const next = theme === "light" ? "dark" : "light";
//     setTheme(next);
//     document.documentElement.setAttribute("data-theme", next);
//   };

//   const toggleRole = (r) => {
//     setRole(r);
//     document.documentElement.setAttribute("data-role", r);
//   };

//   return (
//     <div
//       className="min-h-screen bg-background text-foreground p-6"
//       data-role={role}
//     >
      
//       {/* Header + Controls */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-border">
//         <div>
//           <h1 className="text-2xl font-bold">Component Showcase</h1>
//           <p className="text-sm text-muted mt-1">
//             StatusBadge & ScoreBadge — All variants, sizes & themes
//           </p>
//         </div>

//         <div className="flex items-center gap-3">
//           {/* Theme Toggle */}
//           <ThemeToggle/>

//           {/* Role Toggle */}
//           <div className="flex bg-surface border border-border rounded-xl p-1">
//             {[
//               { key: "", label: "Default" },
//               { key: "admin", label: "Admin" },
//               { key: "operator", label: "Operator" },
//             ].map((r) => (
//               <button
//                 key={r.key}
//                 onClick={() => toggleRole(r.key)}
//                 className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
//                   role === r.key
//                     ? "bg-foreground text-background"
//                     : "text-muted hover:text-foreground"
//                 }`}
//               >
//                 {r.label}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* StatusBadge Showcase */}
//       <section className="mb-10">
//         <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//           StatusBadge
//           <span className="text-xs font-normal text-muted">
//             4 variants × 3 sizes × 7 semantic colors
//           </span>
//         </h2>

//         {entityTypes.map((type) => {
//           const statuses = getStatusesByType(type);
//           if (!statuses.length) return null;

//           return (
//             <div key={type} className="mb-8">
//               <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
//                 {type} Statuses
//               </h3>

//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//                 {statuses.map((s) => (
//                   <div
//                     key={s.value}
//                     className="bg-surface border border-border rounded-xl p-4"
//                   >
//                     <div className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-3">
//                       {s.value} — {s.color}
//                     </div>

//                     {/* All sizes + variants in one card */}
//                     <div className="flex flex-col gap-3">
//                       {/* Size row */}
//                       <div className="flex items-center gap-2 flex-wrap">
//                         {sizes.map((sz) => (
//                           <StatusBadge
//                             key={sz}
//                             status={s.value}
//                             type={type}
//                             variant="soft"
//                             size={sz}
//                             showIcon
//                           />
//                         ))}
//                       </div>

//                       {/* Variant row */}
//                       <div className="flex items-center gap-2 flex-wrap">
//                         {variants.map((v) => (
//                           <StatusBadge
//                             key={v}
//                             status={s.value}
//                             type={type}
//                             variant={v}
//                             size="sm"
//                             showIcon={v !== "dot"}
//                           />
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           );
//         })}
//       </section>

//       {/* ScoreBadge Showcase */}
//       <section className="mb-10">
//         <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//           ScoreBadge
//           <span className="text-xs font-normal text-muted">
//             Score tiers × 3 sizes
//           </span>
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {scoreSamples.map((sample) => (
//             <div
//               key={sample.score}
//               className="bg-surface border border-border rounded-xl p-4"
//             >
//               <div className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-3">
//                 {sample.label}
//               </div>
//               <div className="flex items-center gap-4">
//                 <ScoreBadge score={sample.score} size="sm" />
//                 <ScoreBadge score={sample.score} size="md" />
//                 <ScoreBadge score={sample.score} size="lg" />
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Real-world Usage Examples*/}
//       <section className="mb-10">
//         <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//           Usage Examples
//           <span className="text-xs font-normal text-muted">
//             Copy-paste ready patterns
//           </span>
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           {/* Table Row */}
//           <div className="bg-surface border border-border rounded-xl p-4">
//             <div className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-3">
//               Table Row
//             </div>
//             <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
//               <span className="text-sm flex-1">علی احمدی</span>
//               <StatusBadge
//                 status="contacted"
//                 type="lead"
//                 variant="soft"
//                 size="sm"
//               />
//               <ScoreBadge score={85} size="sm" showLabel={false} />
//             </div>
//           </div>

//           {/* Card Header */}
//           <div className="bg-surface border border-border rounded-xl p-4">
//             <div className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-3">
//               Card Header
//             </div>
//             <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
//               <StatusBadge
//                 status="sold"
//                 type="property"
//                 variant="solid"
//                 size="sm"
//                 showIcon
//               />
//               <span className="text-sm text-muted">ویلای ۲۵۰ متری گوهردشت</span>
//             </div>
//           </div>

//           {/* Filter Chips */}
//           <div className="bg-surface border border-border rounded-xl p-4">
//             <div className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-3">
//               Filter Chips
//             </div>
//             <div className="flex flex-wrap gap-2 p-3 bg-background rounded-lg border border-border">
//               <StatusBadge
//                 status="follow-up"
//                 type="lead"
//                 variant="soft"
//                 size="sm"
//                 showIcon
//               />
//               <StatusBadge
//                 status="expired"
//                 type="property"
//                 variant="soft"
//                 size="sm"
//                 showIcon
//               />
//               <StatusBadge
//                 status="featured"
//                 type="property"
//                 variant="soft"
//                 size="sm"
//                 showIcon
//               />
//             </div>
//           </div>

//           {/* Toast / Alert */}
//           <div className="bg-surface border border-border rounded-xl p-4">
//             <div className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-3">
//               Toast / Alert
//             </div>
//             <div className="flex flex-col gap-2 p-3 bg-background rounded-lg border border-border">
//               <StatusBadge
//                 status="success"
//                 type="generic"
//                 variant="soft"
//                 size="sm"
//                 showIcon
//               />
//               <StatusBadge
//                 status="error"
//                 type="generic"
//                 variant="soft"
//                 size="sm"
//                 showIcon
//               />
//               <StatusBadge
//                 status="warning"
//                 type="generic"
//                 variant="soft"
//                 size="sm"
//                 showIcon
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Variant Matrix (All in one grid) */}
//       <section className="mb-10">
//         <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//           Variant Matrix
//           <span className="text-xs font-normal text-muted">
//             Every color × every variant
//           </span>
//         </h2>

//         <div className="bg-surface border border-border rounded-xl overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-border bg-background/50">
//                   <th className="text-left p-3 text-xs font-semibold text-muted uppercase">
//                     Color
//                   </th>
//                   {variants.map((v) => (
//                     <th
//                       key={v}
//                       className="text-left p-3 text-xs font-semibold text-muted uppercase"
//                     >
//                       {v}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {[
//                   { status: "info", type: "generic", label: "info" },
//                   { status: "success", type: "generic", label: "success" },
//                   { status: "warning", type: "generic", label: "warning" },
//                   { status: "danger", type: "generic", label: "danger" },
//                   { status: "neutral", type: "generic", label: "neutral" },
//                   { status: "accent", type: "generic", label: "accent" },
//                   { status: "special", type: "generic", label: "special" },
//                 ].map((row) => (
//                   <tr
//                     key={row.label}
//                     className="border-b border-border last:border-0"
//                   >
//                     <td className="p-3 text-xs font-medium text-muted capitalize">
//                       {row.label}
//                     </td>
//                     {variants.map((v) => (
//                       <td key={v} className="p-3">
//                         <StatusBadge
//                           status={row.status}
//                           type={row.type}
//                           variant={v}
//                           size="sm"
//                           showIcon={v !== "dot"}
//                         />
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
