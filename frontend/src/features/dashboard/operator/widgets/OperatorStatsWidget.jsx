import { motion } from "framer-motion";
import { Home, Phone, Clock, TrendingUp } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color = "primary" }) => (
  <motion.div
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    className="bg-surface rounded-2xl border border-border shadow-sm p-5 flex items-center gap-4"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${color}/10 text-${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  </motion.div>
);

export default function OperatorStatsWidget({ stats, loading }) {
  const statItems = [
    { icon: Home, label: "لیدهای من", value: stats?.my_leads ?? 0, color: "primary" },
    { icon: Phone, label: "تماس‌های امروز", value: stats?.my_calls_today ?? 0, color: "info" },
    { icon: Clock, label: "پیگیری‌های در انتظار", value: stats?.my_pending_followups ?? 0, color: "warning" },
    { icon: TrendingUp, label: "تبدیل‌های من", value: stats?.my_conversions ?? 0, color: "success" },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface rounded-2xl border border-border shadow-sm p-5 h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
        >
          <StatCard {...s} />
        </motion.div>
      ))}
    </div>
  );
}