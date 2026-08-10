import { useState } from "react";
import { BarChart3, FileText, Calendar, TrendingUp, Users, Phone, Home, Clock } from "lucide-react";
import PageHeader from "@/shared/page/PageHeader";
import Tabs from "@/shared/ui/Tabs";
import { MotionDiv } from "@/animations/MotionElements";

const PlaceholderTab = ({ title, icon: Icon }) => (
  <div className="bg-surface rounded-2xl border border-border shadow-sm p-10 flex flex-col items-center justify-center gap-4 text-center">
    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
      <Icon className="w-8 h-8" />
    </div>
    <div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <p className="text-muted mt-1">این بخش در حال آماده‌سازی است و به زودی در دسترس قرار می‌گیرد.</p>
    </div>
  </div>
);

export default function ActivityLogPage() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <MotionDiv className="space-y-6" delay={0.1}>
      <PageHeader
        title="تاریخچه ی فعالیت ها"
        subtitle="آنالیز فعالیت ها و جریان های سیستم"
        backTo="/admin/dashboard"
      />

      <Tabs value={activeTab} onChange={setActiveTab} variant="underline">
        <Tabs.List>
          <Tabs.Trigger value="users" icon={Users}>کاربران</Tabs.Trigger>
          <Tabs.Trigger value="properties" icon={TrendingUp}>تبدیل فایل ها</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="users">
          <PlaceholderTab title="آنالیز کابران سیستم" icon={Users} />
        </Tabs.Content>
        <Tabs.Content value="properties">
          <PlaceholderTab title="تبدیل فایل های ملکی" icon={Home} />
        </Tabs.Content>
      </Tabs>
    </MotionDiv>
  );
}