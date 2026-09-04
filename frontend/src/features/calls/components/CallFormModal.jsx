import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { CALL_FORM } from "@/features/calls/config";
import callService from "@/features/calls/services/callService";
import useAuthStore from "@/store/useAuthStore";
import { toastService } from "@/lib/toast";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import api from "@/lib/api";
import { User, Home } from "lucide-react";
import CustomerFormModal from "@/features/customers/components/CustomerFormModal";
import OwnerFormModal from "@/features/owners/components/OwnerFormModal";

export default function CallFormModal({
  isOpen,
  onClose,
  call = null,
  onSuccess,
  extraData = {},
}) {
  const [loading, setLoading] = useState(false);
  const [personMode, setPersonMode] = useState("customer");
  const [customerCreateOpen, setCustomerCreateOpen] = useState(false);
  const [ownerCreateOpen, setOwnerCreateOpen] = useState(false);
  const [relatedProperties, setRelatedProperties] = useState([]);
  const user = useAuthStore((s) => s.user);
  const isEdit = !!call?.id;

  /* ─── Form config: remove property/listing fields, switch source by mode ─── */
  const formConfig = useMemo(() => {
    const config = JSON.parse(JSON.stringify(CALL_FORM));

    if (config.tabs?.[0]?.fields) {
      config.tabs[0].fields = config.tabs[0].fields.filter(
        (f) => f.key !== "property" && f.key !== "listing",
      );

      const customerIdx = config.tabs[0].fields.findIndex(
        (f) => f.key === "customer",
      );
      if (customerIdx !== -1) {
        const f = config.tabs[0].fields[customerIdx];
        config.tabs[0].fields[customerIdx] = {
          ...f,
          asyncSource:
            personMode === "owner"
              ? API_ENDPOINTS.OWNERS.LIST.url
              : API_ENDPOINTS.CUSTOMERS.LIST.url,
          placeholder:
            personMode === "owner" ? "جستجوی مالک..." : "جستجوی مشتری...",
          label: personMode === "owner" ? "مالک" : "مشتری / تماس‌گیرنده",
        };
      }
    }
    return config;
  }, [personMode]);

  /* Add addAction (functions can't survive JSON.parse) */
  const formConfigWithActions = useMemo(() => {
    const cfg = { ...formConfig };
    if (cfg.tabs?.[0]?.fields) {
      cfg.tabs[0].fields = cfg.tabs[0].fields.map((f) =>
        f.key === "customer"
          ? {
              ...f,
              addAction: () =>
                personMode === "owner"
                  ? setOwnerCreateOpen(true)
                  : setCustomerCreateOpen(true),
              addActionLabel:
                personMode === "owner" ? "مالک جدید" : "مشتری جدید",
            }
          : f,
      );
    }
    return cfg;
  }, [formConfig, personMode]);

  /* ─── Track selected person for related properties ─── */
  const lastFetchedPersonId = useRef(null);

  const handleValuesChange = useCallback(
    (values) => {
      const personId = values?.customer;
      if (!personId || personMode !== "owner") {
        if (lastFetchedPersonId.current !== null) {
          lastFetchedPersonId.current = null;
          setRelatedProperties([]);
        }
        return;
      }
      if (lastFetchedPersonId.current === personId) return;
      lastFetchedPersonId.current = personId;

      api
        .get(API_ENDPOINTS.OWNERS.DETAIL(personId).url)
        .then((res) => setRelatedProperties(res.data.properties || []))
        .catch(() => setRelatedProperties([]));
    },
    [personMode],
  );

  /* ─── Reset on modal open ─── */
  const [formKey, setFormKey] = useState(0);
  useEffect(() => {
    if (isOpen) {
      setFormKey((k) => k + 1);
      setPersonMode("customer");
      setRelatedProperties([]);
      lastFetchedPersonId.current = null;
    }
  }, [isOpen]);

  /* ─── Submit ─── */
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const personId = Number(values.customer);
      if (!personId) {
        toastService.error("لطفاً یک شخص انتخاب کنید.");
        setLoading(false);
        return;
      }

      // In owner mode the backend resolves the owner to a landlord customer
      // by phone (reusing an existing one if present), so send the owner id.
      const payload = {
        ...(personMode === "owner"
          ? { owner: personId }
          : { customer: personId }),
        call_type: values.call_type,
        result: values.result,
        note: values.note || "",
        called_at: values.called_at || new Date().toISOString(),
        call_duration: values.call_duration ? Number(values.call_duration) : 0,
      };

      if (!isEdit && user?.id != null) payload.handled_by = user.id;

      if (isEdit) {
        await callService.update(call.id, payload);
        toastService.success("تماس با موفقیت ویرایش شد.");
      } else {
        await callService.create(payload);
        toastService.success("تماس با موفقیت ثبت شد.");
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Call form submit error:", error);
      toastService.error(
        error?.response?.data?.detail || "خطا در ثبت اطلاعات تماس.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ─── Existing recording name (edit mode) ─── */
  const currentRecordingName = useMemo(() => {
    const url = call?.record_file;
    if (!url || typeof url !== "string") return null;
    return url.split(/[?#]/)[0].split("/").pop() || url;
  }, [call]);

  /* ─── Default values ─── */
  const defaultValues = useMemo(() => {
    if (call) {
      return {
        customer: call.customer?.id ?? call.customer,
        call_type: call.call_type || "outgoing",
        result: call.result || "answered",
        note: call.note || "",
        called_at: call.called_at || "",
        call_duration: call.call_duration || 0,
      };
    }
    return {
      customer: extraData?.customer || null,
      property: extraData?.property || null,
      listing: extraData?.listing || null,
      call_type: "outgoing",
      result: "answered",
      note: "",
      called_at: "",
      call_duration: 0,
    };
  }, [call, extraData]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        title={isEdit ? "ویرایش تماس" : "ثبت تماس جدید"}
      >
        {/* Toggle + related properties */}
        <div className="flex items-center justify-between gap-4 mb-4">
          {!isEdit && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                نوع تماس با:
              </span>
              <div className="flex rounded-xl border border-border overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    setPersonMode("customer");
                    setRelatedProperties([]);
                    lastFetchedPersonId.current = null;
                  }}
                  disabled={loading}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    personMode === "customer"
                      ? "bg-(--role-primary)/30 text-(--role-primary)"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  <User size={14} className="inline" /> مشتری
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPersonMode("owner");
                    setRelatedProperties([]);
                    lastFetchedPersonId.current = null;
                  }}
                  disabled={loading}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors border-r border-border cursor-pointer ${
                    personMode === "owner"
                      ? "bg-(--role-primary)/30 text-(--role-primary)"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  <Home size={14} className="inline" /> مالک
                </button>
              </div>
            </div>
          )}

          {personMode === "owner" && relatedProperties.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Home size={14} className="text-muted" />
              <span>
                {relatedProperties[0].title ||
                  relatedProperties[0].property_code}
              </span>
              {relatedProperties.length > 1 && (
                <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  +{relatedProperties.length - 1}
                </span>
              )}
            </div>
          )}
        </div>

        {currentRecordingName && (
          <p className="mb-3 text-xs text-muted">
            فایل صوتی فعلی:{" "}
            <span dir="ltr" className="font-medium text-foreground">
              {currentRecordingName}
            </span>
            {" "}— اگر فایل جدیدی انتخاب نکنید، فایل قبلی حفظ می‌شود.
          </p>
        )}

        <FormRenderer
          key={formKey}
          config={formConfigWithActions}
          defaultValues={defaultValues}
          mode={isEdit ? "edit" : "create"}
          onSubmit={handleSubmit}
          onCancel={onClose}
          loading={loading}
          extraData={extraData}
          onValuesChange={handleValuesChange}
        />
      </Modal>

      {customerCreateOpen && (
        <CustomerFormModal
          isOpen={customerCreateOpen}
          onClose={() => setCustomerCreateOpen(false)}
          onSuccess={() => setCustomerCreateOpen(false)}
        />
      )}
      {ownerCreateOpen && (
        <OwnerFormModal
          isOpen={ownerCreateOpen}
          onClose={() => setOwnerCreateOpen(false)}
          onSuccess={() => setOwnerCreateOpen(false)}
        />
      )}
    </>
  );
}
