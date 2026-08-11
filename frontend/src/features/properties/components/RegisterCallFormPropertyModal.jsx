// features/properties/components/RegisterCallFromPropertyModal.jsx
import { useState, useMemo } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { REGISTER_CALL_FROM_PROPERTY_FORM } from "@/features/properties/config";
import callService from "@/features/calls/services/callService";
import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export default function RegisterCallFromPropertyModal({
  isOpen,
  onClose,
  property,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const initialValues = useMemo(
    () => ({
      call_type: "outgoing",
      call_duration: 0,
      follow_up_done: false,
      called_at: new Date().toISOString().slice(0, 16),
      note: "",
    }),
    [property?.id, isOpen],
  );

  const handleSubmit = async (data) => {
    if (!property?.id) return;
    setLoading(true);
    try {
      const payload = {
        customer: data.customer,
        property: property.id,
        call_type: data.call_type, // incoming | outgoing
        result: data.result,
        note: data.note || "",
        call_duration: Number(data.call_duration) || 0,
        called_at: data.called_at
          ? new Date(data.called_at).toISOString()
          : new Date().toISOString(),
        next_follow_up_at: data.next_follow_up_at
          ? new Date(data.next_follow_up_at).toISOString()
          : null,
        follow_up_done: Boolean(data.follow_up_done),
      };

      if (data.record_file instanceof File) {
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => {
          if (v != null) fd.append(k, String(v));
        });
        fd.append("record_file", data.record_file);
        await api.post(API_ENDPOINTS.CRM.CALLS.CREATE.url, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await callService.create(payload);
      }

      onSuccess?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="ثبت تماس از ملک">
      {property && (
        <p className="text-sm text-muted mb-3 truncate">
          ملک: <strong>{property.title}</strong>
          {property.property_code ? ` — ${property.property_code}` : ""}
        </p>
      )}
      <FormRenderer
        config={REGISTER_CALL_FROM_PROPERTY_FORM}
        defaultValues={initialValues}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}