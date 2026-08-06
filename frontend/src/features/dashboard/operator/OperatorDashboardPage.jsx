import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, Phone, Clock, TrendingUp, ArrowLeft, Eye, CalendarCheck } from "lucide-react";
import { Link } from "react-router-dom";
import reportService from "@/features/reports/services/reportService";
import listingService from "@/features/listings/services/listingService";
import followupService from "@/features/followups/services/followupService";
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

const fmtDate = (v) => v ? new Date(v).toLocaleDateString("fa-IR") : "—";

export default function OperatorDashboardPage() {
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, lRes, fRes] = await Promise.all([
          reportService.getOperatorStats(),
          listingService.getAll({ limit: 5 }),
          reminderService.getAll({ limit: 5 }),
        ]);
        setStats(sRes.data);
        setLeads(lRes.data?.results ?? lRes.data ?? []);
        setFollowups(fRes.data?.results ?? fRes.data ?? []);
      } catch {
        // silently fail for MVP
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statItems = [
    { icon: Home, label: "لیدهای من", value: stats?.my_leads ?? 0, color: "primary" },
    { icon: Phone, label: "تماس‌های امروز", value: stats?.my_calls_today ?? 0, color: "info" },
    { icon: Clock, label: "پیگیری‌های در انتظار", value: stats?.my_pending_followups ?? 0, color: "warning" },
    { icon: TrendingUp, label: "تبدیل‌های من", value: stats?.my_conversions ?? 0, color: "success" },
  ];

  return (
    <MotionDiv className="space-y-6 rounded-2xl p-6 " delay={0.1}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">داشبورد اپراتور</h1>
          <p className="text-muted mt-1">آمار شخصی و وظایف روزانه</p>
        </div>
        <Link to="/operator/leads">
          <Button variant="outline" size="sm" icon={ArrowLeft}>
            مشاهده لیدها
          </Button>
        </Link>
      </div>

      <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((s, i) => (
          <MotionItem key={i}>
            <StatCard {...s} />
          </MotionItem>
        ))}
      </MotionStagger>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface rounded-2xl border border-border shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">لیدهای اخیر من</h2>
            <Link to="/operator/leads" className="text-sm text-primary hover:underline">مشاهده همه</Link>
          </div>
          <div className="overflow-x-auto rounded-xl border border-border">
            <Table loading={loading}>
              <Table.Header>
                <Table.Column align="right">عنوان</Table.Column>
                <Table.Column align="center" width="100px">وضعیت</Table.Column>
                <Table.Column align="center" width="80px">امتیاز</Table.Column>
              </Table.Header>
              <Table.Body>
                {leads.slice(0, 5).map((l) => (
                  <Table.Row key={l.id}>
                    <Table.Cell align="right">
                      <div>
                        <p className="text-sm font-medium">{l.title}</p>
                        <p className="text-xs text-muted">{l.district?.name || "—"}</p>
                      </div>
                    </Table.Cell>
                    <Table.Cell align="center"><StatusBadge status={l.status} type="property" variant="soft" size="sm" /></Table.Cell>
                    <Table.Cell align="center"><ScoreBadge score={l.score} size="sm" /></Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>

        <div className="bg-surface rounded-2xl border border-border shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">پیگیری‌های در انتظار</h2>
            <Link to="/operator/followups" className="text-sm text-primary hover:underline">مشاهده همه</Link>
          </div>
          <div className="overflow-x-auto rounded-xl border border-border">
            <Table loading={loading}>
              <Table.Header>
                <Table.Column align="right">عنوان</Table.Column>
                <Table.Column align="center" width="120px">تاریخ</Table.Column>
                <Table.Column align="center" width="100px">وضعیت</Table.Column>
              </Table.Header>
              <Table.Body>
                {followups.filter((f) => f.status === "pending").slice(0, 5).map((f) => (
                  <Table.Row key={f.id}>
                    <Table.Cell align="right">
                      <div>
                        <p className="text-sm font-medium">{f.title}</p>
                        <p className="text-xs text-muted line-clamp-1">{f.description || "—"}</p>
                      </div>
                    </Table.Cell>
                    <Table.Cell align="center"><span className="text-sm">{fmtDate(f.due_at)}</span></Table.Cell>
                    <Table.Cell align="center"><StatusBadge status={f.status} type="followup" variant="soft" size="sm" /></Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
    </MotionDiv>
  );
}