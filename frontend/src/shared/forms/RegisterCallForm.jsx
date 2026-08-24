// src/shared/forms/RegisterCallForm.jsx
import { useMemo, useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import callService from "@/features/calls/services/callService";
import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { toastService } from "@/lib/toast";

/**
 * CallLog (Backend):
 * POST /api/calls/
 * required: customer, call_type (incoming|outgoing), result, called_at
 * optional: property, listing, note, call_duration, next_follow_up_at,
 *           follow_up_done, record_file
 * auto: agency, handled_by
 */

export const REGISTER_CALL_FORM_CONFIG = {
  title: "ثبت تماس",
  description: "تماس جدید در CRM ثبت می‌شود",
  tabs: null,
  fields: [
    {
      key: "customer",
      label: "مشتری",
      type: "search_select",
      required: true,
      placeholder: "جستجوی مشتری...",
      asyncSource: API_ENDPOINTS.CUSTOMERS.LIST.url,
      searchFields: ["full_name", "phone"],
      displayField: "full_name",
      validation: { required: "انتخاب مشتری الزامی است" },
      span: 12,
    },
    {
      key: "call_type",
      label: "نوع تماس",
      type: "select",
      required: true,
      options: [
        { value: "incoming", label: "ورودی" },
        { value: "outgoing", label: "خروجی" },
      ],
      defaultValue: "outgoing",
      validation: { required: "نوع تماس الزامی است" },
      span: 6,
    },
    {
      key: "called_at",
      label: "زمان تماس",
      type: "datetime",
      required: true,
      defaultValue: "now",
      validation: { required: "زمان تماس الزامی است" },
      span: 6,
    },
    {
      key: "result",
      label: "نتیجه تماس",
      type: "select",
      required: true,
      options: [
        { value: "answered", label: "پاسخ داده شد" },
        { value: "no_answer", label: "پاسخ نداد" },
        { value: "busy", label: "مشغول" },
        { value: "interested", label: "علاقه‌مند" },
        { value: "not_interested", label: "عدم تمایل" },
        { value: "follow_up", label: "نیاز به پیگیری" },
        { value: "visit_booked", label: "بازدید ثبت شد" },
      ],
      validation: { required: "نتیجه تماس الزامی است" },
      span: 6,
    },
    {
      key: "call_duration",
      label: "مدت تماس (ثانیه)",
      type: "number",
      required: false,
      min: 0,
      defaultValue: 0,
      placeholder: "مثلاً ۱۲۰",
      span: 6,
    },
    {
      key: "note",
      label: "یادداشت",
      type: "textarea",
      required: false,
      rows: 3,
      placeholder: "جزئیات تماس...",
      span: 12,
    },
    {
      key: "next_follow_up_at",
      label: "پیگیری بعدی",
      type: "datetime",
      required: false,
      span: 6,
    },
    {
      key: "follow_up_done",
      label: "پیگیری انجام شد",
      type: "checkbox",
      required: false,
      defaultValue: false,
      span: 6,
    },
    {
      key: "record_file",
      label: "فایل صوتی (اختیاری)",
      type: "file",
      required: false,
      accept: "audio/*",
      span: 12,
    },
  ],
  actions: {
    submit: { label: "ثبت تماس", variant: "primary" },
    cancel: { label: "انصراف", variant: "ghost" },
  },
};

function buildContextLine({ property, listing }) {
  if (property) {
    const code = property.property_code ? ` — ${property.property_code}` : "";
    return `ملک: ${property.title || `#${property.id}`}${code}`;
  }
  if (listing) {
    const ext = listing.external_id ? ` — ${listing.external_id}` : "";
    return `آگهی: ${listing.title || `#${listing.id}`}${ext}`;
  }
  return null;
}

function toIso(v) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/**
 * RegisterCallForm — مرکزی
 *
 * props:
 *  - isOpen, onClose, onSuccess
 *  - property?: { id, title, property_code }
 *  - listing?:  { id, title, external_id }
 *  - defaultValues?: partial form overrides
 */
export default function RegisterCallForm({
  isOpen,
  onClose,
  onSuccess,
  property = null,
  listing = null,
  defaultValues = {},
}) {
  const [loading, setLoading] = useState(false);

  const initialValues = useMemo(
    () => ({
      call_type: "outgoing",
      call_duration: 0,
      follow_up_done: false,
      called_at: new Date().toISOString().slice(0, 16),
      note: "",
      ...defaultValues,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isOpen, property?.id, listing?.id],
  );

  const contextLine = buildContextLine({ property, listing });

  const handleSubmit = async (data) => {
    if (!data.customer) {
      throw new Error("customer required");
    }

    setLoading(true);
    try {
      const payload = {
        customer: data.customer,
        call_type: data.call_type || "outgoing",
        result: data.result,
        note: data.note || "",
        call_duration: Number(data.call_duration) || 0,
        called_at: toIso(data.called_at) || new Date().toISOString(),
        next_follow_up_at: toIso(data.next_follow_up_at),
        follow_up_done: Boolean(data.follow_up_done),
      };

      if (property?.id) payload.property = property.id;
      if (listing?.id) payload.listing = listing.id;

      if (data.record_file instanceof File) {
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => {
          if (v !== null && v !== undefined) fd.append(k, String(v));
        });
        fd.append("record_file", data.record_file);

        await api.post(API_ENDPOINTS.CRM.CALLS.CREATE.url, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await callService.create(payload);
      }

      toastService.success("تماس با موفقیت ثبت شد.");
      onSuccess?.(payload);
      onClose?.();
    } catch (error) {
      toastService.error(error?.response?.data?.detail || "خطا در ثبت تماس.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="ثبت تماس">
      {contextLine && (
        <p className="text-sm text-muted mb-3 truncate">{contextLine}</p>
      )}

      <FormRenderer
        config={REGISTER_CALL_FORM_CONFIG}
        defaultValues={initialValues}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
        extraData={{ property, listing }}
      />
    </Modal>
  );
}