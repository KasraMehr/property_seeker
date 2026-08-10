import { useState, useMemo } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { REGISTER_CALL_FROM_LISTING_FORM } from "@/features/listings/config";
import callService from "@/features/calls/services/callService";
import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export default function RegisterCallFromListingModal({
  isOpen,
  onClose,
  listing,
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
    [listing?.id, isOpen],
  );

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const hasFile = data.record_file instanceof File;

      if (hasFile) {
        const fd = new FormData();
        fd.append("customer", data.customer);
        fd.append("listing", String(listing.id));
        fd.append("call_type", data.call_type);
        fd.append("result", data.result);
        fd.append("note", data.note || "");
        fd.append("call_duration", String(data.call_duration || 0));
        fd.append(
          "called_at",
          data.called_at
            ? new Date(data.called_at).toISOString()
            : new Date().toISOString(),
        );
        if (data.next_follow_up_at) {
          fd.append(
            "next_follow_up_at",
            new Date(data.next_follow_up_at).toISOString(),
          );
        }
        fd.append("follow_up_done", data.follow_up_done ? "true" : "false");
        fd.append("record_file", data.record_file);

        await api.post(API_ENDPOINTS.CRM.CALLS.CREATE.url, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await callService.create({
          customer: data.customer,
          listing: listing.id,
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
        });
      }

      onSuccess?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="ثبت تماس از آگهی"
    >
      {listing && (
        <p className="text-sm text-muted mb-3 truncate">
          آگهی: <strong>{listing.title}</strong>
          {listing.external_id ? ` — ${listing.external_id}` : ""}
        </p>
      )}

      <FormRenderer
        config={REGISTER_CALL_FROM_LISTING_FORM}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}