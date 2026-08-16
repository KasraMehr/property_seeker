import { useCallback, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";

import DashboardTemplate from "@/shared/templates/dashboard/DashboardTemplate";
import Button from "@/shared/ui/Button";

import dashboardService from "@/features/dashboard/services/dashboardService";
import scraperService from "@/features/scraper-management/services/scraperService";
import listingService from "@/features/listings/services/listingService";

import RecentListingsWidget from "./widgets/RecentListingsWidget";
import AdminStatsWidget from "./widgets/AdminStatsWidget";
import ScraperTodayWidget from "./widgets/ScraperTodayWidget";

const EMPTY_STATS = {
  customers_count: 0,
  employees_count: 0,
  properties_count: 0,
  roles_count: 0,
};

const EMPTY_SCRAPER = {
  is_running: false,
  total_scraped_today: 0,
  failed_jobs: 0,
  discovered_today: 0,
  processed_today: 0,
  sources: [],
  last_run: null,
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { setPageHeader } = useOutletContext();

  const [stats, setStats] = useState(EMPTY_STATS);
  const [loading, setLoading] = useState(true);

  const [scraperStatus, setScraperStatus] = useState(EMPTY_SCRAPER);
  const [scraperLoading, setScraperLoading] = useState(true);

  const [recentListings, setRecentListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setScraperLoading(true);
    setListingsLoading(true);

    const [dashResult, scraperResult, listingsResult] =
      await Promise.allSettled([
        dashboardService.getAdminStats(),
        scraperService.getScraperTodayStatus(),
        listingService.getAll({ page_size: 5 }),
      ]);

    // ─────────────────────────────
    // Dashboard stats
    // ─────────────────────────────
    if (dashResult.status === "fulfilled") {
      const data = dashResult.value?.data ?? dashResult.value ?? {};

      setStats({
        customers_count: data.customers_count ?? 0,
        employees_count: data.employees_count ?? 0,
        properties_count: data.properties_count ?? 0,
        roles_count: data.roles_count ?? 0,
      });
    } else {
      console.error("Dashboard stats error:", dashResult.reason);
      setStats(EMPTY_STATS);
    }

    // ─────────────────────────────
    // Scraper
    // ─────────────────────────────
    if (scraperResult.status === "fulfilled") {
      const data = scraperResult.value?.data ?? scraperResult.value ?? {};

      setScraperStatus({
        ...EMPTY_SCRAPER,
        ...data,
      });
    } else {
      console.error("Scraper error:", scraperResult.reason);
      setScraperStatus(EMPTY_SCRAPER);
    }

    // ─────────────────────────────
    // Recent listings
    // ─────────────────────────────
    if (listingsResult.status === "fulfilled") {
      const response = listingsResult.value?.data ?? listingsResult.value;

      const listings = Array.isArray(response)
        ? response
        : (response?.results ?? []);

      setRecentListings(listings.slice(0, 5));
    } else {
      console.error("Listings error:", listingsResult.reason);
      setRecentListings([]);
    }

    setLoading(false);
    setScraperLoading(false);
    setListingsLoading(false);
  }, []);

  // ─────────────────────────────
  // Page Header
  // ─────────────────────────────
  useEffect(() => {
    setPageHeader({
      title: "داشبورد مدیریت",
      subtitle: "نمای کلی وضعیت سامانه",

      actions: (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={loadAll}
            disabled={loading || scraperLoading || listingsLoading}
          >
            بروزرسانی
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate("/admin/scraper")}
          >
            استخراج فوری
          </Button>
        </div>
      ),
    });

    return () => setPageHeader(null);
  }, [
    setPageHeader,
    loadAll,
    loading,
    scraperLoading,
    listingsLoading,
    navigate,
  ]);

  // ─────────────────────────────
  // Initial load
  // ─────────────────────────────
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return (
    <DashboardTemplate>
      <div className="space-y-6">
        {/* Stats */}
        <AdminStatsWidget stats={stats} loading={loading} />

        {/* Scraper + Recent Listings */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ScraperTodayWidget status={scraperStatus} loading={scraperLoading} />

          <RecentListingsWidget
            listings={recentListings}
            loading={listingsLoading}
          />
        </div>
      </div>
    </DashboardTemplate>
  );
}
