import { useState, useCallback, useEffect, useMemo } from "react";
import { RefreshCw } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import PageTabs from "@/shared/page/PageTabs";
import Button from "@/shared/ui/Button";
import PropertiesTab from "@/features/properties/components/tabs/PropertiesTab";
import OwnersTab from "@/features/properties/components/tabs/OwnersTab";

const TABS = [
  { id: "properties", label: "املاک" },
  { id: "owners", label: "مالکان" },
];

export default function PropertyFilesPage() {
  const [activeTab, setActiveTab] = useState("properties");
  const [activeHeader, setActiveHeader] = useState(null);

  const { setPageHeader } = useOutletContext();

  const onHeaderStateChange = useCallback((state) => {
    setActiveHeader(state);
  }, []);

  useEffect(() => {
    setActiveHeader(null);
  }, [activeTab]);

  const headerActions = useMemo(
    () => (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => activeHeader?.onRefresh?.()}
          disabled={activeHeader?.loading}
        >
          <RefreshCw
            size={14}
            className={activeHeader?.loading ? "animate-spin" : ""}
          />
          بروزرسانی
        </Button>
        {activeHeader?.actions}
      </div>
    ),
    [activeHeader],
  );

  useEffect(() => {
    setPageHeader({
      title: "مدیریت فایل‌های ملکی",
      subtitle: "مدیریت املاک و مالکان",
      breadcrumb: [],
      actions: headerActions,
    });
    return () => setPageHeader(null);
  }, [setPageHeader, headerActions]);

  return (
    <div className="flex h-full flex-col space-y-4">
      <PageTabs items={TABS} value={activeTab} onChange={setActiveTab} />

      <div className="min-h-0 flex-1">
        {activeTab === "properties" && (
          <PropertiesTab onHeaderStateChange={onHeaderStateChange} />
        )}
        {activeTab === "owners" && (
          <OwnersTab onHeaderStateChange={onHeaderStateChange} />
        )}
      </div>
    </div>
  );
}
