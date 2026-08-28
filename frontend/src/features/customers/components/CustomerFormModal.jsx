import { useState, useMemo } from "react";
import Modal from "@/shared/ui/modal/Modal";
import FormRenderer from "@/shared/page/FormRenderer";
import { CUSTOMER_FORM } from "@/features/customers/config";
import customerService from "@/features/customers/services/customerService";
import useAuth from "@/features/auth/hooks/useAuth";
import { toastService } from "@/lib/toast";

export default function CustomerFormModal({
  isOpen,
  onClose,
  customer = null,
  onSuccess,
  extraData = {},
}) {
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();
  const isEdit = !!customer?.id;
  const isOperator = !currentUser?.is_owner;

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const payload = {
        full_name: values.full_name,
        phone: values.phone,
        email: values.email || null,
        customer_type: values.customer_type,
        status: values.status || "new",
        assigned_agent: values.assigned_agent
          ? Number(values.assigned_agent)
          : null,
        source: values.source || "",
        notes: values.notes || "",
        tags: values.tags ? values.tags.map(Number) : [],
      };

      if (isEdit) {
        await customerService.update(customer.id, payload);
        toastService.success("مشتری با موفقیت ویرایش شد.");
      } else {
        await customerService.create(payload);
        toastService.success("مشتری جدید با موفقیت ثبت شد.");
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      const msg = error?.response?.data?.detail || error?.response?.data?.message;
      toastService.error(typeof msg === "string" ? msg : "خطا در ذخیره مشتری.");
    } finally {
      setLoading(false);
    }
  };

  // Normalize برای حالت Edit
  const defaultValues = customer
    ? {
        ...customer,
        assigned_agent:
          customer.assigned_agent?.id ?? customer.assigned_agent ?? null,
        tags: customer.tags?.map((t) => t.id ?? t) || [],
      }
    : {
        status: "new",
        customer_type: "buyer",
      };

  // Operator: replace async assigned_agent field with static read-only select
  const formConfig = useMemo(() => {
    if (!isOperator) return CUSTOMER_FORM;

    const agentFieldOverride = {
      key: "assigned_agent",
      label: "کارشناس مسئول",
      type: "select",
      required: false,
      readOnly: true,
      options: [{ value: currentUser.id, label: currentUser.full_name }],
      defaultValue: currentUser.id,
      span: 6,
    };

    const modifiedFields = CUSTOMER_FORM.fields.map((f) =>
      f.key === "assigned_agent" ? agentFieldOverride : f,
    );

    return { ...CUSTOMER_FORM, fields: modifiedFields };
  }, [isOperator, currentUser]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={isEdit ? "ویرایش مشتری" : "ثبت مشتری جدید"}
    >
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