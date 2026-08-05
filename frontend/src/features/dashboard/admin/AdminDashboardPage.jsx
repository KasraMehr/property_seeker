import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Phone, Home, Clock, AlertCircle, Eye, FileText, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import reportService from "@/features/reports/services/reportService";
import listingService from "@/features/listings/services/listingService";
import Table from "@/shared/table/Table";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import ScoreBadge from "@/shared/ui/badges/ScoreBadge";
import { MotionDiv, MotionStagger, MotionItem } from "@/animations/MotionElements";
import Button from "@/shared/ui/Button";

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

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, lRes] = await Promise.all([
          reportService.getStats(),
          listingService.getAll({ limit: 5 }),
        ]);
        setStats(sRes.data);
        setListings(lRes.data?.results ?? lRes.data ?? []);
      } catch {
        // silently fail for MVP
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statItems = [
    { icon: TrendingUp, label: "کل لیدها", value: stats?.total_leads ?? 0, color: "primary" },
    { icon: Eye, label: "لیدهای امروز", value: stats?.today_leads ?? 0, color: "info" },
    { icon: Home, label: "تبدیل به ملک", value: stats?.converted_properties ?? 0, color: "success" },
    { icon: Users, label: "اپراتورهای فعال", value: stats?.active_operators ?? 0, color: "accent" },
    { icon: Phone, label: "تماس‌های امروز", value: stats?.today_calls ?? 0, color: "special" },
    { icon: Clock, label: "پیگیری‌های در انتظار", value: stats?.pending_followups ?? 0, color: "warning" },
  ];

  return (
    <MotionDiv className="space-y-6 rounded-2xl p-6 " delay={0.1}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">داشبورد مدیریت</h1>
          <p className="text-muted mt-1">آمار کلی سیستم و لیدهای اخیر</p>
        </div>
        <Link to="/admin/listings">
          <Button variant="outline" size="sm" icon={ArrowLeft}>
            مشاهده همه لیدها
          </Button>
        </Link>
      </div>

      <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statItems.map((s, i) => (
          <MotionItem key={i}>
            <StatCard {...s} />
          </MotionItem>
        ))}
      </MotionStagger>

      <div className="bg-surface rounded-2xl border border-border shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">آخرین لیدها</h2>
          <Link to="/admin/listings" className="text-sm text-primary hover:underline">مشاهده همه</Link>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table loading={loading}>
            <Table.Header>
              <Table.Column align="right">عنوان</Table.Column>
              <Table.Column align="center" width="100px">وضعیت</Table.Column>
              <Table.Column align="center" width="80px">امتیاز</Table.Column>
              <Table.Column align="right" width="140px">منطقه</Table.Column>
              <Table.Column align="right" width="140px">قیمت</Table.Column>
            </Table.Header>
            <Table.Body>
              {listings.slice(0, 5).map((l) => (
                <Table.Row key={l.id}>
                  <Table.Cell align="right">
                    <div>
                      <p className="text-sm font-medium">{l.title}</p>
                      <p className="text-xs text-muted">{l.phone || "—"}</p>
                    </div>
                  </Table.Cell>
                  <Table.Cell align="center"><StatusBadge status={l.status} type="property" variant="soft" size="sm" /></Table.Cell>
                  <Table.Cell align="center"><ScoreBadge score={l.score} size="sm" /></Table.Cell>
                  <Table.Cell align="right"><span className="text-sm">{l.district?.name || "—"}</span></Table.Cell>
                  <Table.Cell align="right">
                    <span className="text-sm font-medium">
                      {l.listed_sale_price ? `${(l.listed_sale_price / 1_000_000).toFixed(0)} میلیون` : "—"}
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </MotionDiv>
  );
}