import { useState, useCallback, useMemo } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { QUICK_CALL_FORM } from "@/features/calls/config";
import callService from "@/features/calls/services/callService";
import useAuthStore from "@/store/useAuthStore";
import { toastService } from "@/lib/toast";
import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export default function QuickCallModal({
  isOpen,
  onClose,
  relatedListing = null,
  relatedProperty = null,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [personMode, setPersonMode] = useState("customer");
  const user = useAuthStore((s) => s.user);

  /* ─── Build form config dynamically based on personMode ─── */
  const formConfig = useMemo(() => {
    const config = JSON.parse(JSON.stringify(QUICK_CALL_FORM));

    // Find and replace the customer field
    const customerFieldIdx = config.fields.findIndex((f) => f.key === "customer");
    if (customerFieldIdx !== -1) {
      const customerField = config.fields[customerFieldIdx];

      if (personMode === "owner") {
        config.fields[customerFieldIdx] = {
          ...customerField,
          asyncSource: API_ENDPOINTS.OWNERS.LIST.url,
          placeholder: "جستجوی مالک...",
          label: "مالک",
        };
      } else {
        config.fields[customerFieldIdx] = {
          ...customerField,
          asyncSource: API_ENDPOINTS.CUSTOMERS.LIST.url,
          placeholder: "جستجوی مشتری...",
          label: "مشتری",
        };
      }
    }

    return config;
  }, [personMode]);

  /* ─── Resolve owner → customer (only on submit) ─── */
  const resolveOwnerToCustomer = useCallback(async (ownerId) => {
    const ownerRes = await api.get(API_ENDPOINTS.OWNERS.DETAIL(ownerId).url);
    const owner = ownerRes.data;

    const searchRes = await api.get(API_ENDPOINTS.CUSTOMERS.LIST.url, {
      params: { search: owner.phone },
    });
    const customers = Array.isArray(searchRes.data)
      ? searchRes.data
      : searchRes.data?.results || [];
    const existingCustomer = customers.find((c) => c.phone === owner.phone);

    if (existingCustomer) {
      return existingCustomer.id;
    }

    const newCustomerPayload = {
      full_name: owner.full_name,
      phone: owner.phone,
      customer_type: "landlord",
      status: "new",
      source: "owner",
      notes: `ساخته شده از مالک (شناسه: ${owner.id})`,
    };

    const createRes = await api.post(
      API_ENDPOINTS.CUSTOMERS.CREATE.url,
      newCustomerPayload,
    );
    return createRes.data.id;
  }, []);

  /* ─── Submit ─── */
  const handleSubmit = async (data) => {
    setLoading(true);

    try {
      let customerId = Number(data.customer);

      // If owner mode, resolve owner → customer first
      if (personMode === "owner" && customerId) {
        customerId = await resolveOwnerToCustomer(customerId);
      }

      if (!customerId) {
        toastService.error("لطفاً یک شخص انتخاب کنید.");
        setLoading(false);
        return;
      }

      const payload = {
        customer: customerId,
        call_type: data.call_type,
        result: data.result,
        note: data.note || "",
        called_at: data.called_at
          ? new Date(data.called_at).toISOString()
          : new Date().toISOString(),
        listing: relatedListing?.id || null,
        property: relatedProperty?.id || null,
      };

      if (user?.id != null) {
        payload.handled_by = user.id;
      }

      await callService.create(payload);

      toastService.success("تماس با موفقیت ثبت شد.");

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Quick call submit error:", error);
      toastService.error(error?.response?.data?.detail || "خطا در ثبت تماس.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title="ثبت تماس سریع">
      {/* ─── Person Mode Toggle ─── */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium text-foreground">
          نوع تماس با:
        </span>
        <div className="flex rounded-xl border border-border overflow-hidden">
          <button
            type="button"
            onClick={() => setPersonMode("customer")}
            disabled={loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              personMode === "customer"
                ? "bg-primary/10 text-primary"
                : "text-muted hover:text-foreground"
            }`}
          >
             مشتری
          </button>
          <button
            type="button"
            onClick={() => setPersonMode("owner")}
            disabled={loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors border-r border-border cursor-pointer ${
              personMode === "owner"
                ? "bg-primary/10 text-primary"
                : "text-muted hover:text-foreground"
            }`}
          >
             مالک
          </button>
        </div>
      </div>

      {/* ─── Form (uses existing FormRenderer) ─── */}
      <FormRenderer
        config={formConfig}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}
