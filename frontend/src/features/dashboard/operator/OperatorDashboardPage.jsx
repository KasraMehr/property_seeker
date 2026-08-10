import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DashboardTemplate from "@/shared/templates/dashboard/DashboardTemplate";
import Button from "@/shared/ui/Button";
import dashboardService from "@/features/dashboard/services/dashboardService";
import listingService from "@/features/listings/services/listingService";
import followupService from "@/features/followups/services/followupService";
import {
  OperatorStatsWidget,
  MyRecentLeadsWidget,
  PendingFollowupsWidget,
} from "./widgets";

export default function OperatorDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [statsRes, leadsRes, followupsRes] = await Promise.allSettled([
        dashboardService.getOperatorStats(),
        listingService.getAll({ page_size: 5, ordering: "-created_at" }),
        followupService.getAll({ page_size: 25 }),
      ]);

      if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
      if (leadsRes.status === "fulfilled") {
        const data = leadsRes.value.data;
        setLeads(data?.results ?? data ?? []);
      }
      if (followupsRes.status === "fulfilled") {
        const data = followupsRes.value.data;
        setFollowups(data?.results ?? data ?? []);
      }

      setLoading(false);
    };
    load();
  }, []);

  const headerActions = (
    <Button
      variant="outline"
      size="sm"
      icon={ArrowLeft}
      onClick={() => navigate("/operator/listings")}
    >
      مشاهده لیدها
    </Button>
  );

  return (
    <DashboardTemplate
      title="داشبورد اپراتور"
      subtitle="آمار شخصی و وظایف روزانه"
      headerActions={headerActions}
    >
      <OperatorStatsWidget stats={stats} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MyRecentLeadsWidget leads={leads} loading={loading} />
        <PendingFollowupsWidget followups={followups} loading={loading} />
      </div>
    </DashboardTemplate>
  );
}