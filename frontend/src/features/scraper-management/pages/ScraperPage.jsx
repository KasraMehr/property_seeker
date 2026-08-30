// src/features/scraper-management/pages/ScraperPage.jsx
import { useState, useCallback, useEffect, useMemo } from "react";
import { Plus, RefreshCw, ShieldAlert, ShieldCheck, Zap } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import PageTabs from "@/shared/page/PageTabs";
import Button from "@/shared/ui/Button";
import ScraperTargetFormModal from "../components/ScraperTargetFormModal";
import TriggerScraperRunModal from "../components/TriggerScraperRunModal";
import TargetPickerModal from "../components/TargetPickerModal";
import TargetsTab from "../components/tabs/TargetsTab";
import RunsTab from "../components/tabs/RunsTab";
import ListingsTab from "../components/tabs/ListingsTab";
import DivarLoginTab from "../components/tabs/DivarLoginTab";
import scraperService from "../services/scraperService";
import { toastService } from "@/lib/toast";

const TABS = [
  { id: "targets", label: "تارگت‌ها" },
  { id: "runs", label: "اجراها" },
  { id: "listings", label: "آگهی‌های استخراج شده" },
  { id: "divar-login", label: "ورود دیوار" },
];

function unwrapList(res) {
  const payload = res?.data ?? res;
  if (Array.isArray(payload)) return payload;
  return payload?.results ?? [];
}

export default function ScraperPage() {
  const [activeTab, setActiveTab] = useState("targets");
  const [formTarget, setFormTarget] = useState(null);
  const [targetsRefreshKey, setTargetsRefreshKey] = useState(0);

  // refresh the current tab
  const [activeHeader, setActiveHeader] = useState(null);

  // fast run in page scope
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTargets, setPickerTargets] = useState([]);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [triggerTarget, setTriggerTarget] = useState(null);
  const [divarSession, setDivarSession] = useState({
    status: "unknown",
    authenticated: false,
  });

  const { setPageHeader } = useOutletContext();

  const onHeaderStateChange = useCallback((state) => {
    setActiveHeader(state);
  }, []);

  const fetchDivarSession = useCallback(async () => {
    try {
      const response = await scraperService.getDivarSession();
      setDivarSession(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      setDivarSession({
        status: "error",
        authenticated: false,
        detail: "دریافت وضعیت نشست دیوار ناموفق بود.",
      });
      return null;
    }
  }, []);

  useEffect(() => {
    fetchDivarSession();
    const timer = window.setInterval(fetchDivarSession, 10000);
    return () => window.clearInterval(timer);
  }, [fetchDivarSession]);

  const openTriggerPicker = useCallback(async () => {
    // if (!divarSession.authenticated) {
    //   toastService.error(
    //     divarSession.status === "challenge"
    //       ? "چالش امنیتی دیوار باید رفع شود"
    //       : "ابتدا وارد حساب دیوار شوید",
    //   );
    //   setActiveTab("divar-login");
    //   return;
    // }
    setPickerOpen(true);
    setPickerLoading(true);
    try {
      const res = await scraperService.getTargets({ page_size: 100 });
      const list = unwrapList(res).filter((t) => t.enabled);
      setPickerTargets(list);
      if (!list.length) {
        toastService.error("تارگت فعالی وجود ندارد");
      }
    } catch (err) {
      console.error(err);
      setPickerTargets([]);
      toastService.error("دریافت تارگت‌ها ناموفق بود");
    } finally {
      setPickerLoading(false);
    }
  }, [divarSession.authenticated, divarSession.status]);

  const sessionLabel =
    divarSession.status === "challenge"
      ? "چالش امنیتی دیوار"
      : divarSession.authenticated
        ? "نشست دیوار فعال"
        : ["checking", "authenticating"].includes(divarSession.status)
          ? "در حال بررسی نشست"
          : "نیاز به ورود دیوار";

  const headerActions = useMemo(
    () => (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("divar-login")}
          className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-colors ${
            divarSession.status === "challenge"
              ? "border-amber-500/30 bg-amber-500/10 text-amber-600"
              : divarSession.authenticated
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                : "border-danger/30 bg-danger/10 text-danger"
          }`}
          title={divarSession.detail}
        >
          {divarSession.authenticated ? (
            <ShieldCheck size={15} />
          ) : (
            <ShieldAlert size={15} />
          )}
          {sessionLabel}
        </button>
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

        <Button
          variant="outline"
          size="sm"
          onClick={openTriggerPicker}
          // disabled={pickerLoading || !divarSession.authenticated}

          disabled={pickerLoading}
        >
          <Zap size={14} />
          اجرای فوری
        </Button>

        <Button variant="primary" size="sm" onClick={() => setFormTarget({})}>
          <Plus size={16} />
          تارگت جدید
        </Button>
      </div>
    ),
    [
      activeHeader,
      divarSession.authenticated,
      divarSession.detail,
      divarSession.status,
      openTriggerPicker,
      pickerLoading,
      sessionLabel,
    ],
  );

  useEffect(() => {
    setPageHeader({
      title: "مدیریت اسکرپر",
      subtitle: "ساخت تارگت، اجرا و مشاهده آگهی‌های استخراج‌شده",
      breadcrumb: [],
      actions: headerActions,
    });
    return () => setPageHeader(null);
  }, [setPageHeader, headerActions]);

  useEffect(() => {
    setActiveHeader(null);
  }, [activeTab]);

  return (
    <>
      <div className="flex h-full flex-col space-y-4">
        <PageTabs items={TABS} value={activeTab} onChange={setActiveTab} />

        <div className="min-h-0 flex-1">
          {activeTab === "targets" && (
            <TargetsTab
              refreshKey={targetsRefreshKey}
              onRunTriggered={() => setActiveTab("runs")}
              onHeaderStateChange={onHeaderStateChange}
            />
          )}
          {activeTab === "runs" && (
            <RunsTab onHeaderStateChange={onHeaderStateChange} />
          )}
          {activeTab === "listings" && (
            <ListingsTab onHeaderStateChange={onHeaderStateChange} />
          )}
          {activeTab === "divar-login" && (
            <DivarLoginTab
              session={divarSession}
              onSessionRefresh={fetchDivarSession}
            />
          )}
        </div>
      </div>

      {/* تارگت جدید */}
      {formTarget !== null && (
        <ScraperTargetFormModal
          isOpen
          onClose={() => setFormTarget(null)}
          target={formTarget?.id ? formTarget : null}
          onSuccess={() => {
            setFormTarget(null);
            setTargetsRefreshKey((k) => k + 1);
            toastService.success("تارگت ذخیره شد");
          }}
        />
      )}

      {/* اجرای فوری — مستقل از تب */}
      <TargetPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        targets={pickerTargets}
        loading={pickerLoading}
        onPick={(target) => {
          setPickerOpen(false);
          setTriggerTarget(target);
        }}
      />

      {triggerTarget && (
        <TriggerScraperRunModal
          isOpen={!!triggerTarget}
          onClose={() => setTriggerTarget(null)}
          target={triggerTarget}
          onSuccess={() => {
            toastService.success("اجرا شروع شد");
            setTriggerTarget(null);
            setActiveTab("runs");
            setTargetsRefreshKey((k) => k + 1);
          }}
        />
      )}
    </>
  );
}
