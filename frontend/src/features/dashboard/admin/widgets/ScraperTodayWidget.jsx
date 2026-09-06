import { Link } from "react-router-dom";
import { Activity, AlertCircle, CheckCircle2, Zap, Target } from "lucide-react";

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
  const runningRunsCount = status?.running_runs_count ?? 0;
  const activeTargetsCount = status?.active_targets_count ?? 0;

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

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-background rounded-xl border border-border space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  اجراهای فعال
                </span>
                <span className="text-xl font-bold text-foreground">
                  {runningRunsCount}
                </span>
              </div>
              <Link
                to="/owner/scraper?tab=runs"
                className="text-xs text-primary hover:underline"
              >
                مشاهده همه اجراها
              </Link>
            </div>

            <div className="p-3 bg-background rounded-xl border border-border space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  تارگت فعال
                </span>
                <span className="text-xl font-bold text-foreground">
                  {activeTargetsCount}
                </span>
              </div>
              <Link
                to="/owner/scraper?tab=targets"
                className="text-xs text-primary hover:underline"
              >
                مشاهده همه تارگت‌ها
              </Link>
            </div>
          </div>

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
