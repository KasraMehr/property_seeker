import { useCallback, useEffect, useState } from "react";
import { MapPin, RefreshCw } from "lucide-react";
import Button from "@/shared/ui/Button";
import { toastService } from "@/lib/toast";
import scraperService from "../../services/scraperService";

const unwrap = (response) => {
  const payload = response?.data ?? response;
  return Array.isArray(payload) ? payload : payload?.results || [];
};

export default function UnmappedNeighborhoodsTab({ onHeaderStateChange }) {
  const [items, setItems] = useState([]);
  const [zones, setZones] = useState([]);
  const [selection, setSelection] = useState({});
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [neighborhoodsResponse, zonesResponse] = await Promise.all([
        scraperService.getDivarNeighborhoods({
          city_slug: "fardis",
          unmapped: true,
          active: true,
        }),
        scraperService.getZones({ city_slug: "fardis", active: true }),
      ]);
      setItems(unwrap(neighborhoodsResponse));
      setZones(unwrap(zonesResponse));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  useEffect(() => {
    onHeaderStateChange?.({ loading, onRefresh: load });
    return () => onHeaderStateChange?.(null);
  }, [load, loading, onHeaderStateChange]);

  const sync = async () => {
    setLoading(true);
    try {
      const response = await scraperService.syncDivarNeighborhoods("fardis");
      await load();
      toastService.success(
        `${response.data.created_count} محلهٔ جدید از دیوار دریافت شد`,
      );
    } catch (error) {
      console.error(error);
      toastService.error("همگام‌سازی محله‌های دیوار ناموفق بود");
    } finally {
      setLoading(false);
    }
  };

  const save = async (item) => {
    const zone = selection[item.id];
    if (!zone) {
      toastService.error("ابتدا یک زون انتخاب کنید");
      return;
    }
    setSavingId(item.id);
    try {
      await scraperService.mapDivarNeighborhood(item.id, zone);
      setItems((current) => current.filter((row) => row.id !== item.id));
      toastService.success("محله به زون متصل شد");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface" dir="rtl">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div>
          <h3 className="flex items-center gap-2 font-bold text-foreground">
            <MapPin size={18} />
            محله‌های دیوار بدون زون
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            محله‌های جدید تا زمان تعیین زون حذف یا به‌صورت خودکار حدس زده نمی‌شوند.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={sync} disabled={loading}>
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          همگام‌سازی با دیوار
        </Button>
      </div>

      {loading && !items.length ? (
        <div className="p-10 text-center text-sm text-muted-foreground">
          در حال بارگذاری...
        </div>
      ) : !items.length ? (
        <div className="p-10 text-center text-sm text-muted-foreground">
          همهٔ محله‌های فعال به زون متصل هستند.
        </div>
      ) : (
        <div className="divide-y divide-border">
          {items.map((item) => (
            <div
              key={item.id}
              className="grid items-center gap-3 p-4 md:grid-cols-[1fr_1fr_auto]"
            >
              <div>
                <div className="font-medium text-foreground">{item.name}</div>
                <div className="text-xs text-muted-foreground">
                  زون: تعیین نشده
                </div>
              </div>
              <select
                value={selection[item.id] || ""}
                onChange={(event) =>
                  setSelection((current) => ({
                    ...current,
                    [item.id]: event.target.value,
                  }))
                }
                className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground"
              >
                <option value="">انتخاب یکی از ۷ زون</option>
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>
              <Button
                variant="primary"
                size="sm"
                onClick={() => save(item)}
                disabled={savingId === item.id}
              >
                ثبت زون
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
