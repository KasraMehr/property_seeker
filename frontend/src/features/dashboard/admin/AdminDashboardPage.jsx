import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DashboardTemplate from "@/shared/templates/dashboard/DashboardTemplate";
import Button from "@/shared/ui/Button";
import dashboardService from "@/features/dashboard/services/dashboardService";
import listingService from "@/features/listings/services/listingService";
import scraperService from "@/features/scraper-management/services/scraperService";
import {
  AdminStatsWidget,
  RecentListingsWidget,
  ScraperTodayWidget,
} from "./widgets";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [scraperStatus, setScraperStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [statsRes, listingsRes, scraperRes] = await Promise.allSettled([
        dashboardService.getAdminStats(),
        listingService.getAll({ page_size: 5, ordering: "-created_at" }),
        scraperService.getStatus(),
      ]);

      if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
      if (listingsRes.status === "fulfilled") {
        const data = listingsRes.value.data;
        setListings(data?.results ?? data ?? []);
      }
      if (scraperRes.status === "fulfilled") setScraperStatus(scraperRes.value.data);

      setLoading(false);
    };
    load();
  }, []);

  const headerActions = (
    <Button
      variant="outline"
      size="sm"
      icon={ArrowLeft}
      onClick={() => navigate("/admin/listings")}
    >
      مشاهده همه لیدها
    </Button>
  );

  return (
    <DashboardTemplate
      title="داشبورد مدیریت"
      subtitle="آمار کلی سیستم و لیدهای اخیر"
      headerActions={headerActions}
    >
      <AdminStatsWidget stats={stats} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentListingsWidget listings={listings} loading={loading} />
        </div>
        <div className="lg:col-span-1">
          <ScraperTodayWidget status={scraperStatus} loading={loading} />
        </div>
      </div>
    </DashboardTemplate>
  );
}