import { useCallback, useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import PageTabs from "@/shared/page/PageTabs";
import Button from "@/shared/ui/Button";
import { MotionDiv } from "@/animations/MotionElements";
import { LOCATION_TAB_ITEMS , LOCATION_LEVELS} from "../config";
import LocationLevelPanel from "../components/LocationLevelPanel";

export default function LocationPage() {
  const { setPageHeader } = useOutletContext();
  const [activeTab, setActiveTab] = useState("province");
  const createHandlerRef = useRef(null);

  const registerCreate = useCallback((fn) => {
    createHandlerRef.current = fn;
  }, []);

  useEffect(() => {
    setPageHeader({
      title: "مدیریت مناطق",
      subtitle: "استان، شهر، منطقه و محله",
      breadcrumb: [],
      actions: (
        <Button
          variant="primary"
          size="sm"
          className="gap-1.5"
          onClick={() => createHandlerRef.current?.()}
        >
          <Plus size={16} />
          {LOCATION_LEVELS[activeTab]?.label ?? "مورد"} جدید
        </Button>
      ),
    });
    return () => setPageHeader(null);
  }, [setPageHeader, activeTab]);

  return (
    <MotionDiv className="space-y-4" delay={0.05}>
      <PageTabs
        items={LOCATION_TAB_ITEMS}
        value={activeTab}
        onChange={setActiveTab}
      />

      {/* remount panel on tab change so hook refetches cleanly */}
      <LocationLevelPanel
        key={activeTab}
        levelKey={activeTab}
        onRegisterCreate={registerCreate}
      />
    </MotionDiv>
  );
}
