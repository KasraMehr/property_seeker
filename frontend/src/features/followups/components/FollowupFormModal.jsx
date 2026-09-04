import { useState, useMemo } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { FOLLOWUP_FORM } from "@/features/followups/config";
import followupService from "@/features/followups/services/followupService";
import useAuth from "@/features/auth/hooks/useAuth";
import { toastService } from "@/lib/toast";

export default function FollowupFormModal({
  isOpen,
  onClose,
  followup = null,
  onSuccess,
  extraData = {},
}) {
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();
  const isEdit = !!followup?.id;
  const isOperator = !currentUser?.is_owner;

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        title: values.title,
        type: values.type,
        status: values.status || "pending",
        user: values.user ? Number(values.user) : undefined,
        // Always send customer/property so clearing them in the form
        // actually detaches the link on save.
        customer: values.customer ? Number(values.customer) : null,
        property: values.property ? Number(values.property) : null,
        description: values.description || "",
        due_at: values.due_at || undefined,
        ...(values.status === "done"
          ? {
              completed_at: values.completed_at || new Date().toISOString(),
            }
          : {}),
      };

      if (isEdit) {
        await followupService.update(followup.id, payload);
        toastService.success("پیگیری با موفقیت ویرایش شد.");
      } else {
        await followupService.create(payload);
        toastService.success("پیگیری جدید با موفقیت ثبت شد.");
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      const msg = error?.response?.data?.detail || error?.response?.data?.message;
      toastService.error(typeof msg === "string" ? msg : "خطا در ذخیره پیگیری.");
    } finally {
      setLoading(false);
    }
  };

  const defaultValues = useMemo(() => {
    if (followup) {
      return {
        ...followup,
        user: followup.user?.id ?? followup.user,
        customer: followup.customer?.id ?? followup.customer,
        property: followup.property?.id ?? followup.property,
        due_at: followup.due_at || "",
        completed_at: followup.completed_at || "",
      };
    }
    return { type: "follow_up", status: "pending", user: currentUser?.id || null };
  }, [followup, currentUser]);

  // Operator: replace async user field with static select (API blocked for non-owners)
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
      fields: tab.fields.map((f) =>
        f.key === "user" ? userFieldOverride : f
      ),
    }));

    return { ...FOLLOWUP_FORM, tabs: modifiedTabs };
  }, [isOperator, currentUser]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title={isEdit ? "ویرایش پیگیری" : "ثبت پیگیری جدید"}>
      <FormRenderer
        config={formConfig}
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
