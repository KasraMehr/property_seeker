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

export default function RegionsPage() {
  const { setPageHeader } = useOutletContext();
  const [activeTab, setActiveTab] = useState("city");

  useEffect(() => {
    setPageHeader({
      title: "مدیریت مناطق",
      subtitle: "تسلط بر مناطق جست و جو",
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
          <Tabs.Trigger value="city" icon={Calendar}>
            شهر
          </Tabs.Trigger>

          <Tabs.Trigger value="district" icon={TrendingUp}>
            منطقه
          </Tabs.Trigger>

          <Tabs.Trigger value="allay" icon={TrendingUp}>
            محله
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="city">
          <PlaceholderTab
            title="مدیریت جست و جو در سراسر شهر"
            icon={Calendar}
          />
        </Tabs.Content>

        <Tabs.Content value="district">
          <PlaceholderTab title="مدیریت منطقه ها" icon={TrendingUp} />
        </Tabs.Content>

        <Tabs.Content value="allay">
          <PlaceholderTab title="مدیریت محله ها" icon={BarChart3} />
        </Tabs.Content>
      </Tabs>
    </MotionDiv>
  );
}
