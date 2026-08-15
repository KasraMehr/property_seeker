import { useEffect, useState } from "react";
import { BarChart3, Calendar, TrendingUp } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import Tabs from "@/shared/ui/Tabs";
import { MotionDiv } from "@/animations/MotionElements";

const PlaceholderTab = ({ title, icon: Icon }) => (
  <div className="bg-surface rounded-2xl border border-border shadow-sm p-10 flex flex-col items-center justify-center gap-4 text-center">
    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
      <Icon className="w-8 h-8" />
    </div>

    <div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <p className="text-muted mt-1">
        این بخش در حال آماده‌سازی است و به زودی در دسترس قرار می‌گیرد.
      </p>
    </div>
  </div>
);

export default function ReportsPage() {
  const { setPageHeader } = useOutletContext();
  const [activeTab, setActiveTab] = useState("daily");

  useEffect(() => {
    setPageHeader({
      title: "گزارش‌ها",
      subtitle: "گزارش‌های آماری سیستم",
      breadcrumb: [],
    });

    return () => {
      setPageHeader(null);
    };
  }, [setPageHeader]);

  return (
    <MotionDiv className="space-y-6" delay={0.1}>
      <Tabs value={activeTab} onChange={setActiveTab} variant="underline">
        <Tabs.List>
          <Tabs.Trigger value="daily" icon={Calendar}>
            روزانه
          </Tabs.Trigger>

          <Tabs.Trigger value="weekly" icon={TrendingUp}>
            هفتگی
          </Tabs.Trigger>

          <Tabs.Trigger value="monthly" icon={BarChart3}>
            ماهانه
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="daily">
          <PlaceholderTab title="گزارش روزانه" icon={Calendar} />
        </Tabs.Content>

        <Tabs.Content value="weekly">
          <PlaceholderTab title="گزارش هفتگی" icon={TrendingUp} />
        </Tabs.Content>

        <Tabs.Content value="monthly">
          <PlaceholderTab title="گزارش ماهانه" icon={BarChart3} />
        </Tabs.Content>
      </Tabs>
    </MotionDiv>
  );
}
