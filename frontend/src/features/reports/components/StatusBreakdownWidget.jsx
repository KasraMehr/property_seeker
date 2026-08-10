import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const PALETTE = ["#2F6F5E", "#C99A4B", "#B5484B", "#5B6B79"];

export default function StatusBreakdownWidget({ data, title }) {
  // data = { sale: 10, rent: 5, sold: 3, rented: 2 }  OR  { deals_count, closed_count, cancel_count, commission }
  const entries = Object.entries(data).filter(([, v]) => typeof v === "number" && v >= 0);
  const chartData = entries.map(([name, value]) => ({ name, value }));
  const total = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="rounded-2xl bg-white p-5 border border-[#E3E8EC] shadow-sm" dir="rtl">
      <h3 className="text-sm font-bold text-[#16202A] mb-4">{title}</h3>

      <div className="flex items-center gap-6">
        <div className="h-32 w-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius="60%"
                outerRadius="100%"
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2.5">
          {entries.map(([key, val], i) => (
            <div key={key} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                />
                <span className="text-[#5B6B79] font-medium">{key}</span>
              </span>
              <span className="font-bold text-[#16202A]">
                {Number(val).toLocaleString("fa-IR")}
                <span className="text-[10px] text-[#5B6B79] font-normal mr-1">
                  ({total ? Math.round((val / total) * 100) : 0}٪)
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}