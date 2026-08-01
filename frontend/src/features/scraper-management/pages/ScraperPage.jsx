import { useEffect, useState } from "react";
import { Activity, Play, Square, RefreshCw, AlertTriangle, CheckCircle2, Clock, Zap, FileText } from "lucide-react";
import PageHeader from "@/shared/ui/PageHeader";
import Button from "@/shared/ui/Button";
import Table from "@/shared/table/Table";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import { MotionDiv, MotionStagger, MotionItem } from "@/animations/MotionElements";
import scraperService from "@/features/scraper-management/services/scraperService";

const fmtDate = (v) => v ? new Date(v).toLocaleDateString("fa-IR") + " " + new Date(v).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }) : "—";

const StatCard = ({ icon: Icon, label, value, color = "primary" }) => (
  <div className="bg-surface rounded-2xl border border-border shadow-sm p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${color}/10 text-${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  </div>
);

export default function ScraperPage() {
  const [status, setStatus] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, lRes] = await Promise.all([
          scraperService.getStatus(),
          scraperService.getLogs(),
        ]);
        setStatus(sRes.data);
        setLogs(lRes.data ?? []);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const isRunning = status?.is_running ?? false;

  return (
    <MotionDiv className="space-y-8" delay={0.1}>
      <PageHeader
        title="مدیریت استخراج آگهی"
        subtitle="وضعیت و گزارش‌های سیستم جمع‌آوری داده"
        backTo="/admin/dashboard"
        actions={
          <div className="flex items-center gap-2">
            <Button variant={isRunning ? "danger" : "primary"} size="sm" icon={isRunning ? Square : Play}>
              {isRunning ? "توقف" : "شروع"}
            </Button>
            <Button variant="outline" size="sm" icon={RefreshCw}>
              بروزرسانی
            </Button>
          </div>
        }
      />

      <MotionStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MotionItem>
          <StatCard icon={Zap} label="وضعیت" value={isRunning ? "در حال اجرا" : "متوقف"} color={isRunning ? "success" : "neutral"} />
        </MotionItem>
        <MotionItem>
          <StatCard icon={Activity} label="استخراج امروز" value={status?.total_scraped_today ?? 0} color="info" />
        </MotionItem>
        <MotionItem>
          <StatCard icon={AlertTriangle} label="خطاها" value={status?.failed_jobs ?? 0} color="warning" />
        </MotionItem>
        <MotionItem>
          <StatCard icon={Clock} label="آخرین اجرا" value={fmtDate(status?.last_run).split(" ")[0] || "—"} color="accent" />
        </MotionItem>
      </MotionStagger>

      <div className="bg-surface rounded-2xl border border-border shadow-sm p-5 space-y-4">
        <h2 className="text-lg font-bold text-foreground">منابع داده</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table loading={loading}>
            <Table.Header>
              <Table.Column align="right">نام منبع</Table.Column>
              <Table.Column align="center" width="120px">وضعیت</Table.Column>
              <Table.Column align="center" width="140px">زمان پاسخ</Table.Column>
              <Table.Column align="center" width="160px">آخرین موفقیت</Table.Column>
            </Table.Header>
            <Table.Body>
              {(status?.sources ?? []).map((s, i) => (
                <Table.Row key={i}>
                  <Table.Cell align="right"><span className="text-sm font-medium">{s.name}</span></Table.Cell>
                  <Table.Cell align="center">
                    <StatusBadge status={s.status === "ACTIVE" ? "active" : "inactive"} type="generic" variant="soft" size="sm" />
                  </Table.Cell>
                  <Table.Cell align="center"><span className="text-sm">{s.response_time_ms} میلی‌ثانیه</span></Table.Cell>
                  <Table.Cell align="center"><span className="text-sm">{fmtDate(s.last_success)}</span></Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-border shadow-sm p-5 space-y-4">
        <h2 className="text-lg font-bold text-foreground">لاگ‌های اخیر</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table loading={loading}>
            <Table.Header>
              <Table.Column align="center" width="80px">سطح</Table.Column>
              <Table.Column align="right">منبع</Table.Column>
              <Table.Column align="right">پیام</Table.Column>
              <Table.Column align="center" width="160px">تاریخ</Table.Column>
            </Table.Header>
            <Table.Body>
              {logs.map((log) => (
                <Table.Row key={log.id}>
                  <Table.Cell align="center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${log.level === "ERROR" ? "bg-danger/10 text-danger border-danger/20" : "bg-warning/10 text-warning border-warning/20"}`}>
                      {log.level === "ERROR" ? "خطا" : "هشدار"}
                    </span>
                  </Table.Cell>
                  <Table.Cell align="right"><span className="text-sm font-medium">{log.source}</span></Table.Cell>
                  <Table.Cell align="right"><span className="text-sm">{log.message}</span></Table.Cell>
                  <Table.Cell align="center"><span className="text-sm">{fmtDate(log.created_at)}</span></Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </MotionDiv>
  );
}