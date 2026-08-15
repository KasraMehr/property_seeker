import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import DashboardTemplate from "@/shared/templates/dashboard/DashboardTemplate";
import Button from "@/shared/ui/Button";

import listingService from "@/features/listings/services/listingService";
import propertyService from "@/features/properties/services/propertyService";

import {
  AdminStatsWidget,
  RecentListingsWidget,
  ScraperTodayWidget,
} from "./widgets";

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      setLoading(true);

      try {
        /*
         * فقط endpointهای واقعی backend
         *
         * Listing:
         * GET /api/listing/list/
         *
         * Property:
         * GET /api/property/list/
         */

        const [listingsRes, propertiesRes] = await Promise.allSettled([
          listingService.getAll(),
          propertyService.getAll(),
        ]);

        if (!mounted) return;

        // -----------------------------------------
        // Listings
        // -----------------------------------------

        let listingData = [];

        if (listingsRes.status === "fulfilled") {
          const data = listingsRes.value?.data;

          listingData = Array.isArray(data) ? data : (data?.results ?? []);
        }

        setListings(listingData);

        // -----------------------------------------
        // Properties
        // -----------------------------------------

        let propertyData = [];

        if (propertiesRes.status === "fulfilled") {
          const data = propertiesRes.value?.data;

          propertyData = Array.isArray(data) ? data : (data?.results ?? []);
        }

        // -----------------------------------------
        // Local dashboard stats
        // -----------------------------------------

        setStats({
          listings: listingData.length,
          properties: propertyData.length,

          activeListings: listingData.filter(
            (item) => item?.status === "active",
          ).length,

          unreviewedListings: listingData.filter(
            (item) => item?.review_status === "unreviewed",
          ).length,

          promotedListings: listingData.filter(
            (item) => item?.review_status === "promoted",
          ).length,
        });
      } catch (error) {
        /*
         * داشبورد نباید به خاطر خطای یک endpoint
         * کل صفحه را crash کند.
         */
        console.error("Admin dashboard load error:", error);

        if (!mounted) return;

        setListings([]);
        setStats({
          listings: 0,
          properties: 0,
          activeListings: 0,
          unreviewedListings: 0,
          promotedListings: 0,
        });
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const headerActions = (
    <Button
      variant="outline"
      size="sm"
      icon={ArrowLeft}
      onClick={() => navigate("/admin/listings")}
    >
      مشاهده همه آگهی ها
    </Button>
  );

  return (
    <DashboardTemplate title="داشبورد مدیریت" headerActions={headerActions}>
      <div className="space-y-6">
        {/* Stats */}

        <AdminStatsWidget stats={stats} loading={loading} />

        {/* Main widgets */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentListingsWidget
              listings={listings.slice(0, 5)}
              loading={loading}
            />
          </div>

          <div className="lg:col-span-1">
            <ScraperTodayWidget status={null} loading={false} />
          </div>
        </div>
      </div>
    </DashboardTemplate>
  );
}
