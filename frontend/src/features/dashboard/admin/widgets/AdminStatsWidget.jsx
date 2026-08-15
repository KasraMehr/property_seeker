import { motion } from "framer-motion";
import { Users, Home, Shield, UserCog } from "lucide-react";
import { MotionStagger, MotionItem } from "@/animations/MotionElements";

const StatCard = ({ icon: Icon, label, value }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 16 },
      visible: { opacity: 1, y: 0 },
    }}
    className="bg-surface rounded-2xl border border-border shadow-sm p-5 flex items-center gap-4"
  >
    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-(--role-primary)/10 text-(--role-primary)">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  </motion.div>
);

export default function AdminStatsWidget({ stats, loading }) {
  const items = [
    { icon: Home, label: "املاک", value: stats?.properties_count ?? 0 },
    { icon: Users, label: "مشتریان", value: stats?.customers_count ?? 0 },
    { icon: UserCog, label: "کاربران", value: stats?.employees_count ?? 0 },
    { icon: Shield, label: "نقش‌ها", value: stats?.roles_count ?? 0 },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface rounded-2xl border border-border h-24 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <MotionStagger className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((s, i) => (
        <MotionItem key={i}>
          <StatCard {...s} />
        </MotionItem>
      ))}
    </MotionStagger>
  );
}