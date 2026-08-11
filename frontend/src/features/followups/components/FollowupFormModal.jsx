import { useState } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { FOLLOWUP_FORM } from "@/features/followups/config";
import followupService from "@/features/followups/services/followupService";

export default function FollowupFormModal({
  isOpen,
  onClose,
  followup = null,
  onSuccess,
  extraData = {},
}) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!followup?.id;

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const payload = {
        title: values.title,
        type: values.type,
        status: values.status || "pending",
        user: values.user ? Number(values.user) : null,
        customer: values.customer ? Number(values.customer) : null,
        property: values.property ? Number(values.property) : null,
        description: values.description || "",
        due_at: values.due_at
          ? new Date(values.due_at).toISOString()
          : null,
        completed_at:
          values.status === "done" && values.completed_at
            ? new Date(values.completed_at).toISOString()
            : values.status === "done"
            ? new Date().toISOString()
            : null,
      };

      if (isEdit) {
        await followupService.update(followup.id, payload);
      } else {
        await followupService.create(payload);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Followup form submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Normalize for form (especially Edit mode)
  const defaultValues = followup
    ? {
        ...followup,
        user: followup.user?.id ?? followup.user,
        customer: followup.customer?.id ?? followup.customer,
        property: followup.property?.id ?? followup.property,
        due_at: followup.due_at ? followup.due_at.slice(0, 16) : "",
        completed_at: followup.completed_at
          ? followup.completed_at.slice(0, 16)
          : "",
      }
    : {
        type: "follow_up",
        status: "pending",
      };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={isEdit ? "ویرایش پیگیری" : "ثبت پیگیری جدید"}
    >
      <FormRenderer
        config={FOLLOWUP_FORM}
        defaultValues={defaultValues}
        mode={isEdit ? "edit" : "create"}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
        extraData={extraData}
      />
    </Modal>
  );
}