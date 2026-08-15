import { Activity, AlertCircle, CheckCircle2, Globe } from "lucide-react";

export default function ScraperTodayWidget({ status, loading }) {
  if (loading) {
    return (
      <div className="bg-surface rounded-2xl border border-border shadow-sm p-5 h-64 animate-pulse" />
    );
  }

  const isRunning = status?.is_running;
  const todayScraped = status?.total_scraped_today ?? 0;
  const failedJobs = status?.failed_jobs ?? 0;
  const discovered = status?.discovered_today ?? 0;
  const processed = status?.processed_today ?? 0;
  const sources = status?.sources ?? [];

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm p-5 space-y-4">
      <div className="bg-surface rounded-2xl border border-border shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">استخراج امروز</h2>
          {isRunning ? (
            <span className="flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5" /> در حال اجرا
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-medium text-muted bg-muted/40 px-2 py-1 rounded-lg">
              <AlertCircle className="w-3.5 h-3.5" /> بیکار
            </span>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
            <span className="text-sm text-muted flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              آگهی جدید امروز
            </span>
            <span className="text-xl font-bold text-foreground">
              {todayScraped}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
            <span className="text-sm text-muted">کشف / پردازش</span>
            <span className="text-sm font-semibold text-foreground">
              {discovered} / {processed}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
            <span className="text-sm text-muted flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-danger" />
              خطا
            </span>
            <span
              className={`text-xl font-bold ${
                failedJobs > 0 ? "text-danger" : "text-success"
              }`}
            >
              {failedJobs}
            </span>
          </div>

          {sources.length > 0 && (
            <div className="space-y-2 pt-1">
              <p className="text-xs font-medium text-muted">تارگت‌ها</p>
              <div className="flex flex-wrap gap-2">
                {sources.map((s, index) => (
                  <span
                    key={`${s.name}-${index}`}
                    className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border ${
                      s.status === "ACTIVE"
                        ? "border-success/20 text-success bg-success/5"
                        : "border-border text-muted bg-muted/30"
                    }`}
                  >
                    <Globe className="w-3 h-3" />
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted">
              آخرین اجرا:{" "}
              {status?.last_run
                ? new Date(status.last_run).toLocaleString("fa-IR")
                : "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
