import { useState, useMemo } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { FOLLOWUP_FORM } from "@/features/followups/config";
import followupService from "@/features/followups/services/followupService";
import { toastService } from "@/lib/toast";
import useAuth from "@/features/auth/hooks/useAuth";

/**
 * Quick Followup from Call
 * Reuses FOLLOWUP_FORM but auto-fills customer, property, title from call data.
 */
export default function QuickFollowupModal({ isOpen, onClose, call = null, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();
  const isOperator = !currentUser?.is_owner;

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        title: values.title,
        type: values.type,
        status: values.status || "pending",
        user: values.user ? Number(values.user) : currentUser?.id,
        ...(values.customer ? { customer: Number(values.customer) } : {}),
        ...(values.property ? { property: Number(values.property) } : {}),
        description: values.description || "",
        due_at: values.due_at || undefined,
        ...(values.status === "done"
          ? {
              completed_at: values.completed_at || new Date().toISOString(),
            }
          : {}),
      };

      await followupService.create(payload);
      toastService.success("پیگیری با موفقیت ثبت شد.");
      onSuccess?.();
      onClose();
    } catch (error) {
      const msg = error?.response?.data?.detail || error?.response?.data?.message;
      toastService.error(typeof msg === "string" ? msg : "خطا در ثبت پیگیری.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fill default values from call
  const defaultValues = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    return {
      title: call?.note
        ? `پیگیری: ${call.note.slice(0, 50)}`
        : "پیگیری پس از تماس",
      type: "follow_up",
      status: "pending",
      user: currentUser?.id || null,
      customer: call?.customer?.id ?? call?.customer ?? null,
      property: call?.property?.id ?? call?.property ?? null,
      due_at: tomorrow.toISOString(),
      description: call?.note || "",
    };
  }, [call, currentUser]);

  // Operator: replace async user field with static read-only select
  const formConfig = useMemo(() => {
    if (!isOperator) return FOLLOWUP_FORM;

    const userFieldOverride = {
      key: "user",
      label: "مسئول پیگیری",
      type: "select",
      required: true,
      readOnly: true,
      options: [{ value: currentUser.id, label: currentUser.full_name }],
      defaultValue: currentUser.id,
      span: 6,
    };

    const modifiedTabs = FOLLOWUP_FORM.tabs.map((tab) => ({
      ...tab,
      fields: tab.fields.map((f) => (f.key === "user" ? userFieldOverride : f)),
    }));

    return { ...FOLLOWUP_FORM, tabs: modifiedTabs };
  }, [isOperator, currentUser]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="ثبت پیگیری از تماس"
    >
      <FormRenderer
        config={formConfig}
        defaultValues={defaultValues}
        mode="create"
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}