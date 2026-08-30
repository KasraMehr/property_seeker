import { useState, useEffect, useCallback, useMemo } from "react";
import { User, Phone, Tag, Calendar, FileText, Heart, Pencil, Trash2 } from "lucide-react";
import Modal from "@/shared/ui/modal/Modal";
import Button from "@/shared/ui/Button";
import Tabs from "@/shared/ui/Tabs";
import StatusBadge from "@/shared/ui/badges/StatusBadge";
import useAuth from "@/features/auth/hooks/useAuth";
import {
  CUSTOMER_TYPE_CONFIG,
  CUSTOMER_STATUS_CONFIG,
  CUSTOMER_DETAIL_FIELDS,
} from "@/features/customers/config";
import { DetailFieldGrid } from "@/shared/page/DetailContentRenderer";
import { buildStatusConfig } from "@/constants/status.utils";
import customerPreferenceService from "@/features/customers/services/customerPreferenceService";
import CustomerPreferenceFormModal from "./CustomerPreferenceFormModal";
import { toastService } from "@/lib/toast";

export default function CustomerDetailModal({ isOpen, onClose, customer }) {
  const [activeTab, setActiveTab] = useState("info");
  const { user } = useAuth();
  const isAdmin = Boolean(user?.is_owner);

  const detailFields = useMemo(() => {
    if (isAdmin) return CUSTOMER_DETAIL_FIELDS;
    return CUSTOMER_DETAIL_FIELDS.map((section) => ({
      ...section,
      fields: section.fields.filter((f) => f.key !== "assigned_agent_name"),
    })).filter((section) => section.fields.length > 0);
  }, [isAdmin]);
  const [preferences, setPreferences] = useState([]);
  const [loadingPreferences, setLoadingPreferences] = useState(false);
  const [editPreference, setEditPreference] = useState(null);
  const [showAddPreference, setShowAddPreference] = useState(false);

  const fetchPreferences = useCallback(async () => {
    if (!customer?.id) return;
    setLoadingPreferences(true);
    try {
      const res = await customerPreferenceService.getAll({ customer_id: customer.id });
      setPreferences(res.data);
    } catch (error) {
      console.error("Error fetching preferences:", error);
    } finally {
      setLoadingPreferences(false);
    }
  }, [customer?.id]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab("info");
      fetchPreferences();
    }
  }, [isOpen, customer?.id, fetchPreferences]);

  const handleDeletePreference = async (id) => {
    try {
      await customerPreferenceService.remove(id);
      toastService.success("ترجیحات حذف شد.");
      fetchPreferences();
    } catch (error) {
      toastService.error("خطا در حذف ترجیحات.");
    }
  };

  if (!customer) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="جزئیات مشتری"
      className="h-[75vh]"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 mb-4 pb-4 border-b border-border">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <User className="w-6 h-6 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-foreground">
            {customer.full_name || "نامشخص"}
          </h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs text-muted-foreground font-mono dir-ltr">
              {customer.phone}
            </span>
            {customer.customer_type && (
              <StatusBadge
                config={buildStatusConfig(
                  CUSTOMER_TYPE_CONFIG,
                  customer.customer_type,
                )}
                size="sm"
              />
            )}
            {customer.status && (
              <StatusBadge
                config={buildStatusConfig(
                  CUSTOMER_STATUS_CONFIG,
                  customer.status,
                )}
                size="sm"
              />
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} variant="underline" className="flex-1 min-h-0 flex flex-col">
        <Tabs.List className="mb-2 shrink-0">
          <Tabs.Trigger value="info" icon={User}>اطلاعات</Tabs.Trigger>
          <Tabs.Trigger value="preferences" icon={Heart}>ترجیحات ملک</Tabs.Trigger>
        </Tabs.List>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          <Tabs.Content value="info">
            <DetailFieldGrid data={customer} sections={detailFields} />
          </Tabs.Content>

          <Tabs.Content value="preferences">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-foreground">ترجیحات ملک مشتری</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddPreference(true)}
                >
                  + افزودن ترجیحات
                </Button>
              </div>

              {loadingPreferences ? (
                <div className="py-8 text-center text-muted-foreground text-sm">در حال بارگذاری...</div>
              ) : preferences.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  ترجیحاتی ثبت نشده است.
                </div>
              ) : (
                <div className="space-y-3">
                  {preferences.map((pref) => (
                    <div
                      key={pref.id}
                      className="p-4 rounded-lg border border-border bg-card space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">
                              {pref.deal_type === "sale" && "فروش"}
                              {pref.deal_type === "rent" && "اجاره"}
                              {pref.deal_type === "mortgage" && "رهن"}
                            </span>
                            {pref.property_type && (
                              <span className="text-xs text-muted-foreground">({pref.property_type})</span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground space-y-0.5">
                            {pref.budget_min && (
                              <div>بودجه: {pref.budget_min?.toLocaleString()} تا {pref.budget_max?.toLocaleString()} تومان</div>
                            )}
                            {pref.area_min && (
                              <div>متراژ: {pref.area_min} تا {pref.area_max} متر مربع</div>
                            )}
                            {pref.bedrooms != null && (
                              <div>اتاق خواب: {pref.bedrooms}</div>
                            )}
                            {pref.neighborhoods?.length > 0 && (
                              <div>محله‌ها: {pref.neighborhoods.map((n) => n.name).join("، ")}</div>
                            )}
                            {pref.notes && (
                              <div className="mt-1 text-foreground">{pref.notes}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditPreference(pref)}
                            className="p-1 hover:bg-muted rounded"
                          >
                            <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => handleDeletePreference(pref.id)}
                            className="p-1 hover:bg-destructive/10 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-destructive" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Tabs.Content>
        </div>
      </Tabs>

      {/* Footer */}
      <div className="shrink-0 flex justify-end gap-2 pt-4 border-t border-border">
        <Button variant="outline" size="sm" onClick={onClose}>
          بستن
        </Button>
      </div>

      {/* Edit Preference Modal */}
      <CustomerPreferenceFormModal
        isOpen={!!editPreference}
        onClose={() => setEditPreference(null)}
        preference={editPreference}
        customerId={customer?.id}
        onSuccess={() => {
          fetchPreferences();
          setEditPreference(null);
        }}
      />

      {/* Add Preference Modal */}
      <CustomerPreferenceFormModal
        isOpen={showAddPreference}
        onClose={() => setShowAddPreference(false)}
        customerId={customer?.id}
        onSuccess={() => {
          fetchPreferences();
          setShowAddPreference(false);
        }}
      />
    </Modal>
  );
}
