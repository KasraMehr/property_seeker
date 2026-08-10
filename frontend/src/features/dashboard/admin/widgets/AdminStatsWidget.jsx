import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Phone,
  Home,
  Clock,
  Eye,
} from "lucide-react";
import { MotionStagger, MotionItem } from "@/animations/MotionElements";

const StatCard = ({ icon: Icon, label, value, color = "primary" }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    className="bg-surface rounded-2xl border border-border shadow-sm p-5 flex items-center gap-4"
  >
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${color}/10 text-${color}`}
    >
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  </motion.div>
);

export default function AdminStatsWidget({ stats, loading }) {
  const statItems = [
    { icon: TrendingUp, label: "کل لیدها", value: stats?.total_leads ?? 0, color: "primary" },
    { icon: Eye, label: "لیدهای امروز", value: stats?.today_leads ?? 0, color: "info" },
    { icon: Home, label: "تبدیل به ملک", value: stats?.converted_properties ?? 0, color: "success" },
    { icon: Users, label: "اپراتورهای فعال", value: stats?.active_operators ?? 0, color: "accent" },
    { icon: Phone, label: "تماس‌های امروز", value: stats?.today_calls ?? 0, color: "special" },
    { icon: Clock, label: "پیگیری‌های در انتظار", value: stats?.pending_followups ?? 0, color: "warning" },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface rounded-2xl border border-border shadow-sm p-5 h-24 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statItems.map((s, i) => (
        <MotionItem key={i}>
          <StatCard {...s} />
        </MotionItem>
      ))}
    </MotionStagger>
  );
}